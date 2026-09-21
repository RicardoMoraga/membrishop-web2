import Link from "next/link";
import { CategoriaIcono } from "@/components/brand/CategoriaIcono";
import { IconoFlecha } from "@/components/ui/icons";
import type { Categoria } from "@/content/clusters";

/**
 * Acento de color por nicho: distingue las tres tarjetas de un vistazo sin
 * salir de la paleta de marca (dorado y verde), y sin depender de fotografía.
 */
const ACENTO: Record<string, { icono: string; borde: string }> = {
  mascotas: { icono: "bg-verde-50 text-verde-600", borde: "hover:border-verde-300" },
  tecnologia: { icono: "bg-oro-100 text-oro-700", borde: "hover:border-oro-300" },
  "hogar-cocina": { icono: "bg-cocido-100 text-cocido-500", borde: "hover:border-cocido-300" },
};

/**
 * Puerta de entrada a un nicho. Muestra los productos que hay dentro, no
 * adjetivos: el visitante decide por lo que va a encontrar, no por el copy.
 */
export function CategoryCard({ categoria }: { categoria: Categoria }) {
  const conFicha = categoria.pilares.filter((p) => p.publicado);
  const acento = ACENTO[categoria.slug] ?? ACENTO.mascotas;

  return (
    <Link
      href={`/${categoria.slug}`}
      className={`group flex h-full flex-col rounded-marca-lg border border-borde bg-white p-5 shadow-suave transition-all duration-200 hover:-translate-y-1 hover:shadow-elevada ${acento.borde}`}
    >
      <span
        className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105 ${acento.icono}`}
      >
        <CategoriaIcono slug={categoria.slug} className="h-8 w-8" />
      </span>
      <h3 className="font-display mt-4 text-lg font-bold text-ink">{categoria.nombre}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-suave">
        {categoria.pilares
          .slice(0, 3)
          .map((p) => p.nombre)
          .join(" · ")}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 border-t border-borde pt-4 text-sm font-semibold text-oro-700">
        {conFicha.length === 0
          ? "Próximamente"
          : `Ver ${conFicha.length} ${conFicha.length === 1 ? "producto" : "productos"}`}
        <IconoFlecha className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
