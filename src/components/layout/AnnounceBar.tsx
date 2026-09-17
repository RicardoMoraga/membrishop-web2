import { site } from "@/lib/site";

/**
 * Barra superior de anuncio. NO es sticky a propósito: se va con el scroll y
 * deja el header limpio, que es donde vive la navegación.
 * Fondo verde de marca (#155a24): el texto blanco queda en 8,3:1.
 */
export function AnnounceBar() {
  return (
    <div className="bg-verde-600 text-white">
      <p className="contenedor py-2.5 text-center text-[12.5px] font-semibold uppercase leading-snug tracking-[0.02em]">
        Stock en Chile, sin esperas de 30 días ·{" "}
        <strong className="font-bold">{site.promesas.despacho}</strong>
      </p>
    </div>
  );
}
