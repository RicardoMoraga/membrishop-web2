import { site } from "@/lib/site";

/**
 * Barra superior de anuncio. NO es sticky a propósito: se va con el scroll y
 * deja el header limpio, que es donde vive la navegación.
 *
 * El degradado va de la hoja al fruto (#155a24 → #3d7c1c → #a34c08). Los tres
 * puntos son lo bastante oscuros para que el texto blanco quede sobre 6:1 en
 * todo el ancho, cosa que no pasaría si el degradado terminara en el dorado.
 */
export function AnnounceBar() {
  return (
    <div
      className="text-white"
      style={{
        background: "linear-gradient(90deg, #155a24 0%, #3d7c1c 45%, #a34c08 100%)",
      }}
    >
      <p className="contenedor py-2.5 text-center text-[12.5px] font-semibold uppercase leading-snug tracking-[0.02em]">
        {/* En mobile solo la promesa de despacho: la frase completa ocupaba tres líneas. */}
        <span className="hidden sm:inline">Stock en Chile, sin esperas de 30 días · </span>
        <strong className="font-bold">{site.promesas.despacho}</strong>
      </p>
    </div>
  );
}
