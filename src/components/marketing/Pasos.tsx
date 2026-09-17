type Paso = { titulo: string; detalle: string };

/**
 * Pasos numerados. El número se renderiza en el JSX (no con un contador CSS):
 * las variantes `before:*` de Tailwind pisaban el `content` del contador y el
 * círculo quedaba vacío.
 */
export function Pasos({ pasos }: { pasos: readonly Paso[] }) {
  return (
    <ol className="mt-4 grid gap-4 md:grid-cols-3">
      {pasos.map((paso, i) => (
        <li key={paso.titulo} className="rounded-marca-lg border border-borde bg-white p-4 md:p-5">
          <span
            aria-hidden="true"
            className="text-[12px] font-extrabold tabular-nums tracking-[0.04em] text-verde-600"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-1 text-[16px] leading-snug">{paso.titulo}</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-suave">{paso.detalle}</p>
        </li>
      ))}
    </ol>
  );
}
