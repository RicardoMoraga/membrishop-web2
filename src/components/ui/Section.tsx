import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  id?: string;
  /** Alterna el fondo para separar bloques sin usar bordes. */
  fondo?: "lienzo" | "crema" | "verde";
  className?: string;
  ariaLabelledby?: string;
};

const fondos = {
  lienzo: "bg-lienzo",
  crema: "bg-crema-suave",
  verde: "bg-verde-600 text-crema",
} as const;

export function Section({ children, id, fondo = "lienzo", className = "", ariaLabelledby }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledby}
      className={`${fondos[fondo]} py-7 md:py-10 ${className}`}
    >
      <div className="contenedor">{children}</div>
    </section>
  );
}
