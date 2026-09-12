import type { Metadata } from "next";
import { CategoryCard } from "@/components/marketing/CategoryCard";
import { CtaFinal } from "@/components/marketing/CtaFinal";
import { Pasos } from "@/components/marketing/Pasos";
import { ProductCard } from "@/components/marketing/ProductCard";
import { TablaDespacho } from "@/components/marketing/TablaDespacho";
import { TrustBadges } from "@/components/producto/TrustBadges";
import { FaqList } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaButton } from "@/components/ui/CtaButton";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { TituloResaltado } from "@/components/ui/TituloResaltado";
import { IconoCheck } from "@/components/ui/icons";
import { categorias } from "@/content/clusters";
import { home } from "@/content/home";
import { faqSchema, storeSchema } from "@/lib/schema";
import { linkWhatsapp } from "@/lib/site";

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
      {/* ============ Hero ============ */}
      <section aria-labelledby="titulo-home" className="border-b border-crema bg-crema-suave">
        <div className="contenedor py-12 md:py-16">
          <div className="max-w-3xl">
            <p className="font-display mb-3 text-xs font-bold uppercase tracking-[0.14em] text-oro-700">
              {home.eyebrow}
            </p>

            <h1 id="titulo-home" className="text-fluid-h1 font-extrabold leading-[1.08]">
              <TituloResaltado texto={home.h1} destacadas={home.destacadasH1} />
            </h1>

            {/* TL;DR justo tras el H1 — tres líneas, no un bloque */}
            <ul className="mt-5 grid gap-1.5">
              {home.tldr.slice(0, 3).map((punto) => (
                <li key={punto} className="flex gap-2 text-[14px] leading-snug text-ink-suave">
                  <IconoCheck className="mt-px h-4 w-4 shrink-0 text-verde-500" />
                  <span>{punto}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 max-w-2xl text-fluid-lead leading-relaxed text-ink-suave">
              {home.intro}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <CtaButton href="#categorias" evento="hero_ver_productos">
                {home.ctaPrincipal}
              </CtaButton>
              <CtaButton
                href={linkWhatsapp("desde la home")}
                externo
                variante="secundario"
                conFlecha={false}
                evento="hero_whatsapp"
              >
                {home.ctaSecundario}
              </CtaButton>
            </div>

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {home.chips.map((chip) => (
                <li key={chip} className="text-[13px] font-medium text-ink-tenue">
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

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
