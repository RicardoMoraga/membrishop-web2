/**
 * Cliente de la Storefront API de Shopify. Fetch nativo, sin dependencias.
 *
 * REGLA DEL PROYECTO: Shopify es la única fuente de verdad para precio, stock,
 * disponibilidad, variantes y SKU. `clusters.ts` aporta contenido editorial
 * (copy, especificaciones, FAQ) y jamás datos comerciales.
 *
 * Contrato: el `handle` del producto en Shopify == slug del pilar.
 *
 * Cinco estados de integración, en vez del `null` para todo que tenía la
 * versión original: agotado y caído dejan de ser indistinguibles, y todo fallo
 * queda registrado con prefijo `[shopify]`.
 */

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2025-01";

const shopifyConfigurado = Boolean(STORE_DOMAIN && STOREFRONT_TOKEN);

export type EstadoIntegracion =
  | "ok-disponible"
  | "ok-agotado"
  | "no-encontrado"
  | "sin-configurar"
  | "error-api";

export function esFalloDeIntegracion(estado: EstadoIntegracion): boolean {
  return estado === "sin-configurar" || estado === "error-api";
}

/** Etiqueta de caché por producto. Contrato con /api/revalidate. */
export function etiquetaProducto(handle: string): string {
  return `producto:${handle}`;
}

export const ETIQUETA_CATALOGO = "productos";

type RespuestaFetch<T> =
  | { estado: "ok"; data: T }
  | { estado: "sin-configurar" }
  | { estado: "error-api"; detalle: string };

function registrarFallo(operacion: string, detalle: string): void {
  console.error(`[shopify] ${operacion} — ${detalle}`);
}

async function storefrontFetch<T>(
  operacion: string,
  query: string,
  variables: Record<string, unknown>,
  cache?: { tags: string[] } | "sin-cache",
): Promise<RespuestaFetch<T>> {
  if (!shopifyConfigurado) {
    registrarFallo(
      operacion,
      "sin configurar: falta NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN o SHOPIFY_STOREFRONT_TOKEN",
    );
    return { estado: "sin-configurar" };
  }

  try {
    const res = await fetch(`https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN as string,
      },
      body: JSON.stringify({ query, variables }),
      // Lecturas: ISR de una hora como red de seguridad, más etiqueta por
      // producto para que el webhook pueda invalidar al instante.
      // Mutaciones: nunca se cachean.
      ...(cache === "sin-cache"
        ? { cache: "no-store" as const }
        : { next: { revalidate: 3600, tags: cache?.tags } }),
    });

    if (!res.ok) {
      const detalle = `HTTP ${res.status} desde ${STORE_DOMAIN}`;
      registrarFallo(operacion, detalle);
      return { estado: "error-api", detalle };
    }

    const json = (await res.json()) as { data?: T; errors?: { message: string }[] };

    if (json.errors?.length) {
      const detalle = json.errors.map((e) => e.message).join(" · ");
      registrarFallo(operacion, `GraphQL: ${detalle}`);
      return { estado: "error-api", detalle };
    }

    if (!json.data) {
      const detalle = "respuesta sin campo `data`";
      registrarFallo(operacion, detalle);
      return { estado: "error-api", detalle };
    }

    return { estado: "ok", data: json.data };
  } catch (error) {
    const detalle = error instanceof Error ? error.message : "excepción desconocida";
    registrarFallo(operacion, detalle);
    return { estado: "error-api", detalle };
  }
}

/* ==========================================================================
   Tipos del dominio
   ========================================================================== */

export type MedioShopify =
  | { tipo: "imagen"; url: string; alt: string; ancho: number | null; alto: number | null }
  | { tipo: "video"; url: string; poster: string | null; alt: string };

export type VarianteShopify = {
  id: string;
  titulo: string;
  sku: string | null;
  disponible: boolean;
  /** Solo con el scope `unauthenticated_read_product_inventory`. */
  cantidadDisponible: number | null;
  precio: number;
  moneda: string;
  opciones: { nombre: string; valor: string }[];
  imagenUrl: string | null;
};

export type ProductoShopify = {
  id: string;
  handle: string;
  titulo: string;
  disponible: boolean;
  sku: string | null;
  precio: number | null;
  moneda: string;
  opciones: { nombre: string; valores: string[] }[];
  variantes: VarianteShopify[];
  medios: MedioShopify[];
  /** `true` si el producto tiene opciones reales (no la variante por defecto). */
  tieneVariantes: boolean;
};

export type ResultadoProducto = {
  estado: EstadoIntegracion;
  producto: ProductoShopify | null;
  detalle?: string;
};

/* ==========================================================================
   Consulta de producto
   ========================================================================== */

/**
 * `quantityAvailable` exige el scope `unauthenticated_read_product_inventory`
 * en el token del canal Headless. Si el scope no está activo, Shopify responde
 * con un error de acceso y tumbaría la consulta entera.
 *
 * En vez de exigir configuración extra, la primera negativa baja esta bandera
 * y el resto de la vida del proceso consulta sin ese campo. El sitio funciona
 * con o sin el scope; con él, además, puede mostrar unidades reales.
 */
let inventarioPermitido = true;

function queryProducto(conInventario: boolean): string {
  return /* GraphQL */ `
    query ProductoPorHandle($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        availableForSale
        options { name values }
        media(first: 20) {
          nodes {
            mediaContentType
            alt
            ... on MediaImage { image { url altText width height } }
            ... on Video { sources { url mimeType } previewImage { url } }
          }
        }
        variants(first: 50) {
          nodes {
            id
            title
            sku
            availableForSale
            ${conInventario ? "quantityAvailable" : ""}
            price { amount currencyCode }
            selectedOptions { name value }
            image { url }
          }
        }
      }
    }
  `;
}

type ProductoCrudo = {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  options: { name: string; values: string[] }[];
  media: {
    nodes: {
      mediaContentType: string;
      alt: string | null;
      image?: { url: string; altText: string | null; width: number | null; height: number | null };
      sources?: { url: string; mimeType: string }[];
      previewImage?: { url: string } | null;
    }[];
  };
  variants: {
    nodes: {
      id: string;
      title: string;
      sku: string | null;
      availableForSale: boolean;
      quantityAvailable?: number | null;
      price: { amount: string; currencyCode: string };
      selectedOptions: { name: string; value: string }[];
      image: { url: string } | null;
    }[];
  };
};

function esErrorDeScopeDeInventario(detalle: string): boolean {
  return /quantityAvailable|unauthenticated_read_product_inventory|access denied|scope/i.test(detalle);
}

function normalizar(crudo: ProductoCrudo): ProductoShopify {
  const variantes: VarianteShopify[] = crudo.variants.nodes.map((v) => ({
    id: v.id,
    titulo: v.title,
    sku: v.sku && v.sku.trim() !== "" ? v.sku : null,
    disponible: v.availableForSale,
    cantidadDisponible: typeof v.quantityAvailable === "number" ? v.quantityAvailable : null,
    precio: Number.parseFloat(v.price.amount),
    moneda: v.price.currencyCode,
    opciones: v.selectedOptions.map((o) => ({ nombre: o.name, valor: o.value })),
    imagenUrl: v.image?.url ?? null,
  }));

  const medios: MedioShopify[] = crudo.media.nodes.flatMap((m): MedioShopify[] => {
    if (m.image) {
      return [
        {
          tipo: "imagen" as const,
          url: m.image.url,
          alt: m.image.altText ?? m.alt ?? "",
          ancho: m.image.width,
          alto: m.image.height,
        },
      ];
    }
    const fuente = m.sources?.find((s) => s.mimeType === "video/mp4") ?? m.sources?.[0];
    if (fuente) {
      return [
        {
          tipo: "video" as const,
          url: fuente.url,
          poster: m.previewImage?.url ?? null,
          alt: m.alt ?? "",
        },
      ];
    }
    return [];
  });

  // Shopify entrega una variante "Default Title" cuando el producto no tiene
  // opciones reales. Ese caso no debe renderizar selector.
  const opcionesReales = crudo.options.filter(
    (o) => !(o.values.length === 1 && o.values[0] === "Default Title"),
  );

  const primeraDisponible = variantes.find((v) => v.disponible) ?? variantes[0] ?? null;

  return {
    id: crudo.id,
    handle: crudo.handle,
    titulo: crudo.title,
    disponible: crudo.availableForSale && variantes.some((v) => v.disponible),
    sku: primeraDisponible?.sku ?? null,
    precio: primeraDisponible?.precio ?? null,
    moneda: primeraDisponible?.moneda ?? "CLP",
    opciones: opcionesReales.map((o) => ({ nombre: o.name, valores: o.values })),
    variantes,
    medios,
    tieneVariantes: opcionesReales.length > 0,
  };
}

export async function getProductoPorHandle(handle: string): Promise<ResultadoProducto> {
  const etiquetas = { tags: [etiquetaProducto(handle), ETIQUETA_CATALOGO] };
  const operacion = `getProductoPorHandle(${handle})`;

  let res = await storefrontFetch<{ product: ProductoCrudo | null }>(
    operacion,
    queryProducto(inventarioPermitido),
    { handle },
    etiquetas,
  );

  // Reintento único sin `quantityAvailable` si el token no tiene el scope.
  if (res.estado === "error-api" && inventarioPermitido && esErrorDeScopeDeInventario(res.detalle)) {
    console.warn(
      "[shopify] el token no tiene `unauthenticated_read_product_inventory`: " +
        "se consulta sin unidades disponibles. La escasez real queda deshabilitada.",
    );
    inventarioPermitido = false;
    res = await storefrontFetch<{ product: ProductoCrudo | null }>(
      operacion,
      queryProducto(false),
      { handle },
      etiquetas,
    );
  }

  if (res.estado === "sin-configurar") return { estado: "sin-configurar", producto: null };
  if (res.estado === "error-api") {
    return { estado: "error-api", producto: null, detalle: res.detalle };
  }

  const crudo = res.data.product;
  if (!crudo) return { estado: "no-encontrado", producto: null };

  const producto = normalizar(crudo);
  return { estado: producto.disponible ? "ok-disponible" : "ok-agotado", producto };
}

/* ==========================================================================
   Carrito
   ========================================================================== */

const MUTATION_CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

export type ResultadoCheckout =
  | { estado: "ok"; checkoutUrl: string }
  | { estado: "sin-configurar" }
  | { estado: "error-api"; detalle: string };

/**
 * El host de `checkoutUrl` lo decide Shopify a partir del dominio primario de
 * la tienda. No se reescribe aquí ni debe reescribirse: mover el checkout a un
 * dominio de marca es configuración de Shopify, no código.
 */
export async function crearCheckoutUrl(
  merchandiseId: string,
  cantidad = 1,
): Promise<ResultadoCheckout> {
  const res = await storefrontFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(
    "crearCheckoutUrl",
    MUTATION_CART_CREATE,
    { lines: [{ merchandiseId, quantity: cantidad }] },
    "sin-cache",
  );

  if (res.estado === "sin-configurar") return { estado: "sin-configurar" };
  if (res.estado === "error-api") return { estado: "error-api", detalle: res.detalle };

  const errores = res.data.cartCreate?.userErrors ?? [];
  if (errores.length) {
    const detalle = errores.map((e) => e.message).join(" · ");
    registrarFallo("crearCheckoutUrl", `userErrors: ${detalle}`);
    return { estado: "error-api", detalle };
  }

  const cart = res.data.cartCreate?.cart;
  if (!cart) {
    const detalle = "cartCreate devolvió un carrito vacío";
    registrarFallo("crearCheckoutUrl", detalle);
    return { estado: "error-api", detalle };
  }

  return { estado: "ok", checkoutUrl: cart.checkoutUrl };
}

export { shopifyConfigurado };
