import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoriaTemplate } from "@/components/templates/CategoriaTemplate";
import { getCategoria } from "@/content/clusters";
import { buildMetadata } from "@/lib/seo";

const SLUG = "tecnologia";
const categoria = getCategoria(SLUG)!;

export const metadata: Metadata = buildMetadata({
  title: categoria.metaTitle,
  description: categoria.metaDescription,
  path: `/${SLUG}`,
});

export default function Page() {
  const data = getCategoria(SLUG);
  if (!data) notFound();
  return <CategoriaTemplate categoria={data} />;
}
