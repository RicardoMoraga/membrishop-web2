import type { Metadata } from "next";
import { CtaFinal } from "@/components/marketing/CtaFinal";
import { Hero } from "@/components/marketing/Hero";
import { Pasos } from "@/components/marketing/Pasos";
import { ProductCard } from "@/components/marketing/ProductCard";
import { Resenas } from "@/components/marketing/Resenas";
import { TablaDespacho } from "@/components/marketing/TablaDespacho";
import { TrustBadges } from "@/components/producto/TrustBadges";
import { FaqList } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaButton } from "@/components/ui/CtaButton";
import { IconoCheck } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { categorias } from "@/content/clusters";
import { getCatalogo } from "@/lib/catalogo";
import { home } from "@/content/home";
import { resenas } from "@/content/resenas";
import { faqSchema, storeSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/* ============================================================================
   Home — rediseño "retail".

   Orden: anuncio y header (layout) → hero con categorías → garantías →
   productos con filtros → texto SEO → reseñas (solo si existen) → cómo
   comprar → plazos → FAQ → cierre → footer.

   Qué dejó de renderizarse aquí (el contenido sigue en `content/home.ts`):
   · Los chips y el panel lateral del hero: repetían la barra de garantías.
   · El CTA de WhatsApp del hero: WhatsApp sigue en header, botón flotante y cierre.
   · El texto del cierre: anunciaba un catálogo incompleto y remitía a un
     formulario que ahora vive solo en el footer.
   · La sección "Elige tu categoría": las categorías están en el hero.
   ========================================================================== */

/** Catálogo, precio y stock salen de Shopify: ISR de 1 h + invalidación por webhook. */
export const revalidate = 3600;

// buildMetadata agrega Open Graph y Twitter: sin ellos, compartir la Home en
// WhatsApp o redes no mostraba imagen ni descripción.
export const metadata: Metadata = buildMetadata({
  title: home.metaTitle,
  description: home.metaDescription,
  path: "/",
});


const FILTROS = [
  { valor: "todos", nombre: "Todos" },
  ...categorias.map((c) => ({ valor: c.slug, nombre: c.nombre })),
];

/**
 * Filtro sin JavaScript: radios + `:has()`. Con el radio de una categoría
 * marcado, se ocultan las tarjetas de las demás. Un navegador sin `:has()`
 * simplemente muestra todo.
 */
const cssFiltro = categorias
  .map(
    (c) =>
      `#productos:has(input[value="${c.slug}"]:checked) [data-categoria]:not([data-categoria="${c.slug}"]){display:none}`,
  )
  .join("");

export default async function Page() {
  // Productos desde las colecciones de Shopify (respaldo: clusters.ts).
  const { categorias: catalogo } = await getCatalogo();

  /** Destacados: los pilares publicados, en grilla. Nada se recorta. */
  const destacados = catalogo.flatMap((categoria) =>
    categoria.pilares
      .filter((pilar) => pilar.publicado)
      .slice(0, 2)
      .map((pilar) => ({ pilar, categoria })),
  );

  return (
    <>
      <Hero
        eyebrow={home.eyebrow}
        h1={home.h1}
        subtitulo={home.tldr[0]}
        ctaPrincipal={home.ctaPrincipal}
        hrefCtaPrincipal="#productos"
        categorias={catalogo}
      />

      <TrustBadges />

      {/* ============ Productos ============ */}
      <section id="productos" aria-labelledby="titulo-destacados" className="contenedor pt-7 md:pt-10">
        <style>{cssFiltro}</style>
        <SectionHead
          titulo="Productos destacados"
          id="titulo-destacados"
          sub="Precio y disponibilidad se leen en directo desde la tienda."
          accion={
            <fieldset className="min-w-0">
              <legend className="sr-only">Filtrar productos por categoría</legend>
              <div className="flex flex-wrap gap-2">
                {FILTROS.map((filtro) => (
                  <label key={filtro.valor} className="cursor-pointer">
                    <input
                      type="radio"
                      name="filtro-categoria"
                      value={filtro.valor}
                      defaultChecked={filtro.valor === "todos"}
                      className="peer sr-only"
                    />
                    <span className="inline-flex h-11 items-center rounded-full bg-crema px-4 text-[13px] font-semibold text-ink transition-colors hover:bg-borde peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-oro-500 peer-focus-visible:ring-offset-2">
                      {filtro.nombre}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          }
        />
        <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {destacados.map(({ pilar, categoria }) => (
            <li key={pilar.slug} data-categoria={categoria.slug} className="h-full">
              <ProductCard
                pilar={pilar}
                categoriaSlug={categoria.slug}
                categoriaNombre={categoria.nombre}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* ============ Texto de búsqueda (antes en el hero) ============ */}
      <section aria-label="Sobre MembriShop" className="contenedor pt-7 md:pt-10">
        <div className="rounded-marca-lg border border-borde bg-white p-5 md:p-6">
          <p className="max-w-3xl text-[14.5px] leading-relaxed text-ink-suave">{home.intro}</p>
          <ul className="mt-3 grid gap-1.5">
            {home.tldr.slice(0, 3).map((punto) => (
              <li key={punto} className="flex gap-2 text-[13.5px] leading-snug text-ink-suave">
                <IconoCheck className="mt-px h-4 w-4 shrink-0 text-verde-600" />
                <span>{punto}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Resenas resenas={resenas} />

      {/* ============ Cómo comprar ============ */}
      <Section ariaLabelledby="titulo-pasos" fondo="crema" className="mt-7 md:mt-10">
        <SectionHead titulo="Cómo comprar en MembriShop" id="titulo-pasos" />
        <Pasos pasos={home.pasos} />
      </Section>

      {/* ============ Plazos de despacho ============ */}
      <Section ariaLabelledby="titulo-despacho" className="pb-0 md:pb-0">
        <SectionHead
          titulo="Zona y plazo de despacho"
          id="titulo-despacho"
          sub="Por ahora despachamos solo dentro de la Región Metropolitana. El plazo empieza a correr cuando se confirma el pago."
          accion={
            <CtaButton href="/envios-y-devoluciones" variante="fantasma" tamano="sm">
              Envíos y devoluciones
            </CtaButton>
          }
        />
        <TablaDespacho />
      </Section>

      {/* ============ FAQ ============ */}
      <Section ariaLabelledby="titulo-faq" fondo="crema" className="mt-7 md:mt-10">
        <SectionHead titulo="Preguntas frecuentes" id="titulo-faq" />
        <div className="mt-4 max-w-3xl">
          <FaqList faqs={home.faqs.slice(0, 5)} />
        </div>
      </Section>

      {/* ============ Cierre ============ */}
      <CtaFinal titulo={home.cierre.titulo} path="/" tituloCompartir={home.h1} />

      <JsonLd data={storeSchema()} />
      <JsonLd data={faqSchema(home.faqs.slice(0, 5))} />
    </>
  );
}
