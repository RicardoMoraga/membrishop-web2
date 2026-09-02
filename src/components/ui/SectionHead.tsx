import type { ReactNode } from "react";

type Props = {
  /** Rótulo corto en versalitas sobre el titular. */
  eyebrow: string;
  titulo: string;
  id: string;
  sub?: string;
  /** Botón o enlace alineado a la derecha en escritorio. */
  accion?: ReactNode;
};

/**
 * Encabezado de sección: eyebrow + H2 + bajada, con acción opcional a la
 * derecha. Centralizarlo evita que cada sección invente su propio espaciado.
 */
export function SectionHead({ eyebrow, titulo, id, sub, accion }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="max-w-2xl">
        <p className="font-display mb-2 text-xs font-bold uppercase tracking-[0.14em] text-oro-700">
          {eyebrow}
        </p>
        <h2 id={id} className="text-fluid-h2">
          {titulo}
        </h2>
        {sub && <p className="mt-3 leading-relaxed text-ink-suave">{sub}</p>}
      </div>
      {accion && <div className="shrink-0">{accion}</div>}
    </div>
  );
}
