"use client";

import { useState } from "react";
import { IconoCompartir, IconoFacebook, IconoWhatsapp, IconoX } from "@/components/ui/icons";
import { urlAbsoluta } from "@/lib/site";

type Props = {
  /** Ruta interna de la página que se comparte. */
  path: string;
  titulo: string;
  className?: string;
  tono?: "claro" | "oscuro";
};

/**
 * Compartir en redes. Usa la Web Share API nativa cuando existe (móvil) y cae
 * a enlaces directos en escritorio.
 */
export function ShareButtons({ path, titulo, className = "", tono = "claro" }: Props) {
  const [copiado, setCopiado] = useState(false);
  const url = urlAbsoluta(path);
  const oscuro = tono === "oscuro";

  const compartirNativo = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: titulo, url });
        return;
      } catch {
        /* el usuario canceló: seguimos al fallback */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  };

  const redes = [
    {
      nombre: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${titulo} ${url}`)}`,
      Icono: IconoWhatsapp,
    },
    {
      nombre: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      Icono: IconoFacebook,
    },
    {
      nombre: "X",
      href: `https://x.com/intent/post?text=${encodeURIComponent(titulo)}&url=${encodeURIComponent(url)}`,
      Icono: IconoX,
    },
  ];

  const boton = oscuro
    ? "bg-white/12 text-white hover:bg-white/25"
    : "bg-crema text-oro-700 hover:bg-oro-100";

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className={`mr-1 text-sm font-medium ${oscuro ? "text-white/75" : "text-ink-suave"}`}>
        Compartir:
      </span>

      {redes.map(({ nombre, href, Icono }) => (
        <a
          key={nombre}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Compartir en ${nombre}`}
          data-evento={`compartir_${nombre.toLowerCase()}`}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${boton}`}
        >
          <Icono className="h-[18px] w-[18px]" />
        </a>
      ))}

      <button
        type="button"
        onClick={compartirNativo}
        aria-label="Compartir o copiar enlace"
        className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${boton}`}
      >
        <IconoCompartir className="h-[18px] w-[18px]" />
        {copiado ? "¡Enlace copiado!" : "Copiar"}
      </button>
    </div>
  );
}
