"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Aviso de cookies con Google Consent Mode v2.
 *
 * GA4 arranca con `analytics_storage: denied` (ver Analytics.tsx): sin
 * aceptación no se escriben cookies _ga, y Google solo recibe pings sin
 * identificadores. La elección se guarda en localStorage del visitante y se
 * puede cambiar desde el enlace "Preferencias de cookies" del footer.
 *
 * Es un requisito de información y consentimiento para la analítica
 * (Ley 21.719, vigente desde el 01-12-2026). El sitio no usa cookies de
 * publicidad; si algún día se agrega un píxel, debe respetar esta misma
 * elección antes de cargarse.
 */

export const CLAVE_CONSENTIMIENTO = "ms-consentimiento-analitica";
const EVENTO_ABRIR = "ms-abrir-consentimiento";

type Eleccion = "aceptada" | "rechazada";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function leer(): Eleccion | null {
  try {
    const v = window.localStorage.getItem(CLAVE_CONSENTIMIENTO);
    return v === "aceptada" || v === "rechazada" ? v : null;
  } catch {
    return null;
  }
}

function aplicar(eleccion: Eleccion) {
  try {
    window.localStorage.setItem(CLAVE_CONSENTIMIENTO, eleccion);
  } catch {
    // Sin almacenamiento (modo privado): la elección vale solo para esta visita.
  }
  window.gtag?.("consent", "update", {
    analytics_storage: eleccion === "aceptada" ? "granted" : "denied",
  });
}

export function ConsentimientoCookies() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (leer() === null) setVisible(true);
    const abrir = () => setVisible(true);
    window.addEventListener(EVENTO_ABRIR, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR, abrir);
  }, []);

  if (!visible) return null;

  const elegir = (e: Eleccion) => {
    aplicar(e);
    setVisible(false);
  };

  return (
    <section
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-marca-lg border border-borde bg-white p-4 text-[13.5px] leading-relaxed text-ink shadow-lg md:bottom-5"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <p>
        Usamos Google Analytics para saber qué páginas se visitan y mejorar la tienda. Solo se
        activa si lo aceptas. No usamos cookies de publicidad.{" "}
        <Link href="/politica-de-privacidad#cookies" className="font-semibold text-verde-600 underline underline-offset-2">
          Más detalle
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => elegir("aceptada")}
          className="min-h-11 rounded-marca bg-verde-600 px-4 font-semibold text-crema hover:bg-verde-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-600"
        >
          Aceptar analítica
        </button>
        <button
          type="button"
          onClick={() => elegir("rechazada")}
          className="min-h-11 rounded-marca border border-borde-2 bg-white px-4 font-semibold text-ink hover:bg-crema focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-600"
        >
          Rechazar
        </button>
      </div>
    </section>
  );
}

/** Enlace del footer para reabrir el aviso y cambiar la elección. */
export function BotonPreferenciasCookies({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(EVENTO_ABRIR))}
    >
      Preferencias de cookies
    </button>
  );
}
