"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagenMarcador } from "@/components/marketing/ImagenMarcador";
import type { Imagen } from "@/content/clusters";

/**
 * Galería de producto.
 *
 * Proporción 4/5, no cuadrada, y es una decisión de conversión medida en
 * mobile: en 390×844 quedan unos 650 px útiles. Con la galería a 4/5 ocupa
 * 312 px y, sumados el anuncio (32) y el header (56), el H1, el precio, el
 * estado de stock y el botón entran en la primera pantalla. Con la imagen
 * cuadrada, solo la imagen ocupa 390 px y el botón cae fuera de pantalla.
 *
 * La lista de medios manda: sin video no se reserva hueco, con una sola
 * imagen no se dibujan miniaturas ni contador. Nunca hay un slot vacío.
 */

export type MedioGaleria =
  | { tipo: "imagen"; url: string; alt: string }
  | { tipo: "video"; url: string; poster: string | null; alt: string }
  | { tipo: "marcador"; imagen: Imagen };

/**
 * Proporción del medio. En escritorio manda la relación 4/5; en mobile manda
 * la ALTURA, no la proporción, y es una corrección medida sobre el render
 * real: la franja de anuncio ocupa dos líneas (52 px) y con el header y el
 * breadcrumb se comen 144 px antes de la galería, bastante más que los 88 px
 * que suponía la especificación. Con 4/5 puro la imagen medía 447 px y el
 * precio caía fuera de la primera pantalla en 390×844.
 *
 * Con la altura acotada, imagen, título, precio y estado de stock entran
 * sobre el pliegue; del CTA se encarga además la barra fija.
 */
const RATIO_ESCRITORIO = "aspect-[4/5]";
const ALTO_MOVIL = "h-[min(48vh,400px)]";

function Medio({
  medio,
  prioridad,
  forma,
}: {
  medio: MedioGaleria;
  prioridad: boolean;
  forma: string;
}) {
  if (medio.tipo === "marcador") {
    return <ImagenMarcador imagen={medio.imagen} ratio={forma} mostrarArchivo={false} />;
  }

  if (medio.tipo === "video") {
    return (
      <video
        className={`${forma} w-full rounded-marca border border-borde/70 bg-crema object-cover`}
        src={medio.url}
        poster={medio.poster ?? undefined}
        controls
        muted
        playsInline
        preload="metadata"
        aria-label={medio.alt || "Video del producto"}
      />
    );
  }

  return (
    <div className={`${forma} relative w-full overflow-hidden rounded-marca border border-borde/70 bg-crema`}>
      <Image
        src={medio.url}
        alt={medio.alt}
        fill
        priority={prioridad}
        sizes="(max-width: 768px) 100vw, 45vw"
        className="object-cover"
      />
    </div>
  );
}

export function ProductGallery({ medios, nombre }: { medios: MedioGaleria[]; nombre: string }) {
  const [activo, setActivo] = useState(0);
  const pista = useRef<HTMLDivElement>(null);

  if (medios.length === 0) return null;
  const varios = medios.length > 1;
  // Demostración visual: si Shopify tiene un video y no es el primer medio,
  // un acceso directo evita que quede escondido al final del carrusel.
  const indiceVideo = medios.findIndex((m) => m.tipo === "video");

  const irAlVideo = () => {
    setActivo(indiceVideo);
    const el = pista.current;
    if (el) el.scrollTo({ left: el.clientWidth * indiceVideo, behavior: "smooth" });
  };

  const alScrollear = () => {
    const el = pista.current;
    if (!el) return;
    const indice = Math.round(el.scrollLeft / el.clientWidth);
    setActivo(Math.max(0, Math.min(indice, medios.length - 1)));
  };

  return (
    <div>
      {/* ---- Mobile: deslizar con anclaje, contador en vez de miniaturas ---- */}
      <div className="md:hidden">
        <div
          ref={pista}
          onScroll={alScrollear}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label={`Imágenes de ${nombre}`}
        >
          {medios.map((medio, i) => (
            <div key={i} className="w-full shrink-0 snap-center">
              <Medio medio={medio} prioridad={i === 0} forma={ALTO_MOVIL} />
            </div>
          ))}
        </div>

        {varios && (
          <p className="mt-3 text-center text-[13px] font-medium text-ink-tenue" aria-live="polite">
            {activo + 1} / {medios.length}
          </p>
        )}
      </div>

      {/* ---- Escritorio: miniaturas a la izquierda, medio grande a la derecha ---- */}
      <div className="hidden md:flex md:gap-3">
        {varios && (
          <ul className="flex w-[68px] shrink-0 flex-col gap-3" aria-label="Miniaturas">
            {medios.map((medio, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setActivo(i)}
                  aria-current={i === activo}
                  aria-label={`Ver medio ${i + 1} de ${medios.length}`}
                  className={`block w-full overflow-hidden rounded-lg border-2 transition-colors ${
                    i === activo ? "border-oro-500" : "border-borde hover:border-oro-300"
                  }`}
                >
                  {medio.tipo === "marcador" ? (
                    <span className="flex aspect-square w-full items-center justify-center bg-crema text-[10px] text-ink-tenue">
                      {i + 1}
                    </span>
                  ) : medio.tipo === "video" ? (
                    <span className="flex aspect-square w-full items-center justify-center bg-ink/85 text-xs font-bold text-white">
                      ▶
                    </span>
                  ) : (
                    <Image
                      src={medio.url}
                      alt=""
                      width={132}
                      height={132}
                      sizes="68px"
                      className="aspect-square w-full object-cover"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="min-w-0 flex-1">
          <div className="mx-auto max-w-[440px]">
            <Medio medio={medios[activo]} prioridad={activo === 0} forma={RATIO_ESCRITORIO} />
          </div>
        </div>
      </div>

      {indiceVideo > 0 && activo !== indiceVideo && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={irAlVideo}
            data-evento="ver_video_producto"
            className="inline-flex h-11 items-center gap-2 rounded-marca border border-borde-2 bg-white px-4 text-[13.5px] font-bold text-ink transition-colors hover:border-ink"
          >
            <span aria-hidden="true">▶</span>
            Ver el producto en uso
          </button>
        </div>
      )}
    </div>
  );
}
