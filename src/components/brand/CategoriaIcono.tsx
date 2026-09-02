type Props = { slug: string; className?: string };

/**
 * Un ícono por nicho, dibujado a mano en SVG de 48×48 con trazo de 2,6.
 *
 * Reemplazan a los emoji que había antes. Un emoji se renderiza distinto en
 * cada sistema operativo —y en Windows se ve plano y azul—, así que la
 * identidad de la página quedaba a merced del dispositivo. Estos heredan
 * `currentColor`, así que toman el color de la tarjeta.
 */
export function CategoriaIcono({ slug, className = "" }: Props) {
  const comun = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };

  if (slug === "mascotas") {
    return (
      <svg {...comun}>
        <ellipse cx="14" cy="17" rx="4" ry="5.4" />
        <ellipse cx="24.5" cy="13.5" rx="4" ry="5.8" />
        <ellipse cx="35" cy="18" rx="4" ry="5.2" />
        <path d="M24.5 24c5 0 9.5 4.2 9.5 9.2 0 4-2.9 6.3-6.4 6.3-1.7 0-2.4-.6-3.1-.6s-1.4.6-3.1.6c-3.5 0-6.4-2.3-6.4-6.3 0-5 4.5-9.2 9.5-9.2Z" />
      </svg>
    );
  }

  if (slug === "tecnologia") {
    return (
      <svg {...comun}>
        <rect x="15" y="6" width="18" height="36" rx="4" />
        <path d="M21 11.5h6" />
        <circle cx="24" cy="35.5" r="1.6" fill="currentColor" stroke="none" />
        <path d="M8 20c1.8 1.6 2.8 3.6 2.8 6s-1 4.4-2.8 6M40 20c-1.8 1.6-2.8 3.6-2.8 6s1 4.4 2.8 6" />
      </svg>
    );
  }

  return (
    <svg {...comun}>
      <path d="M10 7v10a4 4 0 0 0 8 0V7M14 7v14" />
      <path d="M14 21v20" />
      <path d="M34 7c-3.3 0-5 3.6-5 9s1.7 8 5 8" />
      <path d="M34 7v34" />
      <path d="M23 41h2M9 41h10M29 41h10" />
    </svg>
  );
}
