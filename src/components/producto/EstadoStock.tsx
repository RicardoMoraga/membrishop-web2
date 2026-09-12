import type { EstadoIntegracion, ProductoShopify } from "@/lib/shopify";

/**
 * Traduce el estado de integración a una línea que el comprador entienda.
 *
 * La regla que gobierna este componente: **agotado y caído nunca dicen lo
 * mismo**. Si la integración falla, se dice que no se pudo confirmar la
 * disponibilidad — no se afirma que no hay stock, porque no se sabe.
 *
 * Escasez: solo se muestra cuando Shopify entrega `cantidadDisponible`, lo que
 * exige el scope `unauthenticated_read_product_inventory`. Sin ese dato no se
 * habla de unidades. Nunca un "últimas unidades" fijo.
 */
const UMBRAL_POCAS_UNIDADES = 3;

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
    const pocas = quedan !== null && quedan > 0 && quedan <= UMBRAL_POCAS_UNIDADES;

    return (
      <p className={`${base} ${pocas ? "text-oro-700" : "text-verde-600"}`}>
        <span className={`${punto} ${pocas ? "bg-oro-500" : "bg-verde-500"}`} aria-hidden="true" />
        {pocas ? `Quedan ${quedan} ${quedan === 1 ? "unidad" : "unidades"}` : "Con stock en Chile"}
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
