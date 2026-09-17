"use client";

import { useState, useTransition } from "react";
import { comprar, type MotivoFallo } from "@/app/actions/comprar";
import { estiloPrimario } from "@/components/ui/CtaButton";
import { IconoFlecha } from "@/components/ui/icons";
import { registrarEvento } from "@/lib/analitica";

/**
 * Botón visual idéntico a `CtaButton` (variante primario), pero dispara la
 * Server Action `comprar` en vez de navegar a un href fijo: necesita crear
 * el carrito primero para saber a qué `checkoutUrl` redirigir.
 *
 * Recibe `varianteId` cuando hay una variante seleccionada en pantalla, que
 * es el caso correcto. `handle` queda como atajo para productos de variante
 * única. Se exige al menos uno de los dos en tiempo de tipos.
 */
type Props = {
  className?: string;
  cantidad?: number;
  /** Nombre del evento de analítica. Por defecto `comprar_<handle>`. */
  evento?: string;
} & ({ varianteId: string; handle?: string } | { handle: string; varianteId?: string });

/** Mensaje por motivo: el comprador no debe ver "sin stock" ante un fallo. */
const MENSAJE: Record<MotivoFallo, string> = {
  "sin-stock": "Se agotó mientras mirabas",
  "no-encontrado": "Producto no disponible",
  "sin-configurar": "No se pudo iniciar la compra",
  "error-api": "No se pudo iniciar la compra",
  "tienda-cerrada": "Compra por WhatsApp por ahora",
};

export function ComprarButton({ varianteId, handle, cantidad, evento, className = "" }: Props) {
  const [pendiente, iniciarTransicion] = useTransition();
  const [fallo, setFallo] = useState<MotivoFallo | null>(null);

  const clases = `group inline-flex min-h-11 items-center justify-center gap-1.5 rounded-marca px-3 py-2 text-center text-[13.5px] font-bold leading-tight transition-colors duration-200 ${estiloPrimario} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro-500 focus-visible:ring-offset-2 active:translate-y-px disabled:cursor-wait disabled:opacity-70 ${className}`;

  return (
    <button
      type="button"
      className={clases}
      disabled={pendiente}
      data-evento={evento ?? `comprar_${handle ?? varianteId}`}
      onClick={() => {
        setFallo(null);
        iniciarTransicion(async () => {
          const resultado = varianteId
            ? await comprar({ varianteId, cantidad })
            : await comprar({ handle: handle as string, cantidad });

          if (resultado.ok) {
            // El checkout vive en Shopify: este es el último punto medible aquí.
            registrarEvento("begin_checkout", { evento: evento ?? `comprar_${handle ?? varianteId}` });
            window.location.href = resultado.checkoutUrl;
          } else {
            setFallo(resultado.motivo);
          }
        });
      }}
    >
      {pendiente ? "Preparando compra…" : fallo ? MENSAJE[fallo] : "Comprar ahora"}
      {!pendiente && !fallo && (
        <IconoFlecha className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </button>
  );
}
