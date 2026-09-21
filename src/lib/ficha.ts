import { z } from "zod";

/**
 * Contenido editorial de una ficha guardado en Shopify, en el metafield
 * `membrishop.ficha` (tipo json, lectura pública en Storefront API).
 *
 * Por qué vive en Shopify y no en `clusters.ts`: con productos importados
 * desde Dropi, publicar uno nuevo no puede exigir un deploy. Claude escribe
 * este JSON al curar el producto y la web lo lee en caliente.
 *
 * Por qué no se usan `title` ni `descriptionHtml` del producto como fuente:
 * Dropify puede sobrescribirlos al resincronizar (banderas `sob_nombre`,
 * `sob_descripcion`). El metafield es nuestro y ninguna app lo toca.
 *
 * Si el JSON no valida, la ficha no se rompe: se cae al contenido mínimo que
 * se arma con los datos nativos de Shopify y se registra un aviso.
 */

const faq = z.object({ pregunta: z.string().min(1), respuesta: z.string().min(1) });

export const esquemaFicha = z.object({
  version: z.number().int().optional(),
  nombre: z.string().min(1).optional(),
  gancho: z.string().optional(),
  h1: z.string().min(1),
  resumen: z.string().min(1),
  tldr: z.array(z.string()).max(3).default([]),
  problema: z.string().optional(),
  intro: z.string().min(1),
  beneficios: z
    .array(
      z.object({
        caracteristica: z.string().optional(),
        titulo: z.string().min(1),
        detalle: z.string().min(1),
      }),
    )
    .default([]),
  incluye: z.array(z.string()).default([]),
  paraQuien: z.array(z.string()).default([]),
  noSirve: z.string().default(""),
  especificaciones: z
    .array(z.object({ etiqueta: z.string().min(1), valor: z.string().min(1) }))
    .default([]),
  faqs: z.array(faq).default([]),
});

export type FichaEditorial = z.infer<typeof esquemaFicha>;

export function parsearFicha(json: string | null | undefined, handle: string): FichaEditorial | null {
  if (!json) return null;
  try {
    const resultado = esquemaFicha.safeParse(JSON.parse(json));
    if (resultado.success) return resultado.data;
    console.warn(
      `[ficha] ${handle}: metafield membrishop.ficha inválido — ${resultado.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(" · ")}`,
    );
  } catch {
    console.warn(`[ficha] ${handle}: metafield membrishop.ficha no es JSON válido`);
  }
  return null;
}

/**
 * Contenido que consume `PdpTemplate`. Vive aquí (y no en la plantilla) para
 * que `lib/catalogo.ts` pueda construirlo sin importar un componente.
 */
export type ContenidoFicha = {
  categoriaSlug: string;
  slug: string;
  /** H1 centrado en el producto, distinto del meta title. */
  h1: string;
  /** Una línea bajo el H1: el problema que resuelve. */
  resumen: string;
  /** Máximo 3 puntos. Va justo tras el H1 por la regla SEO del proyecto. */
  tldr: string[];
  /**
   * Opcional: el problema real que el producto resuelve. Con él, "Qué
   * resuelve" se muestra como Problema → Solución (la solución es `intro`).
   * No inventar problemas que el producto no resuelva.
   */
  problema?: string;
  /** Primer párrafo: resuelve el intent de búsqueda. */
  intro: string;
  /** `caracteristica` (opcional) es el dato técnico del que sale el beneficio. */
  beneficios: { caracteristica?: string; titulo: string; detalle: string }[];
  /** Vacío = la sección "Qué incluye la caja" no se muestra (no se inventa). */
  incluye: string[];
  paraQuien: string[];
  noSirve: string;
  faqs: { pregunta: string; respuesta: string }[];
};
