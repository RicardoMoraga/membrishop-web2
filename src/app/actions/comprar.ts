"use server";

import { crearCheckoutUrl, getVarianteIdPorHandle } from "@/lib/shopify";

export type EstadoComprar =
  | { ok: true; checkoutUrl: string }
  | { ok: false; motivo: "sin-stock" | "sin-configurar" | "error" };

/**
 * Server Action del botón "Comprar ahora". Arma el carrito en Shopify y
 * devuelve la URL de checkout para que el cliente redirija.
 *
 * Si Shopify no está configurado, el handle no existe, o no hay stock,
 * devuelve un estado de fallo sin lanzar: el componente que llama sigue
 * mostrando el CTA de WhatsApp actual en vez de romper la página.
 */
export async function comprar(handle: string): Promise<EstadoComprar> {
  const varianteId = await getVarianteIdPorHandle(handle);
  if (!varianteId) {
    return { ok: false, motivo: "sin-stock" };
  }

  const checkoutUrl = await crearCheckoutUrl(varianteId, 1);
  if (!checkoutUrl) {
    return { ok: false, motivo: "error" };
  }

  return { ok: true, checkoutUrl };
}
