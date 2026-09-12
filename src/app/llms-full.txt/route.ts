import { categorias } from "@/content/clusters";
import { home } from "@/content/home";
import { site, urlAbsoluta } from "@/lib/site";

/**
 * /llms-full.txt — el contenido completo del sitio en un solo Markdown.
 *
 * Mientras `llms.txt` es el índice (enlaces + resumen), este archivo trae el
 * texto entero de cada página para que un modelo pueda ingerirlo de una sola
 * petición, sin rastrear ruta por ruta ni pelear con el HTML.
 *
 * Se genera desde `clusters.ts` y `home.ts`: nunca se desincroniza del sitio.
 */

export const dynamic = "force-static";

function construirLlmsFull(): string {
  const b: string[] = [];

  b.push(`# ${site.nombre} — contenido completo`);
  b.push("");
  b.push(`> ${site.descripcionCorta}`);
  b.push(`> Fuente canónica: ${site.url}`);
  b.push("");
  b.push("---");
  b.push("");

  // ---------------- HOME ----------------
  b.push(`## Inicio (${urlAbsoluta("/")})`);
  b.push("");
  b.push(`### ${home.h1}`);
  b.push("");
  b.push("**Lo esencial**");
  b.push("");
  b.push(home.tldr.map((t) => `- ${t}`).join("\n"));
  b.push("");
  b.push(home.intro);
  b.push("");
  b.push("**Qué hace distinto a MembriShop**");
  b.push("");
  b.push(home.diferenciadores.map((d) => `- **${d.titulo}**: ${d.detalle}`).join("\n"));
  b.push("");
  b.push("**Cómo comprar**");
  b.push("");
  b.push(home.pasos.map((p, i) => `${i + 1}. **${p.titulo}**: ${p.detalle}`).join("\n"));
  b.push("");
  b.push("**Preguntas frecuentes**");
  b.push("");
  b.push(home.faqs.map((f) => `- **${f.pregunta}**\n  ${f.respuesta}`).join("\n"));
  b.push("");
  b.push("---");
  b.push("");

  // ---------------- CATEGORÍAS ----------------
  for (const categoria of categorias) {
    b.push(`## ${categoria.nombre} (${urlAbsoluta(`/${categoria.slug}`)})`);
    b.push("");
    b.push(`### ${categoria.h1}`);
    b.push("");
    b.push("**Lo esencial**");
    b.push("");
    b.push(categoria.tldr.map((t) => `- ${t}`).join("\n"));
    b.push("");
    b.push(categoria.intent);
    b.push("");

    b.push("**Productos**");
    b.push("");
    b.push(
      categoria.pilares
        .map((p) => {
          const estado = p.publicado
            ? `disponible${p.precioDesde ? `, $${p.precioDesde.toLocaleString("es-CL")} CLP` : ""}${p.fichaPublicada ? "" : ", venta por WhatsApp mientras no tiene ficha web"}`
            : "aún no disponible, sin precio confirmado";
          const url = p.fichaPublicada
            ? ` — ${urlAbsoluta(`/${categoria.slug}/${p.slug}`)}`
            : "";
          return `- **${p.nombre}** (${estado}): ${p.gancho}. Resuelve: ${p.problema}${url}`;
        })
        .join("\n"),
    );
    b.push("");

    b.push("**Criterios de selección de la categoría**");
    b.push("");
    b.push(categoria.criterios.map((c) => `- **${c.titulo}**: ${c.detalle}`).join("\n"));
    b.push("");

    if (categoria.comparativa) {
      b.push(`**${categoria.comparativa.titulo}**`);
      b.push("");
      b.push(`| ${categoria.comparativa.columnas.join(" | ")} |`);
      b.push(`| ${categoria.comparativa.columnas.map(() => "---").join(" | ")} |`);
      b.push(categoria.comparativa.filas.map((f) => `| ${f.join(" | ")} |`).join("\n"));
      b.push("");
    }

    b.push("**Preguntas frecuentes**");
    b.push("");
    b.push(categoria.faqs.map((f) => `- **${f.pregunta}**\n  ${f.respuesta}`).join("\n"));
    b.push("");
    b.push("---");
    b.push("");
  }

  b.push("## Condiciones comerciales");
  b.push("");
  b.push(
    [
      "- Stock físico en Chile: no hay importación ni esperas de 30 días.",
      "- Despacho: 24 a 72 horas hábiles en Región Metropolitana, 3 a 5 días hábiles en regiones.",
      `- Medios de pago: ${site.mediosPago.join(", ")}.`,
      "- Devoluciones: 10 días corridos de derecho a retracto (Ley 19.496), más garantía legal de 6 meses por fallas.",
      `- Contacto: ${site.contacto.email}. Horario: ${site.contacto.horario}.`,
      "- Tienda 100 % online: no hay local con atención de público ni retiro presencial.",
      `- ${site.nombre} no tiene valoraciones agregadas publicadas; no existen reseñas verificadas todavía.`,
    ].join("\n"),
  );
  b.push("");

  return b.join("\n");
}

export function GET(): Response {
  return new Response(construirLlmsFull(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
