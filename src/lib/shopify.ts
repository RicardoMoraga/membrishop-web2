/**
 * Cliente mínimo de la Storefront API de Shopify, sin dependencias externas
 * (fetch nativo). Se usa solo para leer precio/stock por `handle` y para
 * crear el carrito que redirige al checkout — nada de esto pasa por el
 * Admin API ni maneja credenciales de comerciante.
 *
 * Contrato clave: el `handle` del producto en Shopify == slug del pilar en
 * `clusters.ts` (`collar-gps`, `fuente-agua`, …). Así no hace falta tabla de
 * mapeo: se pide por slug y se compara 1 a 1.
 *
 * Degrada a `null`/`[]` si faltan las variables de entorno, así que
 * `next build` sigue pasando aunque Shopify no esté configurado (por
 * ejemplo en Preview antes de cargar las variables).
 */

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2025-01";

const shopifyConfigurado = Boolean(STORE_DOMAIN && STOREFRONT_TOKEN);

type StorefrontResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

async function storefrontFetch<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T | null> {
  if (!shopifyConfigurado) return null;

  try {
    const res = await fetch(`https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN as string,
      },
      body: JSON.stringify({ query, variables }),
      // ISR de 1 hora: precio/stock no necesitan tiempo real para una
      // landing de dropshipping, y evita golpear la API en cada visita.
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as StorefrontResponse<T>;
    if (json.errors?.length) return null;
    return json.data ?? null;
  } catch {
    // Cualquier fallo de red degrada a "sin datos de Shopify": el llamador
    // vuelve a mostrar el CTA de WhatsApp en vez de romper la página.
    return null;
  }
}

export type ProductoShopify = {
  id: string;
  handle: string;
  disponible: boolean;
  precio: { monto: string; moneda: string } | null;
  checkoutUrl: string | null;
};

const QUERY_PRODUCTO_POR_HANDLE = /* GraphQL */ `
  query ProductoPorHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      availableForSale
      variants(first: 1) {
        edges {
          node {
            id
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

/**
 * Precio y disponibilidad de un producto por su `handle`. Devuelve `null`
 * si Shopify no está configurado, si el producto no existe con ese handle,
 * o si no está publicado en el canal Headless (la Storefront API solo ve
 * lo publicado en el canal cuyo token se usó).
 */
export async function getProductoPorHandle(handle: string): Promise<ProductoShopify | null> {
  const data = await storefrontFetch<{
    productByHandle: {
      id: string;
      availableForSale: boolean;
      variants: { edges: { node: { id: string; availableForSale: boolean; price: { amount: string; currencyCode: string } } }[] };
    } | null;
  }>(QUERY_PRODUCTO_POR_HANDLE, { handle });

  const producto = data?.productByHandle;
  if (!producto) return null;

  const variante = producto.variants.edges[0]?.node ?? null;

  return {
    id: producto.id,
    handle,
    disponible: producto.availableForSale && (variante?.availableForSale ?? false),
    precio: variante ? { monto: variante.price.amount, moneda: variante.price.currencyCode } : null,
    checkoutUrl: null,
  };
}

const MUTATION_CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Arma un carrito de una sola línea y devuelve la URL de checkout de
 * Shopify. Se usa desde la Server Action `comprar` — no se llama desde el
 * cliente para no exponer el token de Storefront innecesariamente en el
 * bundle (igual es público por diseño, pero mantiene un solo punto de uso).
 */
export async function crearCheckoutUrl(merchandiseId: string, cantidad = 1): Promise<string | null> {
  const data = await storefrontFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(MUTATION_CART_CREATE, { lines: [{ merchandiseId, quantity: cantidad }] });

  const cart = data?.cartCreate?.cart;
  if (!cart || data?.cartCreate?.userErrors?.length) return null;

  return cart.checkoutUrl;
}

/** Variante (no producto) por handle: `cartCreate` necesita el ID de variante. */
const QUERY_VARIANTE_POR_HANDLE = /* GraphQL */ `
  query VariantePorHandle($handle: String!) {
    productByHandle(handle: $handle) {
      variants(first: 1) {
        edges {
          node {
            id
            availableForSale
          }
        }
      }
    }
  }
`;

export async function getVarianteIdPorHandle(handle: string): Promise<string | null> {
  const data = await storefrontFetch<{
    productByHandle: { variants: { edges: { node: { id: string; availableForSale: boolean } }[] } } | null;
  }>(QUERY_VARIANTE_POR_HANDLE, { handle });

  const variante = data?.productByHandle?.variants.edges[0]?.node;
  if (!variante || !variante.availableForSale) return null;
  return variante.id;
}

export { shopifyConfigurado };
