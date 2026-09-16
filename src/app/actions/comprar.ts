"use server";

import { z } from "zod";
import {
  crearCheckoutUrl,
  getProductoPorHandle,
  tiendaAbierta,
  type EstadoIntegracion,
} from "@/lib/shopify";

export type MotivoFallo =
  | "sin-stock"
  | "no-encontrado"
  | "sin-configurar"
  | "error-api"
  | "tienda-cerrada";

export type EstadoComprar =
  | { ok: true; checkoutUrl: string }
  | { ok: false; motivo: MotivoFallo };

/**
 * `varianteId` es la forma correcta: es la variante que el usuario tiene
 * seleccionada. `handle` queda como atajo para productos de variante única,
 * donde "la primera variante" y "la seleccionada" son lo mismo.
 */
export type EntradaComprar =
  | { varianteId: string; cantidad?: number }
  | { handle: string; cantidad?: number };

const MAX_CANTIDAD = 20;

// Sin tope en el esquema: una cantidad mayor se recorta a MAX_CANTIDAD en vez de rechazar la compra.
const esquemaCantidad = z.number().int().min(1).optional();

const esquemaComprar = z.union([
  z.object({
    varianteId: z.string().regex(/^gid:\/\/shopify\/ProductVariant\/\d+$/),
    cantidad: esquemaCantidad,
  }),
  z.object({
    handle: z
      .string()
      .max(200)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    cantidad: esquemaCantidad,
  }),
]);

function motivoDesdeEstado(estado: EstadoIntegracion): MotivoFallo {
  switch (estado) {
    case "ok-agotado":
      return "sin-stock";
    case "no-encontrado":
      return "no-encontrado";
    case "sin-configurar":
      return "sin-configurar";
    default:
      return "error-api";
  }
}

export async function comprar(entrada: EntradaComprar): Promise<EstadoComprar> {
  // Defensa en profundidad: la UI no debe renderizar el botón que llega acá
  // mientras la tienda esté cerrada, pero si algo lo invoca de todos modos
  // (devtools, un componente que se nos escapó) no se crea un carrito que
  // termina en /password.
  if (!tiendaAbierta) return { ok: false, motivo: "tienda-cerrada" };

  const parseo = esquemaComprar.safeParse(entrada);
  if (!parseo.success) {
    return { ok: false, motivo: "no-encontrado" };
  }

  const cantidad = Math.min(parseo.data.cantidad ?? 1, MAX_CANTIDAD);

  let varianteId: string;

  if ("varianteId" in parseo.data) {
    varianteId = parseo.data.varianteId;
  } else {
    const resultado = await getProductoPorHandle(parseo.data.handle);
    if (resultado.estado !== "ok-disponible" || !resultado.producto) {
      return { ok: false, motivo: motivoDesdeEstado(resultado.estado) };
    }
    const variante = resultado.producto.variantes.find((v) => v.disponible);
    if (!variante) return { ok: false, motivo: "sin-stock" };
    varianteId = variante.id;
  }

  const checkout = await crearCheckoutUrl(varianteId, cantidad);

  if (checkout.estado === "sin-configurar") return { ok: false, motivo: "sin-configurar" };
  if (checkout.estado === "error-api") return { ok: false, motivo: "error-api" };

  return { ok: true, checkoutUrl: checkout.checkoutUrl };
}
