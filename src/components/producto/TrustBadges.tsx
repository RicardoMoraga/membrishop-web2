import { IconoCamion, IconoDevolucion, IconoEscudo, IconoTarjeta } from "@/components/ui/icons";
import { site } from "@/lib/site";

/**
 * Señales de confianza. Todas salen de `site.promesas`, que es la única
 * declaración de promesas comerciales del proyecto: ningún componente inventa
 * plazos, medios de pago ni garantías por su cuenta.
 *
 * Dos presentaciones del mismo contenido:
 *   "barra"  franja de sección, cuatro columnas — home y cierre de la ficha
 *   "lista"  compacta y vertical — dentro de la caja de compra
 */
const GARANTIAS = [
  { Icono: IconoEscudo, titulo: "Stock en Chile", detalle: site.promesas.stock },
  { Icono: IconoCamion, titulo: "Despacho rápido", detalle: site.promesas.despacho },
  { Icono: IconoTarjeta, titulo: "Pago seguro", detalle: site.promesas.pago },
  { Icono: IconoDevolucion, titulo: "Derecho a retracto", detalle: site.promesas.retracto },
];

export function TrustBadges({ variante = "barra" }: { variante?: "barra" | "lista" }) {
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

  return (
    <section
      aria-label="Garantías de compra"
      className="border-y border-borde bg-gradient-to-b from-crema-suave to-lienzo"
    >
      <ul className="contenedor grid grid-cols-2 gap-x-6 gap-y-7 py-8 md:grid-cols-4 md:py-9">
        {GARANTIAS.map(({ Icono, titulo, detalle }) => (
          <li key={titulo} className="flex gap-3">
            <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-oro-100 text-oro-700 ring-4 ring-oro-50">
              <Icono className="h-5 w-5" />
            </span>
            <span>
              <span className="font-display block text-sm font-bold text-ink">{titulo}</span>
              <span className="mt-0.5 block text-[13px] leading-snug text-ink-suave">{detalle}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
