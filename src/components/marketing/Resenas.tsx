import type { Resena } from "@/content/resenas";

/**
 * Bloque de opiniones. No renderiza nada si no hay reseñas reales.
 * En la ficha se usa con las reseñas filtradas por `producto`.
 */
export function Resenas({
  resenas,
  titulo = "Lo que dicen nuestros clientes",
  id = "titulo-resenas",
}: {
  resenas: readonly Resena[];
  titulo?: string;
  id?: string;
}) {
  if (resenas.length === 0) return null;

  const promedio = resenas.reduce((suma, r) => suma + r.estrellas, 0) / resenas.length;

  return (
    <section aria-labelledby={id} className="contenedor py-7 md:py-10">
      <div className="grid gap-6 rounded-marca-lg border border-borde bg-crema p-6 md:grid-cols-[14rem_1fr] md:items-center md:p-8">
        <div>
          <h2 id={id} className="text-[20px] leading-tight">
            {titulo}
          </h2>
          <p className="mt-1.5 text-[13px] text-ink-suave">
            {promedio.toLocaleString("es-CL", { maximumFractionDigits: 1 })} de 5 ·{" "}
            {resenas.length} {resenas.length === 1 ? "opinión" : "opiniones"}
          </p>
        </div>
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
