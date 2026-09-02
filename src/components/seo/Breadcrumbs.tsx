import Link from "next/link";

export type Miga = { nombre: string; path: string };

/**
 * Migas de pan visibles. El JSON-LD BreadcrumbList se emite aparte, desde la
 * página, para que el marcado y lo visible digan exactamente lo mismo.
 */
export function Breadcrumbs({ items }: { items: Miga[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-ink-suave">
        {items.map((item, i) => {
          const ultimo = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {ultimo ? (
                <span aria-current="page" className="font-medium text-ink">
                  {item.nombre}
                </span>
              ) : (
                <>
                  <Link href={item.path} className="transition-colors hover:text-verde-600 hover:underline">
                    {item.nombre}
                  </Link>
                  <span aria-hidden="true" className="text-verde-300">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
