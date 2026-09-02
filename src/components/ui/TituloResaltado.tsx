import { Fragment } from "react";

/**
 * Pinta con el marcador dorado las palabras clave dentro de un titular.
 *
 * El resaltado es un degradado que solo cubre el tercio inferior de la línea
 * (utilidad `marcador` en globals.css), así que subraya sin tapar el texto y
 * sin depender de una imagen ni de `background-clip`.
 *
 * Va en <em> y no en <span>: la palabra está enfatizada de verdad, no solo
 * coloreada, así que el marcado semántico coincide con lo que se ve. El
 * `not-italic` cancela la cursiva del navegador, que aquí no aporta nada.
 */
export function TituloResaltado({
  texto,
  destacadas,
}: {
  texto: string;
  destacadas: readonly string[];
}) {
  if (destacadas.length === 0) return <>{texto}</>;

  const escapadas = destacadas.map((d) => d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const patron = new RegExp(`(${escapadas.join("|")})`, "gi");
  const enMinuscula = destacadas.map((d) => d.toLowerCase());

  return (
    <>
      {texto.split(patron).map((parte, i) =>
        enMinuscula.includes(parte.toLowerCase()) ? (
          <em key={i} className="marcador not-italic">
            {parte}
          </em>
        ) : (
          <Fragment key={i}>{parte}</Fragment>
        ),
      )}
    </>
  );
}
