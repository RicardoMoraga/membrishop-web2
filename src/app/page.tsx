import type { Metadata } from "next";
import { CategoryCard } from "@/components/marketing/CategoryCard";
import { CtaFinal } from "@/components/marketing/CtaFinal";
import { Hero } from "@/components/marketing/Hero";
import { Pasos } from "@/components/marketing/Pasos";
import { ProductCard } from "@/components/marketing/ProductCard";
import { TablaDespacho } from "@/components/marketing/TablaDespacho";
import { TrustBadges } from "@/components/producto/TrustBadges";
import { FaqList } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaButton } from "@/components/ui/CtaButton";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { categorias } from "@/content/clusters";
import { home } from "@/content/home";
import { faqSchema, storeSchema } from "@/lib/schema";

/* ============================================================================
   Home.

   Orden: anuncio y header (layout) → hero → categorías → destacados →
   confianza → cómo comprar → descubrimiento → FAQ → cierre → footer.

   Qué se quitó respecto de la versión anterior, y por qué:
   · La grilla de Instagram con seis marcadores vacíos. Una tienda sin fotos
     publicando huecos comunica inactividad; era peor que no tener la sección.
   · El bloque "Qué hace distinto a MembriShop": repetía en prosa lo que la
     franja de confianza y "Cómo comprar" ya dicen en forma escaneable.
   · El carrusel recortado en escritorio. Sin flechas ni indicador se leía
     como un desborde de maquetación; ahora es una grilla que no corta nada.
   · El TL;DR de cuatro viñetas largas sobre el pliegue. Queda en tres líneas
     compactas: la regla SEO del proyecto se cumple y el CTA sube.
   ========================================================================== */

export const metadata: Metadata = {
  title: home.metaTitle,
  description: home.metaDescription,
  alternates: { canonical: "/" },
};

/** Destacados: los pilares publicados, en grilla. Nada se recorta. */
const destacados = categorias.flatMap((categoria) =>
  categoria.pilares
    .filter((pilar) => pilar.publicado)
    .slice(0, 2)
    .map((pilar) => ({ pilar, categoriaSlug: categoria.slug })),
);

export default function Page() {
  return (
    <>
      <Hero
        eyebrow={home.eyebrow}
        h1={home.h1}
        destacadasH1={home.destacadasH1}
        tldr={home.tldr}
        intro={home.intro}
        ctaPrincipal={home.ctaPrincipal}
        ctaSecundario={home.ctaSecundario}
        chips={home.chips}
      />

      <TrustBadges />

      {/* ============ Categorías ============ */}
      <Section id="categorias" ariaLabelledby="titulo-categorias">
        <SectionHead
          eyebrow="Explora"
          titulo="Elige tu categoría"
          id="titulo-categorias"
          sub="Catálogo corto y curado: cada producto entra porque resuelve un problema concreto."
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((categoria) => (
            <li key={categoria.slug} className="h-full">
              <CategoryCard categoria={categoria} />
            </li>
          ))}
        </ul>
      </Section>

      {/* ============ Destacados ============ */}
      <Section fondo="crema" ariaLabelledby="titulo-destacados">
        <SectionHead
          eyebrow="Catálogo"
          titulo="Productos destacados"
          id="titulo-destacados"
          sub="Precio y disponibilidad se leen en directo desde la tienda."
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destacados.map(({ pilar, categoriaSlug }) => (
            <li key={pilar.slug} className="h-full">
              <ProductCard pilar={pilar} categoriaSlug={categoriaSlug} />
            </li>
          ))}
        </ul>
      </Section>

      {/* ============ Cómo comprar ============ */}
      <Section ariaLabelledby="titulo-pasos">
        <SectionHead eyebrow="Tres pasos" titulo="Cómo comprar en MembriShop" id="titulo-pasos" />
        <Pasos pasos={home.pasos} />
      </Section>

      {/* ============ Descubrimiento: plazos reales ============ */}
      <Section fondo="crema" ariaLabelledby="titulo-despacho">
        <SectionHead
          eyebrow="Logística"
          titulo="Plazos de despacho por zona"
          id="titulo-despacho"
          sub="El plazo empieza a correr cuando se confirma el pago."
          accion={
            <CtaButton href="/envios-y-devoluciones" variante="fantasma" tamano="sm">
              Envíos y devoluciones
            </CtaButton>
          }
        />
        <div className="mt-7">
          <TablaDespacho />
        </div>
      </Section>

      {/* ============ FAQ breve ============ */}
      <Section ariaLabelledby="titulo-faq">
        <SectionHead eyebrow="Dudas" titulo="Preguntas frecuentes" id="titulo-faq" />
        <div className="mt-7 max-w-3xl">
          <FaqList faqs={home.faqs.slice(0, 5)} />
        </div>
      </Section>

      {/* ============ Cierre ============ */}
      <CtaFinal
        titulo={home.cierre.titulo}
        texto={home.cierre.texto}
        path="/"
        tituloCompartir={home.h1}
      />

      <JsonLd data={storeSchema()} />
      <JsonLd data={faqSchema(home.faqs.slice(0, 5))} />
    </>
  );
}
