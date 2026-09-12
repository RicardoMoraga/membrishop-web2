import Link from "next/link";
import { CategoriaIcono } from "@/components/brand/CategoriaIcono";
import { IconoFlecha } from "@/components/ui/icons";
import type { Categoria } from "@/content/clusters";

/**
 * Puerta de entrada a un nicho. Muestra los productos que hay dentro, no
 * adjetivos: el visitante decide por lo que va a encontrar, no por el copy.
 */
export function CategoryCard({ categoria }: { categoria: Categoria }) {
  const conFicha = categoria.pilares.filter((p) => p.publicado);

  return (
    <Link
      href={`/${categoria.slug}`}
      className="group flex h-full flex-col rounded-marca-lg border border-borde bg-white p-5 shadow-suave transition-all duration-200 hover:-translate-y-1 hover:border-oro-200 hover:shadow-elevada"
    >
      <CategoriaIcono slug={categoria.slug} className="h-9 w-9" />
      <h3 className="font-display mt-3.5 text-lg font-bold text-ink">{categoria.nombre}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-suave">
        {categoria.pilares
          .slice(0, 3)
          .map((p) => p.nombre)
          .join(" · ")}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-oro-700">
        Ver {conFicha.length} {conFicha.length === 1 ? "producto" : "productos"}
        <IconoFlecha className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
