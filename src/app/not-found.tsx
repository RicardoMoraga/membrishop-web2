import type { Metadata } from "next";
import { CategoryCard } from "@/components/marketing/CategoryCard";
import { CtaButton } from "@/components/ui/CtaButton";
import { Section } from "@/components/ui/Section";
import { categorias } from "@/content/clusters";

export const metadata: Metadata = {
  title: "Página no encontrada | MembriShop",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Section ariaLabelledby="titulo-404">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-display text-6xl font-bold text-oro-400">404</p>
        <h1 id="titulo-404" className="mt-4 text-fluid-h2">
          Esta página no existe (o dejó de existir)
        </h1>
        <p className="mt-4 leading-relaxed text-ink-suave">
          Puede que el producto ya no esté disponible o que el enlace tenga un error. Estas son
          las tres categorías de la tienda.
        </p>
        <div className="mt-7 flex justify-center">
          <CtaButton href="/">Volver al inicio</CtaButton>
        </div>
      </div>

      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {categorias.map((categoria) => (
          <li key={categoria.slug} className="flex">
            <CategoryCard categoria={categoria} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
