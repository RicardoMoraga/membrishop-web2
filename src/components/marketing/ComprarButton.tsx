"use client";

import { useState, useTransition } from "react";
import { comprar } from "@/app/actions/comprar";
import { IconoFlecha } from "@/components/ui/icons";

/**
 * Botón visual idéntico a `CtaButton` (variante primario), pero dispara la
 * Server Action `comprar` en vez de navegar a un href fijo: necesita crear
 * el carrito primero para saber a qué `checkoutUrl` redirigir.
 */
export function ComprarButton({ handle, className = "" }: { handle: string; className?: string }) {
  const [pendiente, iniciarTransicion] = useTransition();
  const [error, setError] = useState(false);

  const clases = `group inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 bg-oro-400 text-ink shadow-suave hover:bg-oro-300 hover:shadow-elevada active:translate-y-px disabled:cursor-wait disabled:opacity-70 ${className}`;

  return (
    <button
      type="button"
      className={clases}
      disabled={pendiente}
      data-evento={`comprar_${handle}`}
      onClick={() => {
        setError(false);
        iniciarTransicion(async () => {
          const resultado = await comprar(handle);
          if (resultado.ok) {
            window.location.href = resultado.checkoutUrl;
          } else {
            setError(true);
          }
        });
      }}
    >
      {pendiente ? "Preparando compra…" : error ? "No se pudo iniciar la compra" : "Comprar ahora"}
      {!pendiente && (
        <IconoFlecha className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </button>
  );
}
