import type { MetadataRoute } from "next";
import { getCatalogo } from "@/lib/catalogo";
import { urlAbsoluta } from "@/lib/site";

/**
 * Se sirve en /sitemap.xml. Next lo prerenderiza en el build.
 *
 * Reglas que sigue este generador:
 *
 *  1. Solo entran páginas indexables. Las fichas con `publicado: false` quedan
 *     fuera hasta que existan de verdad: un sitemap que apunta a un 404 quema
 *     confianza del rastreador y aparece como error en Search Console.
 *  2. `lastModified` sale de la fecha de despliegue. Si algún día mueves el
 *     contenido a un CMS, cámbialo por la fecha real de edición: un lastmod que
 *     cambia en todas las URLs cada deploy termina siendo ignorado.
 *  3. `changeFrequency` y `priority` los declara el estándar, pero Google los
 *     ignora desde hace años. Se mantienen porque otros rastreadores sí los leen
 *     y no cuestan nada. No esperes que muevan el ranking.
 */

/**
 * Pon en `true` cuando hayas subido las fotos a /public/images.
 * Mientras sea `false`, el sitemap no declara imágenes: apuntar a archivos que
 * no existen genera errores de rastreo innecesarios.
 */
const IMAGENES_DISPONIBLES: boolean = false;

/** Las fichas salen del catálogo de Shopify: el sitemap se regenera cada hora o por webhook. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ahora = new Date();
  const { categorias } = await getCatalogo();

  const home: MetadataRoute.Sitemap = [
    {
      url: urlAbsoluta("/"),
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const contacto: MetadataRoute.Sitemap = [
    {
      url: urlAbsoluta("/contacto"),
      lastModified: ahora,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Páginas legales: bajo tráfico de búsqueda directo, pero indexables —
  // Google las espera en cualquier tienda con checkout real.
  const legales: MetadataRoute.Sitemap = [
    "/terminos-y-condiciones",
    "/politica-de-privacidad",
    "/envios-y-devoluciones",
  ].map((ruta) => ({
    url: urlAbsoluta(ruta),
    lastModified: ahora,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  const paginasCategoria: MetadataRoute.Sitemap = categorias.map((categoria) => ({
    url: urlAbsoluta(`/${categoria.slug}`),
    lastModified: ahora,
    changeFrequency: "weekly",
    priority: 0.9,
    ...(IMAGENES_DISPONIBLES
      ? { images: [urlAbsoluta(`/images/${categoria.imagenHero.archivo}`)] }
      : {}),
  }));

  const paginasProducto: MetadataRoute.Sitemap = categorias.flatMap((categoria) =>
    categoria.pilares
      .filter((pilar) => pilar.fichaPublicada)
      .map((pilar) => ({
        url: urlAbsoluta(`/${categoria.slug}/${pilar.slug}`),
        lastModified: ahora,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        // Imagen de Shopify (CDN) cuando existe; si no, el archivo local solo
        // se declara cuando las fotos de /public/images estén subidas.
        ...(pilar.imagenUrl
          ? { images: [pilar.imagenUrl] }
          : IMAGENES_DISPONIBLES
            ? { images: [urlAbsoluta(`/images/${pilar.imagen.archivo}`)] }
            : {}),
      })),
  );

  return [...home, ...paginasCategoria, ...paginasProducto, ...contacto, ...legales];
}
