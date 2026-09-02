import type { ReactNode } from "react";

type Tono = "stock" | "pronto" | "consultar" | "neutro" | "oferta";

const tonos: Record<Tono, string> = {
  stock: "bg-verde-500 text-white",
  pronto: "bg-crema text-oro-700 ring-1 ring-inset ring-borde-2",
  consultar: "bg-oro-300 text-ink",
  neutro: "bg-ink-tenue text-white",
  oferta: "bg-oro-600 text-white",
};

/**
 * Píldora de estado. Solo declara cosas verificables: si hay stock, si la
 * ficha está por publicarse, si se vende por WhatsApp, o si el precio bajó
 * respecto al `precioAntes` real del catálogo. Nunca "más vendido" ni un
 * descuento inventado sin un precio anterior real detrás.
 */
export function Badge({ tono = "neutro", children }: { tono?: Tono; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold leading-none tracking-wide ${tonos[tono]}`}
    >
      {children}
    </span>
  );
}
