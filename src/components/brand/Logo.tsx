import Image from "next/image";

import logoOscuro from "../../../public/images/membrishop-logo.png";
import logoClaro from "../../../public/images/membrishop-logo-claro.png";
import isotipoMembrillo from "../../../public/images/membrishop-isotipo.png";

/**
 * Logotipo oficial de MembriShop.
 *
 * Es el archivo entregado por la marca, no una reconstrucción: el membrillo con
 * su hoja, el tallo y el carro de compra en blanco, más "MembriShop" en verde
 * #155a24 y naranja #f17c15. Toda la paleta del sitio (`globals.css`) está
 * muestreada de esta misma imagen, así que el logotipo no "flota" sobre un
 * diseño de otro color: es su origen.
 *
 * · `tono="claro"` cambia el verde del texto por crema para el footer oscuro.
 *   Recolorear en CSS no es opción con un PNG, así que la variante es un
 *   segundo archivo generado a partir del mismo original.
 * · Se sirve a 862×200 px y se muestra entre 28 y 44 px de alto → nítido en
 *   pantallas 2x y 3x sin pedir un archivo por densidad.
 * · `alt=""`: el enlace que lo envuelve ya lleva el nombre accesible, y así el
 *   lector de pantalla no anuncia "MembriShop" dos veces.
 */

type Props = {
  /** Alto en clases Tailwind, p. ej. "h-8 md:h-10". */
  className?: string;
  /** Cabecera: precarga la imagen porque compite por el LCP. */
  prioridad?: boolean;
  /** "claro" para fondos oscuros (footer). */
  tono?: "oscuro" | "claro";
};

export function Logo({ className = "h-9", prioridad = false, tono = "oscuro" }: Props) {
  return (
    <Image
      src={tono === "claro" ? logoClaro : logoOscuro}
      alt=""
      priority={prioridad}
      sizes="220px"
      className={`w-auto select-none object-contain object-left ${className}`}
    />
  );
}

/**
 * Isotipo suelto: el membrillo con el carro, sin el texto.
 * Para píldoras, viñetas y marcadores de posición de imagen.
 */
export function Isotipo({ className = "" }: { className?: string }) {
  return (
    <Image
      src={isotipoMembrillo}
      alt=""
      aria-hidden="true"
      sizes="64px"
      className={`select-none object-contain ${className}`}
    />
  );
}
