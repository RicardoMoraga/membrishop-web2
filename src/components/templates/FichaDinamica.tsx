import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PdpTemplate } from "@/components/templates/PdpTemplate";
import {
  FICHAS_ESTATICAS,
  contenidoFicha,
  getCategoriaCatalogo,
  getPilarCatalogo,
  getProducto,
  metadatosFicha,
} from "@/lib/catalogo";
import { buildMetadata } from "@/lib/seo";

/**
 * Ficha de producto resuelta en tiempo de ejecución desde Shopify.
 *
 * La usan `src/app/<nicho>/[handle]/page.tsx`. Una ficha escrita a mano en
 * `src/app/<nicho>/<slug>/page.tsx` tiene prioridad (segmento estático) y por
 * eso se excluye de `generateStaticParams` vía `FICHAS_ESTATICAS`.
 *
 * Productos nuevos: no están en el build, se renderizan la primera vez que
 * alguien los pide (`dynamicParams = true`) y quedan en caché con las
 * etiquetas `producto:<handle>` y `productos`, que invalida el webhook.
 */

export async function paramsFichas(nicho: string): Promise<{ handle: string }[]> {
  const categoria = await getCategoriaCatalogo(nicho);
  return (categoria?.pilares ?? [])
    .filter((p) => p.fichaPublicada && !FICHAS_ESTATICAS.has(`${nicho}/${p.slug}`))
    .map((p) => ({ handle: p.slug }));
}

async function resolver(nicho: string, handle: string) {
  if (FICHAS_ESTATICAS.has(`${nicho}/${handle}`)) return undefined;
  const datos = await getPilarCatalogo(nicho, handle);
  // Con Shopify caído, el respaldo trae marcadores de clusters.ts sin ficha:
  // esos no deben abrir una página.
  if (!datos || !datos.pilar.fichaPublicada) return undefined;
  return datos;
}

export async function metadataFicha(nicho: string, handle: string): Promise<Metadata> {
  const datos = await resolver(nicho, handle);
  if (!datos) return {};
  const { producto } = await getProducto(handle);
  const { titulo, descripcion } = metadatosFicha(datos.pilar, producto);
  return buildMetadata({
    title: titulo,
    description: descripcion,
    path: `/${nicho}/${handle}`,
    ...(datos.pilar.imagenUrl ? { imagen: datos.pilar.imagenUrl } : {}),
  });
}

export async function FichaDinamica({ nicho, handle }: { nicho: string; handle: string }) {
  const datos = await resolver(nicho, handle);
  if (!datos) notFound();
  const { producto } = await getProducto(handle);
  return <PdpTemplate contenido={contenidoFicha(nicho, datos.pilar, producto)} />;
}
