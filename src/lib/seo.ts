import type { Metadata } from "next";
import { site, urlAbsoluta } from "@/lib/site";

type OpcionesMetadata = {
  /** Meta title. Debe ser distinto del H1 de la página. 50–60 caracteres. */
  title: string;
  /** Meta description única. 140–160 caracteres. */
  description: string;
  /** Ruta interna, ej. "/mascotas". Genera el canonical absoluto. */
  path: string;
  /** Imagen para OpenGraph. Relativa a /public. */
  imagen?: string;
  /** true en páginas de utilidad (gracias, carrito, resultados filtrados). */
  noindex?: boolean;
  tipo?: "website" | "article";
};

/**
 * Constructor único de metadata. Garantiza canonical, OpenGraph y Twitter
 * consistentes en toda la web y evita que se olvide un canonical al crear
 * una página nueva.
 */
export function buildMetadata({
  title,
  description,
  path,
  imagen = "/images/og-membrishop.jpg",
  noindex = false,
  tipo = "website",
}: OpcionesMetadata): Metadata {
  const url = urlAbsoluta(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: tipo,
      url,
      siteName: site.nombre,
      locale: site.locale,
      title,
      description,
      images: [{ url: imagen, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imagen],
    },
  };
}
