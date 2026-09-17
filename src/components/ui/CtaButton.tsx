import Link from "next/link";
import type { ReactNode } from "react";
import { IconoFlecha } from "@/components/ui/icons";

type Variante = "primario" | "secundario" | "fantasma" | "whatsapp" | "sobre-oscuro";

/**
 * Contraste comprobado:
 *  primario   blanco sobre verde-600 #155a24 → 8,3:1
 *  secundario verde-600 sobre blanco         → 8,3:1
 *  whatsapp   #25d366 + tinta                → 11:1
 * Alto mínimo de 44 px (h-11) en todos los tamaños: objetivo táctil.
 */
export const estiloPrimario =
  "bg-verde-600 text-white hover:bg-verde-700 active:translate-y-px";

const estilos: Record<Variante, string> = {
  primario: estiloPrimario,
  secundario:
    "bg-white text-verde-600 ring-1 ring-inset ring-borde-2 hover:bg-crema active:translate-y-px",
  fantasma:
    "bg-white text-ink ring-1 ring-inset ring-borde-2 hover:bg-crema active:translate-y-px",
  whatsapp: "bg-whatsapp text-ink hover:brightness-95 active:translate-y-px",
  "sobre-oscuro":
    "bg-white/10 text-white ring-1 ring-inset ring-white/35 hover:bg-white/20 active:translate-y-px",
};

const tamanos = {
  sm: "h-11 px-4 text-[13.5px]",
  md: "h-11 px-5 text-[14.5px]",
} as const;

type Props = {
  href: string;
  children: ReactNode;
  variante?: Variante;
  tamano?: keyof typeof tamanos;
  className?: string;
  conFlecha?: boolean;
  externo?: boolean;
  /** Se lee desde GA4 / GTM con un activador sobre [data-evento]. */
  evento?: string;
};

export function CtaButton({
  href,
  children,
  variante = "primario",
  tamano = "md",
  className = "",
  conFlecha = true,
  externo = false,
  evento,
}: Props) {
  const clases = `group inline-flex items-center justify-center gap-2 rounded-marca font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro-500 focus-visible:ring-offset-2 ${estilos[variante]} ${tamanos[tamano]} ${className}`;

  const contenido = (
    <>
      {children}
      {conFlecha && (
        <IconoFlecha className="h-[1.15em] w-[1.15em] transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </>
  );

  if (externo) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={clases} data-evento={evento}>
        {contenido}
      </a>
    );
  }

  return (
    <Link href={href} className={clases} data-evento={evento}>
      {contenido}
    </Link>
  );
}
