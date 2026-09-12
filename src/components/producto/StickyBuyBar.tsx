"use client";

import type { ReactNode } from "react";

/**
 * Barra fija inferior de compra, solo mobile.
 *
 * Reemplaza al botón flotante de WhatsApp dentro de la ficha: dos elementos
 * fijos en la misma esquina se tapan entre sí y el pulgar falla. Aquí el
 * WhatsApp vive dentro de la barra, como icono, y la acción principal ocupa
 * el ancho.
 *
 * Aparece por observación del CTA real, no por un umbral de píxeles fijo: un
 * `scrollY > 420` se comporta distinto en cada ficha según su largo.
 */
export function StickyBuyBar({ visible, children }: { visible: boolean; children: ReactNode }) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-borde bg-lienzo/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}
