import { ProductCard } from "@/components/marketing/ProductCard";
import { SectionHead } from "@/components/ui/SectionHead";
import { getCategoriaCatalogo } from "@/lib/catalogo";

/**
 * Productos del mismo nicho, excluyendo el actual.
 *
 * Cumple dos funciones a la vez: recupera la sesión cuando este producto no
 * era el correcto, y densifica el enlazado interno del cluster sin crear
 * páginas nuevas.
 */
export async function RelatedProducts({
  categoriaSlug,
  excluirSlug,
  limite = 3,
}: {
  categoriaSlug: string;
  excluirSlug: string;
  limite?: number;
}) {
  const categoria = await getCategoriaCatalogo(categoriaSlug);
  if (!categoria) return null;

  const relacionados = categoria.pilares.filter((p) => p.slug !== excluirSlug).slice(0, limite);
  if (relacionados.length === 0) return null;

  return (
    <div>
      <SectionHead
        eyebrow={categoria.nombre}
        titulo="También en esta categoría"
        id="relacionados"
      />
      <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relacionados.map((pilar) => (
          <li key={pilar.slug} className="h-full">
            <ProductCard pilar={pilar} categoriaSlug={categoria.slug} />
          </li>
        ))}
      </ul>
    </div>
  );
}
