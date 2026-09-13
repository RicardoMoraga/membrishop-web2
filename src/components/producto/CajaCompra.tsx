"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ComprarButton } from "@/components/marketing/ComprarButton";
import { LeadForm } from "@/components/marketing/LeadForm";
import { EstadoStock } from "@/components/producto/EstadoStock";
import { StickyBuyBar } from "@/components/producto/StickyBuyBar";
import { IconoWhatsapp } from "@/components/ui/icons";
import { precioCLP } from "@/lib/formato";
import { tiendaAbierta, type EstadoIntegracion, type ProductoShopify } from "@/lib/shopify";

/**
 * Caja de compra: precio, disponibilidad, variante, cantidad y acción.
 *
 * Cliente porque la variante y la cantidad son estado de interfaz, y porque la
 * barra fija necesita observar el CTA. Todo lo que no cambia con la
 * interacción (copy, especificaciones, FAQ) se queda en el servidor.
 *
 * Precio: manda Shopify. `precioFallback` viene del contenido editorial y solo
 * aparece cuando la integración está caída, rotulado como referencial — nunca
 * se presenta un precio de catálogo como si fuera el precio de venta vigente.
 */
type Props = {
  estado: EstadoIntegracion;
  producto: ProductoShopify | null;
  handle: string;
  nombre: string;
  precioFallback: number | null;
  hrefWhatsapp: string;
  /**
   * `<TrustBadges variante="lista" />` renderizado por el Server Component
   * padre (`PdpTemplate`). Es 100% estático — no depende de `varianteId`,
   * `cantidad` ni ningún estado de esta caja — así que se pasa ya resuelto en
   * vez de importarlo aquí: saca sus íconos y su markup del bundle de cliente
   * sin cambiar nada de lo que ve el usuario.
   */
  trustBadges: ReactNode;
};

export function CajaCompra({
  estado,
  producto,
  handle,
  nombre,
  precioFallback,
  hrefWhatsapp,
  trustBadges,
}: Props) {
  const variantesDisponibles = producto?.variantes.filter((v) => v.disponible) ?? [];
  const [varianteId, setVarianteId] = useState<string | null>(
    variantesDisponibles[0]?.id ?? producto?.variantes[0]?.id ?? null,
  );
  const [cantidad, setCantidad] = useState(1);
  const [stickyVisible, setStickyVisible] = useState(false);
  const anclaCta = useRef<HTMLDivElement>(null);

  const comprable = estado === "ok-disponible";
  const falloIntegracion = estado === "sin-configurar" || estado === "error-api";
  // Hay stock real y confirmado por Shopify, pero mientras la tienda tenga
  // contraseña activa el checkout de Shopify no sirve: se compra por
  // WhatsApp con el mismo precio y disponibilidad, sin botón que dead-endee.
  const compraShopifyHabilitada = comprable && tiendaAbierta;

  useEffect(() => {
    const el = anclaCta.current;
    if (!el || !comprable) return;
    const observador = new IntersectionObserver(
      ([entrada]) => setStickyVisible(!entrada.isIntersecting),
      { rootMargin: "0px 0px -8px 0px" },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, [comprable]);

  const variante = producto?.variantes.find((v) => v.id === varianteId) ?? null;
  const precio = variante?.precio ?? producto?.precio ?? null;
  const maximo = variante?.cantidadDisponible ?? 20;

  return (
    <div className="grid gap-5">
      {/* ---- Precio ---- */}
      <div>
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          {precio !== null ? (
            <span className="font-display text-3xl font-extrabold text-ink">
              {precioCLP(precio)}
            </span>
          ) : precioFallback !== null ? (
            <span className="font-display text-3xl font-extrabold text-ink-suave">
              {precioCLP(precioFallback)}
            </span>
          ) : (
            <span className="text-lg font-semibold text-ink-suave">Precio por confirmar</span>
          )}
          <span className="text-[13px] text-ink-tenue">IVA incluido</span>
        </div>
        {precio === null && precioFallback !== null && (
          <p className="mt-1 text-[12.5px] text-ink-tenue">
            Precio referencial: no pudimos confirmarlo con la tienda en este momento.
          </p>
        )}
      </div>

      <EstadoStock estado={estado} producto={producto} varianteId={varianteId} />

      {/* ---- Variantes: solo si el producto tiene opciones reales ---- */}
      {producto?.tieneVariantes && producto.variantes.length > 1 && (
        <fieldset className="grid gap-2">
          <legend className="mb-1 text-sm font-semibold text-ink">
            {producto.opciones[0]?.nombre ?? "Opción"}
          </legend>
          <div className="flex flex-wrap gap-2">
            {producto.variantes.map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={!v.disponible}
                onClick={() => {
                  setVarianteId(v.id);
                  setCantidad(1);
                }}
                aria-pressed={v.id === varianteId}
                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                  v.id === varianteId
                    ? "bg-ink text-lienzo"
                    : "bg-white text-ink ring-1 ring-inset ring-borde-2 hover:ring-oro-400"
                } disabled:cursor-not-allowed disabled:text-ink-tenue disabled:line-through disabled:ring-borde`}
              >
                {v.titulo}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* ---- Cantidad + acción principal ---- */}
      {compraShopifyHabilitada ? (
        <div ref={anclaCta} className="grid gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-ink">Cantidad</span>
            <div className="inline-flex items-center rounded-full ring-1 ring-inset ring-borde-2">
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                disabled={cantidad <= 1}
                aria-label="Quitar una unidad"
                className="h-10 w-10 rounded-l-full text-lg font-bold text-ink disabled:text-ink-tenue"
              >
                −
              </button>
              <span
                className="w-9 text-center text-sm font-bold tabular-nums"
                aria-live="polite"
                aria-label={`Cantidad: ${cantidad}`}
              >
                {cantidad}
              </span>
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.min(maximo, c + 1))}
                disabled={cantidad >= maximo}
                aria-label="Agregar una unidad"
                className="h-10 w-10 rounded-r-full text-lg font-bold text-ink disabled:text-ink-tenue"
              >
                +
              </button>
            </div>
          </div>

          <ComprarButton
            varianteId={varianteId ?? undefined}
            handle={handle}
            cantidad={cantidad}
            className="w-full py-3.5 text-base"
          />

          <a
            href={hrefWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-evento={`whatsapp_pdp_${handle}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-verde-600 ring-2 ring-inset ring-verde-200 transition-colors hover:bg-verde-50"
          >
            <IconoWhatsapp className="h-4 w-4" />
            Consultar por WhatsApp
          </a>
        </div>
      ) : comprable ? (
        // Tienda cerrada (contraseña activa en Shopify): hay stock y precio
        // reales, pero el checkout de Shopify redirige a /password. WhatsApp
        // pasa a ser el CTA principal — mismo trato, otro canal de cobro.
        <div ref={anclaCta} className="grid gap-3 rounded-marca bg-crema-suave p-4 ring-1 ring-inset ring-borde">
          <p className="text-sm font-semibold text-ink">Disponible — se compra por WhatsApp</p>
          <p className="text-[13px] leading-snug text-ink-suave">
            Estamos habilitando el pago en línea. Mientras tanto coordinamos tu compra directo por
            WhatsApp: mismo precio, misma boleta electrónica.
          </p>
          <a
            href={hrefWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-evento={`whatsapp_tienda_cerrada_${handle}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-oro-400 px-5 py-3.5 text-base font-semibold text-ink shadow-suave transition-[filter] hover:brightness-95"
          >
            <IconoWhatsapp className="h-5 w-5" />
            Comprar por WhatsApp
          </a>
        </div>
      ) : estado === "ok-agotado" ? (
        <div className="grid gap-3 rounded-marca bg-crema-suave p-4 ring-1 ring-inset ring-borde">
          <p className="text-sm font-semibold text-ink">Avísame cuando vuelva</p>
          <p className="text-[13px] leading-snug text-ink-suave">
            Te escribimos una sola vez, cuando este producto vuelva a tener stock.
          </p>
          <LeadForm variante="newsletter" origen={`reposicion:${handle}`} />
          <a
            href={hrefWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-evento={`whatsapp_agotado_${handle}`}
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-verde-600 underline underline-offset-4"
          >
            <IconoWhatsapp className="h-4 w-4" />
            O pregúntanos por WhatsApp
          </a>
        </div>
      ) : (
        <div className="grid gap-3">
          {falloIntegracion && (
            <p className="text-[13px] leading-snug text-ink-suave">
              No pudimos conectar con la tienda en este momento. Escríbenos y te confirmamos
              disponibilidad y precio al tiro.
            </p>
          )}
          <a
            href={hrefWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-evento={`whatsapp_fallback_${handle}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3.5 text-base font-semibold text-ink shadow-suave transition-[filter] hover:brightness-95"
          >
            <IconoWhatsapp className="h-5 w-5" />
            Consultar por WhatsApp
          </a>
        </div>
      )}

      <div className="border-t border-borde pt-4">{trustBadges}</div>

      {/* ---- Barra fija mobile ---- */}
      {comprable && (
        <StickyBuyBar visible={stickyVisible}>
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-ink-tenue">{nombre}</p>
              {precio !== null && (
                <p className="font-display text-base font-extrabold leading-tight text-ink">
                  {precioCLP(precio)}
                </p>
              )}
            </div>
            {compraShopifyHabilitada ? (
              <>
                <ComprarButton
                  varianteId={varianteId ?? undefined}
                  handle={handle}
                  cantidad={cantidad}
                  className="flex-1 py-3"
                />
                <a
                  href={hrefWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Consultar por WhatsApp"
                  data-evento={`whatsapp_sticky_${handle}`}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-whatsapp text-ink"
                >
                  <IconoWhatsapp className="h-5 w-5" />
                </a>
              </>
            ) : (
              <a
                href={hrefWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                data-evento={`whatsapp_sticky_tienda_cerrada_${handle}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-oro-400 py-3 text-sm font-semibold text-ink shadow-suave transition-[filter] hover:brightness-95"
              >
                <IconoWhatsapp className="h-4 w-4" />
                Comprar por WhatsApp
              </a>
            )}
          </div>
        </StickyBuyBar>
      )}
    </div>
  );
}
