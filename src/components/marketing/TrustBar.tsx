import { IconoCamion, IconoDevolucion, IconoEscudo, IconoTarjeta } from "@/components/ui/icons";
import { site } from "@/lib/site";

const GARANTIAS = [
  { Icono: IconoEscudo, titulo: "Stock en Chile", detalle: site.promesas.stock },
  { Icono: IconoCamion, titulo: "Despacho rápido", detalle: site.promesas.despacho },
  { Icono: IconoTarjeta, titulo: "Pago seguro", detalle: site.promesas.pago },
  { Icono: IconoDevolucion, titulo: "Derecho a retracto", detalle: site.promesas.retracto },
];

/** Va justo bajo el hero: responde las cuatro objeciones de la primera compra. */
export function TrustBar() {
  return (
    <section aria-label="Garantías de compra" className="border-y border-borde bg-crema-suave">
      <ul className="contenedor grid grid-cols-2 gap-x-6 gap-y-6 py-7 md:grid-cols-4 md:py-8">
        {GARANTIAS.map(({ Icono, titulo, detalle }) => (
          <li key={titulo} className="flex gap-3">
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-oro-100 text-oro-700">
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
