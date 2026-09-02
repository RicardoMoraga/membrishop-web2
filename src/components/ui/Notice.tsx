import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  titulo?: string;
  /** "oro" para el TL;DR, "ambar" para avisos informativos. */
  tono?: "oro" | "ambar";
  className?: string;
  ariaLabel?: string;
};

/**
 * Bloque con barra lateral de color. Es el recurso que usa toda la página
 * para separar "esto es una acotación" de "esto es el contenido": la barra de
 * 4 px se lee antes que cualquier texto.
 */
export function Notice({ children, titulo, tono = "ambar", className = "", ariaLabel }: Props) {
  const barra = tono === "oro" ? "border-l-oro-500" : "border-l-oro-300";

  return (
    <aside
      aria-label={ariaLabel}
      className={`rounded-marca border border-borde ${barra} border-l-4 bg-crema-suave p-5 md:p-6 ${className}`}
    >
      {titulo && (
        <p className="font-display mb-3 text-xs font-bold uppercase tracking-[0.14em] text-oro-700">
          {titulo}
        </p>
      )}
      {children}
    </aside>
  );
}
