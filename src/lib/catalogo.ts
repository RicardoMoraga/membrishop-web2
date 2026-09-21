import { cache } from "react";
import { categorias as categoriasBase, type Categoria, type Pilar } from "@/content/clusters";
import { parsearFicha, type ContenidoFicha } from "@/lib/ficha";
import {
  ETIQUETA_CATALOGO,
  getProductoPorHandle,
  storefrontFetch,
  type ProductoShopify,
} from "@/lib/shopify";

/**
 * Catálogo dinámico: las colecciones de Shopify deciden qué productos existen
 * en la web. Publicar un producto ya no exige tocar código ni desplegar.
 *
 * Flujo: Dropify importa el producto → Claude lo cura (handle, SEO, metafield
 * `membrishop.ficha`) → se agrega a la colección de su nicho y se publica en el
 * canal Headless → el webhook invalida la etiqueta `productos` → aparece aquí.
 *
 * Reglas de mezcla:
 *   1. La colección de Shopify con handle == slug de la categoría es la fuente
 *      de verdad de QUÉ productos se muestran y en qué orden (orden manual).
 *   2. Si un producto tiene un pilar en `clusters.ts` con el mismo slug, ese
 *      contenido editorial se conserva (es el caso de `fuente-agua`).
 *   3. Los pilares de `clusters.ts` que no existen en Shopify ya NO se
 *      muestran: eran marcadores con precio referencial, no productos reales.
 *   4. Si Shopify no responde o no está configurado, se usa `clusters.ts`
 *      completo como respaldo, igual que antes de este cambio. El sitio nunca
 *      queda vacío por una caída de la integración.
 */

/** Fichas escritas a mano en `src/app/<nicho>/<slug>/page.tsx`. La ruta dinámica no las genera. */
export const FICHAS_ESTATICAS = new Set(["mascotas/fuente-agua"]);

export type OrigenCatalogo = "shopify" | "respaldo";

type ProductoLista = {
  handle: string;
  title: string;
  description: string;
  tags: string[];
  featuredImage: { url: string; altText: string | null } | null;
  seo: { title: string | null; description: string | null };
  ficha: { value: string } | null;
};

type ColeccionLista = { handle: string; products: { nodes: ProductoLista[] } } | null;

const QUERY_CATALOGO = /* GraphQL */ `
  fragment ColeccionCatalogo on Collection {
    handle
    products(first: 50, sortKey: COLLECTION_DEFAULT) {
      nodes {
        handle
        title
        description
        tags
        featuredImage { url altText }
        seo { title description }
        ficha: metafield(namespace: "membrishop", key: "ficha") { value }
      }
    }
  }
  query Catalogo(${categoriasBase.map((_, i) => `$h${i}: String!`).join(", ")}) {
    ${categoriasBase.map((_, i) => `c${i}: collection(handle: $h${i}) { ...ColeccionCatalogo }`).join("\n    ")}
  }
`;

function respaldo(categoria: Categoria): Categoria {
  return { ...categoria, pilares: categoria.pilares.map((p) => ({ ...p, origen: "clusters" as const })) };
}

function pilarDesdeShopify(n: ProductoLista, previo: Pilar | undefined): Pilar {
  const ficha = parsearFicha(n.ficha?.value, n.handle);
  const nombre = ficha?.nombre ?? previo?.nombre ?? n.title;
  return {
    slug: n.handle,
    nombre,
    gancho: ficha?.gancho ?? previo?.gancho ?? n.seo.description ?? "",
    problema: ficha?.problema ?? previo?.problema ?? "",
    tipo: n.tags.includes("core") ? "core" : (previo?.tipo ?? "trending"),
    precioDesde: previo?.precioDesde ?? null,
    imagen: {
      archivo: previo?.imagen.archivo ?? `${n.handle}.webp`,
      alt: n.featuredImage?.altText || previo?.imagen.alt || nombre,
      title: nombre,
    },
    galeria: previo?.galeria ?? [],
    publicado: true,
    fichaPublicada: true,
    descripcionLarga: previo?.descripcionLarga ?? (n.description ? [n.description] : []),
    especificaciones: ficha?.especificaciones.length ? ficha.especificaciones : (previo?.especificaciones ?? []),
    faqs: ficha?.faqs.length ? ficha.faqs : (previo?.faqs ?? []),
    origen: "shopify",
    imagenUrl: n.featuredImage?.url ?? null,
  };
}

/** Catálogo completo, memorizado por request. Cacheado con la etiqueta `productos`. */
export const getCatalogo = cache(
  async (): Promise<{ categorias: Categoria[]; origen: OrigenCatalogo }> => {
    const variables = Object.fromEntries(categoriasBase.map((c, i) => [`h${i}`, c.slug]));
    const res = await storefrontFetch<Record<string, ColeccionLista>>(
      "getCatalogo",
      QUERY_CATALOGO,
      variables,
      { tags: [ETIQUETA_CATALOGO] },
    );

    if (res.estado !== "ok") {
      return { categorias: categoriasBase.map(respaldo), origen: "respaldo" };
    }

    const categorias = categoriasBase.map((categoria, i) => {
      const coleccion = res.data[`c${i}`];
      if (!coleccion) {
        console.warn(
          `[catalogo] la colección "${categoria.slug}" no existe o no está publicada en el canal Headless: se usa el respaldo de clusters.ts`,
        );
        return respaldo(categoria);
      }
      const pilares = coleccion.products.nodes.map((n) =>
        pilarDesdeShopify(n, categoria.pilares.find((p) => p.slug === n.handle)),
      );
      // La comparativa de clusters.ts nombra productos concretos: con el
      // catálogo real ya no corresponde y se omite hasta reescribirla.
      return { ...categoria, pilares, comparativa: undefined };
    });

    return { categorias, origen: "shopify" };
  },
);

export async function getCategoriaCatalogo(slug: string): Promise<Categoria | undefined> {
  const { categorias } = await getCatalogo();
  return categorias.find((c) => c.slug === slug);
}

export async function getPilarCatalogo(
  categoriaSlug: string,
  pilarSlug: string,
): Promise<{ categoria: Categoria; pilar: Pilar } | undefined> {
  const categoria = await getCategoriaCatalogo(categoriaSlug);
  const pilar = categoria?.pilares.find((p) => p.slug === pilarSlug);
  return categoria && pilar ? { categoria, pilar } : undefined;
}

/** Producto de Shopify memorizado por request (la ficha y su metadata lo piden dos veces). */
export const getProducto = cache(getProductoPorHandle);

/**
 * Contenido de ficha para la ruta dinámica.
 * Prioridad: metafield `membrishop.ficha` → contenido de clusters.ts → mínimo
 * con datos nativos de Shopify. Nunca inventa beneficios ni contenido de caja.
 */
export function contenidoFicha(
  categoriaSlug: string,
  pilar: Pilar,
  producto: ProductoShopify | null,
): ContenidoFicha {
  const ficha = parsearFicha(producto?.fichaJson, pilar.slug);
  if (ficha) {
    return {
      categoriaSlug,
      slug: pilar.slug,
      h1: ficha.h1,
      resumen: ficha.resumen,
      tldr: ficha.tldr,
      problema: ficha.problema,
      intro: ficha.intro,
      beneficios: ficha.beneficios,
      incluye: ficha.incluye,
      paraQuien: ficha.paraQuien,
      noSirve: ficha.noSirve,
      faqs: ficha.faqs,
    };
  }

  const descripcion = producto?.descripcion?.trim() ?? "";
  return {
    categoriaSlug,
    slug: pilar.slug,
    h1: pilar.nombre,
    resumen: pilar.gancho || producto?.seo.descripcion || descripcion.split(". ")[0] || pilar.nombre,
    tldr: [],
    problema: pilar.problema || undefined,
    intro: pilar.descripcionLarga[0] ?? descripcion,
    beneficios: [],
    incluye: [],
    paraQuien: [],
    noSirve: "",
    faqs: pilar.faqs,
  };
}

/** Meta title / description de la ruta dinámica: SEO de Shopify, con respaldo. */
export function metadatosFicha(pilar: Pilar, producto: ProductoShopify | null) {
  const titulo = producto?.seo.titulo || `${pilar.nombre} | MembriShop`;
  const descripcion =
    producto?.seo.descripcion ||
    pilar.gancho ||
    (producto?.descripcion ?? "").slice(0, 155) ||
    pilar.nombre;
  return { titulo, descripcion };
}
