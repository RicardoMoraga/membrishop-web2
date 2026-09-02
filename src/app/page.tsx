import Link from "next/link";
import type { Metadata } from "next";

import { CategoriaIcono } from "@/components/brand/CategoriaIcono";
import { Isotipo } from "@/components/brand/Logo";
import { CategoryCard } from "@/components/marketing/CategoryCard";
import { CtaFinal } from "@/components/marketing/CtaFinal";
import { Pasos } from "@/components/marketing/Pasos";
import { ProductCard } from "@/components/marketing/ProductCard";
import { TablaDespacho } from "@/components/marketing/TablaDespacho";
import { TrustBar } from "@/components/marketing/TrustBar";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { TldrBlock } from "@/components/seo/TldrBlock";
import { Carousel } from "@/components/ui/Carousel";
import { CtaButton } from "@/components/ui/CtaButton";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { TituloResaltado } from "@/components/ui/TituloResaltado";
import { categorias, todosLosPilares } from "@/content/clusters";
import { home } from "@/content/home";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { linkWhatsapp, site } from "@/lib/site";

/* ============================================================================
   METADATA — title y description únicos de la Home.
   El meta title es DISTINTO del H1 a propósito: el title compite en la SERP
   (marca + categorías + país), el H1 confirma la promesa dentro de la página.
   ========================================================================== */
export const metadata: Metadata = buildMetadata({
  title: home.metaTitle,
  description: home.metaDescription,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/* ===================== HERO ======================================= */}
      <section
        aria-labelledby="titulo-principal"
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(1100px 440px at 88% -10%, #fdefcb, transparent 62%), radial-gradient(720px 400px at -6% 4%, #fadf9c, transparent 58%), #fffbf3",
        }}
      >
        <div className="contenedor relative py-12 md:py-16 lg:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <p className="font-display mb-4 inline-flex items-center gap-2 rounded-full border border-borde bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-oro-700">
                <Isotipo className="h-5 w-auto" />
                {home.eyebrow}
              </p>

              {/* --- H1 único de la página --------------------------------- */}
              <h1 id="titulo-principal" className="text-fluid-h1">
                <TituloResaltado texto={home.h1} destacadas={home.destacadasH1} />
              </h1>

              {/* --- TL;DR inmediatamente después del H1 -------------------- */}
              <TldrBlock puntos={[...home.tldr]} titulo="TL;DR" className="mt-7" />

              {/* --- Primer párrafo: resuelve el intent de búsqueda --------- */}
              <p className="mt-7 text-fluid-lead leading-relaxed text-ink-suave">{home.intro}</p>

              {/* --- CTA inmediatamente después del primer párrafo ---------- */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <CtaButton href="#destacados" evento="cta_home_principal">
                  {home.ctaPrincipal}
                </CtaButton>
                <CtaButton
                  href={linkWhatsapp("desde la home")}
                  variante="secundario"
                  externo
                  conFlecha={false}
                  evento="cta_home_whatsapp"
                >
                  {home.ctaSecundario}
                </CtaButton>
              </div>
            </div>

            {/* Tarjeta lateral: mete los tres enlaces del cluster arriba del
                pliegue, que es donde más se hace clic. */}
            <aside
              aria-label="Accesos rápidos a las categorías"
              className="rounded-marca-lg border border-borde bg-white p-6 shadow-elevada lg:mt-16"
            >
              <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-oro-700">
                Ir directo a
              </p>
              <ul className="mt-4 space-y-1.5">
                {categorias.map((categoria) => {
                  const conStock = categoria.pilares.filter((p) => p.publicado).length;
                  return (
                    <li key={categoria.slug}>
                      <Link
                        href={`/${categoria.slug}`}
                        className="group flex items-center justify-between gap-3 rounded-marca px-3 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-crema-suave"
                      >
                        <span className="flex items-center gap-3">
                          <CategoriaIcono
                            slug={categoria.slug}
                            className="h-6 w-6 text-oro-600 transition-colors group-hover:text-oro-700"
                          />
                          {categoria.nombre}
                        </span>
                        <span className="text-sm font-medium text-ink-tenue">
                          {conStock || "—"}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 border-t border-borde pt-4 text-[13px] leading-relaxed text-ink-suave">
                El número indica cuántos productos tienen stock confirmado hoy.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* ===================== HUB DEL TOPIC CLUSTER ====================== */}
      <Section id="categorias" fondo="lienzo" ariaLabelledby="titulo-categorias">
        <SectionHead
          eyebrow="Explora"
          id="titulo-categorias"
          titulo="Elige tu categoría"
          sub="Cada categoría es una página propia con sus productos, sus criterios de selección y sus preguntas frecuentes. Entra a la que te interesa y decides ahí."
        />

        <div className="mt-10">
          <Carousel ariaLabel="Las tres categorías de MembriShop" slideClassName="w-[82%] sm:w-[48%] lg:w-[32%]">
            {categorias.map((categoria) => (
              <CategoryCard key={categoria.slug} categoria={categoria} />
            ))}
          </Carousel>
        </div>
      </Section>

      {/* ===================== DESTACADOS (todo el catálogo, cross-categoría) */}
      <Section id="destacados" fondo="crema" ariaLabelledby="titulo-destacados">
        <SectionHead
          eyebrow="Catálogo"
          id="titulo-destacados"
          titulo="Todo lo que tenemos con stock hoy"
          sub="Mascotas, tecnología y hogar-cocina en un solo carrusel. Para ver criterios de selección, comparativas y preguntas de cada nicho, entra a su categoría."
        />

        <div className="mt-10">
          <Carousel ariaLabel="Catálogo completo de MembriShop">
            {todosLosPilares()
              .filter(({ pilar }) => pilar.publicado)
              .map(({ categoria, pilar }) => (
                <ProductCard
                  key={`${categoria.slug}-${pilar.slug}`}
                  pilar={pilar}
                  categoriaSlug={categoria.slug}
                />
              ))}
          </Carousel>
        </div>
      </Section>

      {/* ===================== DIFERENCIADORES ============================ */}
      <Section fondo="lienzo" ariaLabelledby="titulo-diferencia">
        <SectionHead
          eyebrow="Por qué acá"
          id="titulo-diferencia"
          titulo="Qué hace distinto a MembriShop"
        />

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {home.diferenciadores.map((item) => (
            <article
              key={item.titulo}
              className="border-t-2 border-oro-300 pt-5"
            >
              <h3 className="text-fluid-h3">{item.titulo}</h3>
              <p className="mt-2.5 leading-relaxed text-ink-suave">{item.detalle}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* ===================== CÓMO COMPRAR =============================== */}
      <Section fondo="crema" ariaLabelledby="titulo-pasos">
        <SectionHead eyebrow="Tres pasos" id="titulo-pasos" titulo="Cómo comprar en MembriShop" />
        <Pasos pasos={home.pasos} />
      </Section>

      {/* ===================== PLAZOS DE DESPACHO ========================= */}
      <Section fondo="lienzo" ariaLabelledby="titulo-despacho">
        <SectionHead
          eyebrow="Logística"
          id="titulo-despacho"
          titulo="Plazos de despacho por zona"
          sub="El plazo empieza a correr cuando se confirma el pago. Recibes el número de seguimiento por correo apenas el pedido sale de bodega."
        />
        <TablaDespacho />
      </Section>

      {/* ===================== INSTAGRAM ================================== */}
      <Section fondo="lienzo" ariaLabelledby="titulo-instagram">
        <SectionHead
          eyebrow="Comunidad"
          id="titulo-instagram"
          titulo="Síguenos en Instagram"
          sub="Fotos reales de producto, unboxings y avisos de restock apenas entra algo nuevo. Las fotos de esta cuadrícula se reemplazan por el feed real en cuanto tengamos las fotos de catálogo."
          accion={
            <CtaButton href={site.redes.instagram} variante="secundario" tamano="sm" externo conFlecha={false}>
              @membrishop
            </CtaButton>
          }
        />

        <ul className="mt-10 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <a
                href={site.redes.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver MembriShop en Instagram"
                className="flex aspect-square items-center justify-center rounded-marca border border-borde/70 bg-gradient-to-br from-oro-50 via-crema to-verde-50 transition-opacity hover:opacity-80"
              >
                <Isotipo className="h-8 w-auto opacity-60" />
              </a>
            </li>
          ))}
        </ul>
      </Section>

      {/* ===================== FAQ ======================================== */}
      <Section fondo="crema" ariaLabelledby="faq-titulo">
        <div className="max-w-3xl">
          <FaqSection faqs={[...home.faqs]} />
        </div>
      </Section>

      {/* ===================== CIERRE ===================================== */}
      <CtaFinal
        titulo={home.cierre.titulo}
        texto={home.cierre.texto}
        path="/"
        tituloCompartir={home.metaTitle}
      />

      {/* ===================== DATOS ESTRUCTURADOS ======================== */}
      <JsonLd data={faqSchema([...home.faqs])} />
      <JsonLd data={breadcrumbSchema([{ nombre: "Inicio", path: "/" }])} />
    </>
  );
}
