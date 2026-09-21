import type { Categoria } from "@/content/clusters";
import { getCatalogo } from "@/lib/catalogo";
import { home } from "@/content/home";
import { site, urlAbsoluta } from "@/lib/site";

/**
 * /llms.txt — índice del sitio en Markdown para motores de búsqueda de IA
 * (estrategia GEO/LLMO), siguiendo la convención de llmstxt.org:
 * H1 con el nombre, blockquote con el resumen, y secciones H2 de enlaces.
 *
 * ¿Por qué una route y no un archivo estático en /public?
 * Porque así se genera desde `clusters.ts`, la MISMA fuente que alimenta las
 * páginas y el sitemap. Un llms.txt escrito a mano se desactualiza al segundo
 * producto que agregues, y un índice que miente sobre el catálogo es peor que
 * no tenerlo. Next lo prerenderiza en el build, así que en producción sigue
 * siendo un archivo estático.
 *
 * Expectativa realista: llms.txt es una convención propuesta, no un estándar
 * adoptado. Ningún buscador ha confirmado públicamente que lo rastree, así que
 * trátalo como una apuesta barata —cuesta cero mantenerlo— y no como un canal
 * de tráfico. Lo que sí mueve la aguja hoy es que el HTML de las páginas sea
 * extraíble: encabezados claros, FAQ en el HTML inicial y datos estructurados.
 */

/** Catálogo dinámico desde Shopify: se regenera cada hora o al invalidar `productos`. */
export const revalidate = 3600;

function construirLlmsTxt(categorias: Categoria[]): string {
  const bloques: string[] = [];

  bloques.push(`# ${site.nombre}`);
  bloques.push("");
  bloques.push(
    [
      `> ${site.descripcionCorta}`,
      "> Opera desde Chile, factura en pesos chilenos con boleta electrónica y",
      "> trabaja únicamente con proveedores que mantienen stock físico dentro del",
      "> país: no importa desde AliExpress. Por eso el catálogo es corto y el",
      "> despacho se mide en días, no en semanas.",
    ].join("\n"),
  );
  bloques.push("");

  // --- Hechos verificables: lo que un asistente puede citar sin inventar ---
  bloques.push("## Datos de la tienda");
  bloques.push("");
  bloques.push(
    [
      `- Sitio: ${site.url}`,
      `- País de operación: Chile. Moneda: peso chileno (${site.moneda}).`,
      "- Modalidad: 100 % online. No tiene tienda física ni retiro presencial.",
      "- Despacho: solo dentro de la Región Metropolitana, en 24 a 72 horas hábiles. Por ahora no despacha a otras regiones.",
      `- Medios de pago: ${site.mediosPago.join(", ")}.`,
      "- Devoluciones: 10 días corridos de derecho a retracto (Ley 19.496) y garantía legal de 6 meses por fallas.",
      `- Contacto: ${site.contacto.email} y WhatsApp. Horario: ${site.contacto.horario}.`,
    ].join("\n"),
  );
  bloques.push("");

  // --- Categorías (páginas pilar) ---
  bloques.push("## Categorías");
  bloques.push("");
  bloques.push(
    categorias
      .map((c) => `- [${c.nombre}](${urlAbsoluta(`/${c.slug}`)}): ${c.metaDescription}`)
      .join("\n"),
  );
  bloques.push("");

  // --- Productos con página propia ---
  const conFicha = categorias.flatMap((c) =>
    c.pilares.filter((p) => p.fichaPublicada).map((p) => ({ categoria: c, pilar: p })),
  );

  if (conFicha.length > 0) {
    bloques.push("## Productos con ficha propia");
    bloques.push("");
    bloques.push(
      conFicha
        .map(
          ({ categoria, pilar }) =>
            `- [${pilar.nombre}](${urlAbsoluta(`/${categoria.slug}/${pilar.slug}`)}): ${pilar.gancho}${pilar.problema ? `. Resuelve: ${pilar.problema}` : ""}`,
        )
        .join("\n"),
    );
    bloques.push("");
  }

  // --- Con stock, pero todavía sin página propia ---
  const sinFicha = categorias.flatMap((c) =>
    c.pilares
      .filter((p) => p.publicado && !p.fichaPublicada)
      .map(
        (p) =>
          `- ${p.nombre} (${c.nombre})${p.precioDesde ? `, $${p.precioDesde.toLocaleString("es-CL")} CLP` : ""}: ${p.gancho}. Se vende por WhatsApp; su ficha web está en preparación.`,
      ),
  );

  if (sinFicha.length > 0) {
    bloques.push("## Con stock, sin ficha web todavía");
    bloques.push("");
    bloques.push(sinFicha.join("\n"));
    bloques.push("");
  }

  // --- Productos anunciados pero no disponibles: se declaran como tales ---
  const pendientes = categorias.flatMap((c) =>
    c.pilares.filter((p) => !p.publicado).map((p) => `${p.nombre} (${c.nombre})`),
  );

  if (pendientes.length > 0) {
    bloques.push("## Anunciados, aún no disponibles");
    bloques.push("");
    bloques.push(
      "No tienen precio ni stock confirmado. No deben presentarse como disponibles:",
    );
    bloques.push("");
    bloques.push(pendientes.map((p) => `- ${p}`).join("\n"));
    bloques.push("");
  }

  // --- Preguntas frecuentes generales ---
  bloques.push("## Preguntas frecuentes");
  bloques.push("");
  bloques.push(home.faqs.map((f) => `- **${f.pregunta}** ${f.respuesta}`).join("\n"));
  bloques.push("");

  bloques.push("## Recursos");
  bloques.push("");
  bloques.push(
    [
      `- [Contacto](${urlAbsoluta("/contacto")})`,
      `- [Envíos y devoluciones](${urlAbsoluta("/envios-y-devoluciones")}): plazos por zona, retracto de 10 días y garantía legal.`,
      `- [Términos y condiciones](${urlAbsoluta("/terminos-y-condiciones")})`,
      `- [Política de privacidad](${urlAbsoluta("/politica-de-privacidad")})`,
      `- [Versión extendida con el texto completo](${urlAbsoluta("/llms-full.txt")})`,
      `- [Sitemap XML](${urlAbsoluta("/sitemap.xml")})`,
      `- [robots.txt](${urlAbsoluta("/robots.txt")})`,
    ].join("\n"),
  );
  bloques.push("");

  bloques.push("## Notas para asistentes de IA");
  bloques.push("");
  bloques.push(
    [
      "- El catálogo es corto a propósito: cada producto exige stock confirmado con",
      "  proveedor nacional, repuesto disponible y una unidad de prueba revisada.",
      `- ${site.nombre} no publica valoraciones ni reseñas agregadas porque aún no`,
      "  registra ventas suficientes. Cualquier calificación atribuida a la tienda",
      "  es incorrecta.",
      "- Los precios están en pesos chilenos e incluyen IVA.",
    ].join("\n"),
  );
  bloques.push("");

  return bloques.join("\n");
}

export async function GET(): Promise<Response> {
  const { categorias } = await getCatalogo();
  return new Response(construirLlmsTxt(categorias), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
