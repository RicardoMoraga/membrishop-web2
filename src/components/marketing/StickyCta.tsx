"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconoWhatsapp } from "@/components/ui/icons";
import { categorias } from "@/content/clusters";
import { linkWhatsapp, site } from "@/lib/site";

/**
 * Botón flotante de contacto. Solo móvil.
 *
 * NO se muestra en las fichas de producto: ahí manda `StickyBuyBar`, que
 * integra precio, compra y WhatsApp en una sola barra. Dos elementos fijos en
 * la misma esquina se tapan entre sí y el pulgar falla; y si el visitante está
 * mirando un producto, la acción principal es comprarlo, no escribir.
 *
 * Aparece tras 420 px de scroll. Aquí el umbral fijo sí sirve: en páginas de
 * navegación no hay un CTA concreto que observar, a diferencia de la ficha.
 */
const SLUGS_CATEGORIA = new Set(categorias.map((c) => c.slug));

function esFichaDeProducto(pathname: string): boolean {
  const partes = pathname.split("/").filter(Boolean);
  return partes.length === 2 && SLUGS_CATEGORIA.has(partes[0]);
}

export function StickyCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alScrollear = () => setVisible(window.scrollY > 420);
    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  if (esFichaDeProducto(pathname)) return null;

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
