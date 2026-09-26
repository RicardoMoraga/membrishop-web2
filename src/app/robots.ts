import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Se sirve en /robots.txt (Next lo genera desde este archivo en el build).
 *
 * Criterio: bloquear solo los espacios de URL *infinitos* —paginación, filtros,
 * orden y búsqueda interna— más las rutas transaccionales que nunca deben
 * posicionar. Todo lo demás se deja rastreable.
 *
 * Nota deliberada sobre los parámetros de campaña (utm_, fbclid, gclid):
 * NO se bloquean. Es tentador hacerlo, pero un `Disallow` impide que Google lea
 * el `rel=canonical` de esa URL y entonces no puede consolidar las señales con
 * la versión limpia; el resultado típico es "Indexada aunque bloqueada por
 * robots.txt". La consolidación la hace el canonical, que ya emite
 * `buildMetadata()` en todas las páginas.
 */

/**
 * Rastreadores de IA. Se les permite el acceso a propósito: es la contraparte
 * de `llms.txt` y de la estrategia GEO/LLMO.
 * Si algún día quieres cerrarles la puerta, cambia `PERMITIR_IA` a false.
 */
const PERMITIR_IA: boolean = true;
const BOTS_IA = ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];

const DISALLOW: string[] = [
          // --- Infraestructura ---
          "/api/",
          // "/_next/" NO se bloquea: Google necesita CSS/JS de /_next/static para renderizar.
          // --- Rutas transaccionales y de cuenta ---
          "/carrito",
          "/checkout",
          "/cuenta",
          "/gracias",
          // --- Búsqueda interna: genera URLs infinitas sin valor de búsqueda ---
          "/buscar",
          // --- Paginación: no debe indexarse ---
          "/*/page/*",
          "/*?page=",
          "/*&page=",
          // --- Filtros y orden: combinatoria infinita de contenido duplicado ---
          "/*?orden=",
          "/*?filtro=",
          "/*?color=",
          "/*?talla=",
          "/*?q=",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      // Un grupo propio reemplaza al de "*": se repiten las exclusiones para que
      // los bots de IA tampoco rastreen /api/, paginación ni filtros.
      ...BOTS_IA.map((bot) =>
        PERMITIR_IA
          ? { userAgent: bot, allow: "/", disallow: DISALLOW }
          : { userAgent: bot, disallow: "/" },
      ),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
