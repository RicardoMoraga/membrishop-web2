"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { IconoFlecha } from "@/components/ui/icons";

/**
 * Carrusel horizontal con scroll-snap nativo (sin librerías).
 *
 * Reemplaza las grillas largas de productos que antes se apilaban en una
 * sola columna en mobile y estiraban la página varias pantallas hacia
 * abajo. Acá el contenido se desliza al costado: en touch funciona con el
 * dedo (scroll-snap), en desktop hay flechas además del scroll con mouse.
 *
 * `children` debe ser una lista de nodos (uno por tarjeta); cada uno se
 * envuelve en un slide de ancho fijo con snap-start.
 */
export function Carousel({
  children,
  ariaLabel,
  slideClassName = "w-[78%] sm:w-[46%] lg:w-[27%]",
}: {
  children: ReactNode[];
  ariaLabel: string;
  slideClassName?: string;
}) {
  const pistaRef = useRef<HTMLDivElement>(null);
  const [puedeIzq, setPuedeIzq] = useState(false);
  const [puedeDer, setPuedeDer] = useState(false);

  const actualizarFlechas = () => {
    const el = pistaRef.current;
    if (!el) return;
    setPuedeIzq(el.scrollLeft > 8);
    setPuedeDer(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    actualizarFlechas();
    const el = pistaRef.current;
    if (!el) return;
    const onResize = () => actualizarFlechas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const desplazar = (dir: 1 | -1) => {
    const el = pistaRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={pistaRef}
        role="group"
        aria-label={ariaLabel}
        onScroll={actualizarFlechas}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children.map((hijo, i) => (
          <div key={i} className={`shrink-0 snap-start ${slideClassName}`}>
            {hijo}
          </div>
        ))}
      </div>

      {/* Flechas: solo aportan en puntero fino (mouse/trackpad); en touch el
          swipe nativo ya es la interacción principal, así que se ocultan. */}
      {puedeIzq && (
        <button
          type="button"
          onClick={() => desplazar(-1)}
          aria-label="Ver anteriores"
          className="absolute left-0 top-1/2 hidden -translate-x-3 -translate-y-1/2 items-center justify-center rounded-full border border-borde bg-white/95 p-2.5 text-ink shadow-elevada transition-colors hover:bg-crema [@media(any-pointer:fine)]:flex"
        >
          <IconoFlecha className="h-4 w-4 rotate-180" />
        </button>
      )}
      {puedeDer && (
        <button
          type="button"
          onClick={() => desplazar(1)}
          aria-label="Ver siguientes"
          className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-3 items-center justify-center rounded-full border border-borde bg-white/95 p-2.5 text-ink shadow-elevada transition-colors hover:bg-crema [@media(any-pointer:fine)]:flex"
        >
          <IconoFlecha className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
