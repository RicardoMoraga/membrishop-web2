import { IconoCamion, IconoDevolucion, IconoEscudo, IconoTarjeta } from "@/components/ui/icons";
import { site } from "@/lib/site";

/**
 * Señales de confianza. Todas salen de `site.promesas`, que es la única
 * declaración de promesas comerciales del proyecto: ningún componente inventa
 * plazos, medios de pago ni garantías por su cuenta.
 *
 * Dos presentaciones del mismo contenido:
 *   "barra"  franja de sección, cuatro columnas — home y cierre de la ficha
 *   "lista"  compacta y vertical
 *   "micro"  2×2 bajo el botón de compra: reduce el riesgo percibido justo
 *            donde se decide (pago, retracto, garantía y cobertura)
 */
const MICRO = [
  { Icono: IconoTarjeta, texto: "Pago seguro con MercadoPago" },
  { Icono: IconoDevolucion, texto: "10 días de retracto" },
  { Icono: IconoEscudo, texto: site.promesas.garantia },
  { Icono: IconoCamion, texto: site.promesas.cobertura },
];

const GARANTIAS = [
  { Icono: IconoEscudo, titulo: "Stock en Chile", detalle: site.promesas.stock },
  { Icono: IconoCamion, titulo: "Despacho rápido", detalle: site.promesas.despacho },
  { Icono: IconoTarjeta, titulo: "Pago seguro", detalle: site.promesas.pago },
  { Icono: IconoDevolucion, titulo: "Derecho a retracto", detalle: site.promesas.retracto },
];

export function TrustBadges({ variante = "barra" }: { variante?: "barra" | "lista" | "micro" }) {
  if (variante === "micro") {
    return (
      <ul aria-label="Compra protegida" className="grid grid-cols-2 gap-x-3 gap-y-2">
        {MICRO.map(({ Icono, texto }) => (
          <li key={texto} className="flex items-start gap-1.5 text-[12px] leading-snug text-ink-suave">
            <Icono className="mt-px h-3.5 w-3.5 shrink-0 text-verde-600" />
            <span>{texto}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (variante === "lista") {
    return (
      <ul className="grid gap-2.5">
        {GARANTIAS.map(({ Icono, titulo, detalle }) => (
          <li key={titulo} className="flex items-start gap-2.5 text-[13px] leading-snug">
            <Icono className="mt-px h-4 w-4 shrink-0 text-verde-600" />
            {/* Solo el detalle: el título lo repetía casi textualmente
                ("Stock en Chile." + "Stock en Chile: sin esperas de 30 días"). */}
            <span className="text-ink-suave">{detalle}</span>
          </li>
        ))}
      </ul>
    );
  }

  // Divisores de 1px: en móvil la grilla es 2×2 (borde derecho en la columna
  // izquierda, borde inferior en la primera fila); desde lg es una sola fila.
  return (
    <section aria-label="Garantías de compra" className="contenedor pt-4">
      <ul className="grid grid-cols-2 overflow-hidden rounded-marca-lg border border-borde bg-white lg:grid-cols-4">
        {GARANTIAS.map(({ Icono, titulo, detalle }, i) => (
          <li
            key={titulo}
            className={`flex gap-2.5 border-borde px-3.5 py-3 ${i % 2 === 0 ? "border-r" : ""} ${
              i < 2 ? "border-b lg:border-b-0" : ""
            } ${i < GARANTIAS.length - 1 ? "lg:border-r" : ""}`}
          >
            <Icono className="mt-0.5 h-4 w-4 shrink-0 text-verde-600" />
            <span>
              <span className="block text-[13px] font-bold leading-snug text-ink">{titulo}</span>
              <span className="mt-0.5 block text-[11.5px] leading-snug text-ink-tenue">{detalle}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
