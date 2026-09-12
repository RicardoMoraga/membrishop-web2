import Link from "next/link";
import type { ReactNode } from "react";
import { IconoFlecha } from "@/components/ui/icons";

type Variante = "primario" | "secundario" | "fantasma" | "whatsapp" | "sobre-oscuro";

/**
 * Contraste comprobado sobre el fondo donde vive cada variante:
 *  primario  naranja #f1921e + tinta #2a2016 → 7,0:1
 *  secundario oro-700 #a34c08 sobre crema  → 5,7:1
 *  whatsapp  #25d366 + tinta               → 11:1
 * Por eso el botón dorado NO lleva texto blanco: quedaría en 2,1:1.
 */
const estilos: Record<Variante, string> = {
  primario:
    "bg-oro-400 text-ink shadow-suave hover:bg-oro-300 hover:shadow-elevada active:translate-y-px",
  secundario:
    "bg-transparent text-oro-700 ring-2 ring-inset ring-oro-300 hover:bg-oro-50 hover:ring-oro-500 active:translate-y-px",
  fantasma:
    "bg-white text-ink ring-1 ring-inset ring-borde-2 hover:bg-oro-50 active:translate-y-px",
  whatsapp: "bg-whatsapp text-ink shadow-suave hover:brightness-95 active:translate-y-px",
  "sobre-oscuro":
    "bg-white/10 text-white ring-1 ring-inset ring-white/35 hover:bg-white/20 active:translate-y-px",
};

const tamanos = {
  sm: "px-4 py-2.5 text-sm",
  md: "px-6 py-3.5 text-base",
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
  const clases = `group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro-500 focus-visible:ring-offset-2 ${estilos[variante]} ${tamanos[tamano]} ${className}`;

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
