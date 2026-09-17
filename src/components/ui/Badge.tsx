import type { ReactNode } from "react";

type Tono = "stock" | "pronto" | "consultar" | "neutro";

const tonos: Record<Tono, string> = {
  stock: "bg-verde-600 text-white",
  pronto: "bg-crema text-oro-700 ring-1 ring-inset ring-borde-2",
  consultar: "bg-oro-300 text-ink",
  neutro: "bg-ink-tenue text-white",
};

/**
 * Píldora de estado. Solo declara cosas verificables contra Shopify: si hay
 * stock, si la ficha está por publicarse, o si se vende por WhatsApp.
 * No existe tono de oferta: sin un precio anterior realmente cobrado, un
 * descuento es publicidad engañosa (Ley 19.496) y spam de datos estructurados.
 */
export function Badge({ tono = "neutro", children }: { tono?: Tono; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-[4px] px-2 py-1 text-[11px] font-bold leading-none tracking-wide ${tonos[tono]}`}
    >
      {children}
    </span>
  );
}
