"use client";

import { useEffect, useState } from "react";
import { IconoWhatsapp } from "@/components/ui/icons";
import { linkWhatsapp, site } from "@/lib/site";

/**
 * Botón flotante de contacto. Solo móvil (`md:hidden`).
 *
 * Aparece tras 420 px de scroll: mostrarlo de inmediato tapa el hero y baja la
 * tasa de clic. Reserva espacio con `env(safe-area-inset-bottom)` para no
 * chocar con la barra de gestos de iOS.
 */
export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alScrollear = () => setVisible(window.scrollY > 420);
    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-borde bg-lienzo/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href={linkWhatsapp("botón flotante móvil")}
        target="_blank"
        rel="noopener noreferrer"
        data-evento="cta_whatsapp_flotante"
        className="flex w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-5 py-3.5 text-base font-bold text-ink shadow-elevada active:brightness-95"
      >
        <IconoWhatsapp className="h-5 w-5" />
        Consultar por WhatsApp
        <span className="sr-only"> — {site.contacto.horario}</span>
      </a>
    </div>
  );
}
