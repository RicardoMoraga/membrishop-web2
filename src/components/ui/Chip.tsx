import type { ReactNode } from "react";

/** Micro-garantía del hero: ícono + texto corto, en una línea. */
export function Chip({ icono, children }: { icono: ReactNode; children: ReactNode }) {
  return (
    <li className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-borde bg-white px-3.5 py-2 text-sm font-semibold text-ink shadow-suave">
      <span className="text-verde-500">{icono}</span>
      {children}
    </li>
  );
}
