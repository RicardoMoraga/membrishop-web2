import Link from "next/link";
import { CategoriaIcono } from "@/components/brand/CategoriaIcono";
import { IconoFlecha } from "@/components/ui/icons";
import type { Categoria } from "@/content/clusters";

/**
 * Un degradado por nicho, los tres dentro de la paleta del membrillo:
 * el fruto para mascotas, la hoja para tecnología, el membrillo cocido para
 * hogar y cocina. Distinguen la categoría sin salirse de la marca.
 */
const fondos: Record<string, string> = {
  mascotas: "linear-gradient(150deg, #fdefcb, #fff8e8)",
  tecnologia: "linear-gradient(150deg, #dcefd6, #f0f8ee)",
  "hogar-cocina": "linear-gradient(150deg, #f8e9d8, #fdf6ef)",
};

const tintas: Record<string, string> = {
  mascotas: "text-oro-700",
  tecnologia: "text-verde-600",
  "hogar-cocina": "text-cocido-600",
};

export function CategoryCard({ categoria }: { categoria: Categoria }) {
  const conStock = categoria.pilares.filter((p) => p.publicado).length;

  return (
    <Link
      href={`/${categoria.slug}`}
      style={{ background: fondos[categoria.slug] }}
      className="group flex h-full flex-col rounded-marca-lg border border-borde p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-elevada md:p-7"
    >
      <span className={tintas[categoria.slug]}>
        <CategoriaIcono slug={categoria.slug} className="h-11 w-11" />
      </span>

      <h3 className="font-display mt-5 text-xl font-bold text-ink">{categoria.nombre}</h3>

      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-suave">
        {categoria.pilares
          .slice(0, 3)
          .map((p) => p.nombre)
          .join(" · ")}
      </p>

      <span
        className={`mt-6 inline-flex items-center gap-2 text-sm font-bold transition-[gap] duration-200 group-hover:gap-3 ${tintas[categoria.slug]}`}
      >
        {conStock > 0 ? `Ver los ${conStock} productos` : "Ver qué viene"}
        <IconoFlecha className="h-4 w-4" />
      </span>
    </Link>
  );
}
