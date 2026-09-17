"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { IconoCerrar, IconoMenu, IconoWhatsapp } from "@/components/ui/icons";
import { categorias } from "@/content/clusters";
import { linkWhatsapp } from "@/lib/site";

const ENLACES = [
  ...categorias.map((c) => ({ href: `/${c.slug}`, label: c.nombre })),
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();
  const botonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setAbierto(false), [pathname]);

  useEffect(() => {
    if (!abierto) return;

    document.body.style.overflow = "hidden";

    // Cerrar con Escape y devolver el foco al botón: sin esto, quien navega
    // con teclado queda atrapado detrás del panel.
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        botonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", alTeclear);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", alTeclear);
    };
  }, [abierto]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-borde bg-white">
        {/* Fila 1: marca + acción. Sin buscador ni carro: el sitio no tiene
            búsqueda ni carro persistente (la compra va directo al checkout). */}
        <div className="contenedor flex h-14 items-center gap-4 md:h-16">
          <Link
            href="/"
            aria-label="MembriShop — ir al inicio"
            className="mr-auto flex shrink-0 flex-col justify-center"
          >
            <Logo prioridad className="h-[30px] md:h-[38px]" />
            <span className="mt-0.5 hidden text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink-tenue sm:block">
              Mascotas · Tecnología · Hogar
            </span>
          </Link>

          <a
            href={linkWhatsapp("desde el header")}
            target="_blank"
            rel="noopener noreferrer"
            data-evento="cta_header_whatsapp"
            className="hidden h-11 items-center gap-2 rounded-marca bg-verde-600 px-4 text-[13.5px] font-bold text-white transition-colors hover:bg-verde-700 sm:inline-flex"
          >
            <IconoWhatsapp className="h-4 w-4" />
            Escríbenos
          </a>

          <button
            ref={botonRef}
            type="button"
            onClick={() => setAbierto(true)}
            aria-expanded={abierto}
            aria-controls="panel-navegacion"
            className="inline-flex h-11 w-11 items-center justify-center rounded-marca text-ink transition-colors hover:bg-crema lg:hidden"
          >
            <span className="sr-only">Abrir menú</span>
            <IconoMenu className="h-6 w-6" />
          </button>
        </div>

        {/* Fila 2: categorías. Desplazable en horizontal si no cabe. */}
        <nav aria-label="Principal" className="border-t border-borde">
          <ul className="contenedor flex items-center gap-x-6 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
            {ENLACES.map((enlace) => {
              const activo = pathname.startsWith(enlace.href);
              const esContacto = enlace.href === "/contacto";
              return (
                <li key={enlace.href} className={esContacto ? "ml-auto" : undefined}>
                  <Link
                    href={enlace.href}
                    aria-current={activo ? "page" : undefined}
                    className={`flex h-11 items-center border-b-2 text-[13.5px] font-semibold transition-colors ${
                      activo
                        ? "border-verde-600 text-verde-600"
                        : esContacto
                          ? "border-transparent text-ink-tenue hover:text-ink"
                          : "border-transparent text-ink hover:text-verde-600"
                    }`}
                  >
                    {enlace.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* Panel lateral. Se monta siempre para que la transición funcione en
          los dos sentidos; `inert` lo saca del foco y del lector de pantalla
          cuando está cerrado. */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${abierto ? "" : "pointer-events-none"}`}
        inert={!abierto}
      >
        <div
          onClick={() => setAbierto(false)}
          className={`absolute inset-0 bg-ink/50 transition-opacity duration-200 ${
            abierto ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          ref={panelRef}
          id="panel-navegacion"
          role="dialog"
          aria-modal="true"
          aria-label="Navegación"
          tabIndex={-1}
          className={`absolute inset-y-0 right-0 flex w-[min(320px,86vw)] flex-col border-l border-borde bg-white transition-transform duration-200 ${
            abierto ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-[60px] items-center justify-between border-b border-borde px-4">
            <Logo className="h-[28px]" />
            <button
              type="button"
              onClick={() => {
                setAbierto(false);
                botonRef.current?.focus();
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-marca text-ink transition-colors hover:bg-crema"
            >
              <span className="sr-only">Cerrar menú</span>
              <IconoCerrar className="h-6 w-6" />
            </button>
          </div>

          <nav aria-label="Navegación (móvil)" className="flex-1 overflow-y-auto p-4">
            <ul className="flex flex-col gap-1">
              {ENLACES.map((enlace) => (
                <li key={enlace.href}>
                  <Link
                    href={enlace.href}
                    className="block rounded-marca px-3 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-crema"
                  >
                    {enlace.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-borde p-4">
            <a
              href={linkWhatsapp("desde el menú móvil")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-marca bg-whatsapp px-5 text-base font-bold text-ink"
            >
              <IconoWhatsapp className="h-5 w-5" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
