import type { Resena } from "@/content/resenas";

/** Bloque de opiniones. No renderiza nada si no hay reseñas reales. */
export function Resenas({ resenas }: { resenas: readonly Resena[] }) {
  if (resenas.length === 0) return null;

  return (
    <section aria-labelledby="titulo-resenas" className="contenedor py-7 md:py-10">
      <div className="grid gap-6 rounded-marca-lg border border-borde bg-crema p-6 md:grid-cols-[14rem_1fr] md:items-center md:p-8">
        <h2 id="titulo-resenas" className="text-[20px] leading-tight">
          Lo que dicen nuestros clientes
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resenas.map((resena) => (
            <li key={`${resena.autor}-${resena.texto.slice(0, 24)}`}>
              <p
                role="img"
                aria-label={`${resena.estrellas} de 5 estrellas`}
                className="text-[13px] tracking-[0.1em] text-oro-700"
              >
                {"★".repeat(resena.estrellas)}
                <span aria-hidden="true" className="text-borde-2">
                  {"★".repeat(5 - resena.estrellas)}
                </span>
              </p>
              <blockquote className="mt-1.5 text-[14px] leading-relaxed text-ink">“{resena.texto}”</blockquote>
              <p className="mt-1.5 text-[12px] text-ink-tenue">
                {resena.autor}
                {resena.ciudad ? ` · ${resena.ciudad}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
