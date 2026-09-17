import type { ReactNode } from "react";

type Props = {
  /** Rótulo corto en versalitas sobre el titular. Opcional. */
  eyebrow?: string;
  titulo: string;
  id: string;
  sub?: string;
  /** Botón, enlace o filtros alineados a la derecha en escritorio. */
  accion?: ReactNode;
};

/**
 * Encabezado de sección: eyebrow + H2 + bajada, con acción opcional a la
 * derecha. Centralizarlo evita que cada sección invente su propio espaciado.
 */
export function SectionHead({ eyebrow, titulo, id, sub, accion }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-oro-700">
            {eyebrow}
          </p>
        )}
        <h2 id={id} className="text-fluid-h2 leading-tight">
          {titulo}
        </h2>
        {sub && <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-suave">{sub}</p>}
      </div>
      {accion && <div className="max-w-full shrink-0">{accion}</div>}
    </div>
  );
}
