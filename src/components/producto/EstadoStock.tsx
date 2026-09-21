import type { EstadoIntegracion, ProductoShopify } from "@/lib/shopify";

/**
 * Traduce el estado de integración a una línea que el comprador entienda.
 *
 * La regla que gobierna este componente: **agotado y caído nunca dicen lo
 * mismo**. Si la integración falla, se dice que no se pudo confirmar la
 * disponibilidad — no se afirma que no hay stock, porque no se sabe.
 *
 * Unidades: con `cantidadDisponible` (scope `unauthenticated_read_product_inventory`)
 * y hasta UMBRAL_MOSTRAR_UNIDADES se muestra el número real ("Quedan N unidades").
 * Sobre el umbral, o sin el dato, solo "Disponible". Nunca un "pocas/últimas
 * unidades" que no corresponda al inventario real (Ley 19.496, art. 28).
 */
const UMBRAL_MOSTRAR_UNIDADES = 10;

export function EstadoStock({
  estado,
  producto,
  varianteId,
}: {
  estado: EstadoIntegracion;
  producto: ProductoShopify | null;
  varianteId?: string | null;
}) {
  const base = "flex items-center gap-2 text-sm font-semibold";
  const punto = "inline-block h-2 w-2 shrink-0 rounded-full";

  if (estado === "ok-disponible") {
    const variante =
      producto?.variantes.find((v) => v.id === varianteId) ??
      producto?.variantes.find((v) => v.disponible);
    const quedan = variante?.cantidadDisponible ?? null;
    const mostrarUnidades =
      quedan !== null && quedan > 0 && quedan <= UMBRAL_MOSTRAR_UNIDADES;

    return (
      <p className={`${base} text-verde-600`}>
        <span className={`${punto} bg-verde-500`} aria-hidden="true" />
        {mostrarUnidades
          ? `Quedan ${quedan} ${quedan === 1 ? "unidad" : "unidades"}`
          : "Disponible"}
      </p>
    );
  }

  if (estado === "ok-agotado") {
    return (
      <p className={`${base} text-ink-suave`}>
        <span className={`${punto} bg-ink-tenue`} aria-hidden="true" />
        Sin stock por ahora
      </p>
    );
  }

  if (estado === "no-encontrado") {
    return (
      <p className={`${base} text-ink-suave`}>
        <span className={`${punto} bg-ink-tenue`} aria-hidden="true" />
        Disponible por encargo
      </p>
    );
  }

  // sin-configurar | error-api
  return (
    <p className={`${base} text-ink-suave`}>
      <span className={`${punto} bg-cocido-400`} aria-hidden="true" />
      No pudimos confirmar la disponibilidad
    </p>
  );
}
