type Paso = { titulo: string; detalle: string };

/**
 * Tres pasos numerados. El número lo genera un contador CSS
 * (`counter-increment` + `::before`), no una cadena en el JSX: así el orden lo
 * define el DOM y no hay forma de que quede "01, 02, 02" al reordenar.
 */
export function Pasos({ pasos }: { pasos: readonly Paso[] }) {
  return (
    <ol className="pasos-lista mt-12 grid gap-x-6 gap-y-10 md:grid-cols-3">
      {pasos.map((paso) => (
        <li
          key={paso.titulo}
          className="paso-num relative rounded-marca-lg border border-borde bg-white p-6 pt-9 shadow-suave before:absolute before:-top-5 before:left-6 before:flex before:h-10 before:w-10 before:items-center before:justify-center before:rounded-full before:bg-oro-400 before:font-display before:text-sm before:font-extrabold before:text-ink before:shadow-suave"
        >
          <h3 className="font-display text-lg font-bold text-ink">{paso.titulo}</h3>
          <p className="mt-2 leading-relaxed text-ink-suave">{paso.detalle}</p>
        </li>
      ))}
    </ol>
  );
}
