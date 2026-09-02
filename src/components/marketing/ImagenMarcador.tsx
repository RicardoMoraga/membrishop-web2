import { Isotipo } from "@/components/brand/Logo";
import type { Imagen } from "@/content/clusters";

/**
 * Marcador de posición mientras no existan las fotos de producto.
 *
 * Reserva la proporción exacta (`aspect-square`) para que cuando entre la foto
 * real la página no dé el salto de layout que castiga el CLS.
 *
 * Cuando tengas la foto, súbela a /public/images con el nombre de `archivo` y
 * reemplaza este bloque por:
 *   <Image src={`/images/${imagen.archivo}`} alt={imagen.alt} title={imagen.title}
 *          width={1200} height={1200} sizes="(max-width: 768px) 100vw, 25vw"
 *          className="h-full w-full object-cover" />
 */
export function ImagenMarcador({
  imagen,
  ratio = "aspect-[4/3]",
  mostrarArchivo = true,
}: {
  imagen: Imagen;
  ratio?: string;
  mostrarArchivo?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={imagen.alt}
      title={imagen.title}
      className={`${ratio} relative flex w-full shrink-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-marca border border-borde/70 bg-gradient-to-br from-oro-50 via-crema to-verde-50`}
    >
      <Isotipo className="h-12 w-auto opacity-70" />
      {mostrarArchivo && (
        <code className="max-w-[85%] truncate rounded bg-white/75 px-2 py-1 text-[11px] text-ink-suave">
          {imagen.archivo}
        </code>
      )}
    </div>
  );
}
