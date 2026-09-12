type Paso = { titulo: string; detalle: string };

/**
 * Pasos numerados.
 *
 * El número se renderiza en el JSX y no con un contador CSS. La versión
 * anterior lo generaba con `counter-increment` dentro de un `@utility`, pero
 * las variantes `before:*` de Tailwind inyectan `content: var(--tw-content)`
 * —que por defecto es una cadena vacía— y ganaban la cascada: el resultado
 * era un círculo naranja sin número, que se lee como un icono que no cargó.
 * El índice del `map` da el mismo orden garantizado sin depender de la
 * cascada de dos archivos distintos.
 */
export function Pasos({ pasos }: { pasos: readonly Paso[] }) {
  return (
    <ol className="mt-12 grid gap-x-6 gap-y-10 md:grid-cols-3">
      {pasos.map((paso, i) => (
        <li
          key={paso.titulo}
          className="relative rounded-marca-lg border border-borde bg-white p-6 pt-9 shadow-suave"
        >
          <span
            aria-hidden="true"
            className="font-display absolute -top-5 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-oro-400 text-sm font-extrabold tabular-nums text-ink shadow-suave"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-lg font-bold text-ink">{paso.titulo}</h3>
          <p className="mt-2 leading-relaxed text-ink-suave">{paso.detalle}</p>
        </li>
      ))}
    </ol>
  );
}
