import type { Metadata } from "next";
import { FichaDinamica, metadataFicha, paramsFichas } from "@/components/templates/FichaDinamica";

/** Fichas de /hogar-cocina/<handle> generadas desde la colección `hogar-cocina` de Shopify. */
const NICHO = "hogar-cocina";

type Props = { params: Promise<{ handle: string }> };

export const dynamicParams = true;
export const revalidate = 3600;

export function generateStaticParams() {
  return paramsFichas(NICHO);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  return metadataFicha(NICHO, handle);
}

export default async function Page({ params }: Props) {
  const { handle } = await params;
  return <FichaDinamica nicho={NICHO} handle={handle} />;
}
