import type { Faq } from "@/content/clusters";

/**
 * FAQ en <details>/<summary> nativos, sin JavaScript: el contenido está en el
 * HTML inicial, así que Google y los crawlers de IA lo leen aunque el acordeón
 * esté cerrado. El chevron es un cuadrado con dos bordes rotado 45°, así que
 * tampoco cuesta un ícono.
 *
 * Dos exportaciones a propósito:
 *   FaqList     solo el acordeón. Para páginas que ya ponen su encabezado con
 *               `SectionHead` — si no, salen dos H2 seguidos y la jerarquía
 *               queda rota, que es justo lo que pasaba en la home y la ficha.
 *   FaqSection  encabezado + acordeón, para quien no trae el suyo.
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-borde overflow-hidden rounded-marca-lg border border-borde bg-white">
      {faqs.map((faq, i) => (
        <details key={faq.pregunta} className="group" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 transition-colors hover:bg-crema-suave [&::-webkit-details-marker]:hidden">
            <h3 className="font-display text-[15px] font-bold text-ink md:text-base">
              {faq.pregunta}
            </h3>
            <span
              aria-hidden="true"
              className="mt-1 h-2.5 w-2.5 shrink-0 rotate-45 border-b-2 border-r-2 border-oro-600 transition-transform duration-200 group-open:mt-0 group-open:-rotate-135"
            />
          </summary>
          <div className="px-5 pb-5 text-[15px] leading-relaxed text-ink-suave">
            {faq.respuesta}
          </div>
        </details>
      ))}
    </div>
  );
}

export function FaqSection({
  faqs,
  titulo = "Preguntas frecuentes",
  eyebrow = "Dudas",
  id = "faq",
}: {
  faqs: Faq[];
  titulo?: string;
  eyebrow?: string;
  id?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-28">
      <p className="font-display mb-2 text-xs font-bold uppercase tracking-[0.14em] text-oro-700">
        {eyebrow}
      </p>
      <h2 id={`${id}-titulo`} className="text-fluid-h2">
        {titulo}
      </h2>

      <div className="mt-7">
        <FaqList faqs={faqs} />
      </div>
    </section>
  );
}
