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
      <header className="sticky top-0 z-50 border-b border-borde bg-lienzo/92 backdrop-blur-lg backdrop-saturate-150">
        <div className="contenedor flex h-[60px] items-center gap-4 md:h-[72px]">
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

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {ENLACES.map((enlace) => {
                const activo = pathname.startsWith(enlace.href);
                return (
                  <li key={enlace.href}>
                    <Link
                      href={enlace.href}
                      aria-current={activo ? "page" : undefined}
                      className={`inline-block border-b-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                        activo
                          ? "border-oro-400 text-oro-700"
                          : "border-transparent text-ink-suave hover:border-oro-300 hover:text-oro-700"
                      }`}
                    >
                      {enlace.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <a
            href={linkWhatsapp("desde el header")}
            target="_blank"
            rel="noopener noreferrer"
            data-evento="cta_header_whatsapp"
            className="hidden items-center gap-2 rounded-full bg-verde-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-verde-700 sm:inline-flex"
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-crema lg:hidden"
          >
            <span className="sr-only">Abrir menú</span>
            <IconoMenu className="h-6 w-6" />
          </button>
        </div>
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
          className={`absolute inset-y-0 right-0 flex w-[min(320px,86vw)] flex-col bg-lienzo shadow-elevada transition-transform duration-200 ${
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-crema"
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
              className="flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3.5 text-base font-bold text-ink"
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
