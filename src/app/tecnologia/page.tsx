import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoriaTemplate } from "@/components/templates/CategoriaTemplate";
import { getCategoria } from "@/content/clusters";
import { getCategoriaCatalogo } from "@/lib/catalogo";
import { buildMetadata } from "@/lib/seo";

const SLUG = "tecnologia";
const categoria = getCategoria(SLUG)!;

/** Catálogo, precio y stock salen de Shopify: ISR de 1 h + invalidación por webhook. */
export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: categoria.metaTitle,
  description: categoria.metaDescription,
  path: `/${SLUG}`,
});

export default async function Page() {
  // Productos desde la colección de Shopify; SEO y copy desde clusters.ts.
  const data = (await getCategoriaCatalogo(SLUG)) ?? getCategoria(SLUG);
  if (!data) notFound();
  return <CategoriaTemplate categoria={data} />;
}
