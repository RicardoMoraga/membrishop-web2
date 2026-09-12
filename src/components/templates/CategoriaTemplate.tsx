import Link from "next/link";

import { CategoriaIcono } from "@/components/brand/CategoriaIcono";
import { CtaFinal } from "@/components/marketing/CtaFinal";
import { ProductCard } from "@/components/marketing/ProductCard";
import { TablaDespacho } from "@/components/marketing/TablaDespacho";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { TldrBlock } from "@/components/seo/TldrBlock";
import { CtaButton } from "@/components/ui/CtaButton";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { categoriasHermanas, type Categoria } from "@/content/clusters";
import { breadcrumbSchema, faqSchema, itemListSchema } from "@/lib/schema";
import { linkWhatsapp } from "@/lib/site";

/**
 * Plantilla de página pilar (categoría). Las tres categorías la comparten:
 * cambiar esto cambia /mascotas, /tecnologia y /hogar-cocina a la vez.
 *
 * Orden semántico fijo:
 *   breadcrumb → H1 → TL;DR → primer párrafo (intent) → CTA → H2…
 *
 * Cada sección usa como máximo 3 listas o tablas, según la regla del brief.
 */
export function CategoriaTemplate({ categoria }: { categoria: Categoria }) {
  const migas = [
    { nombre: "Inicio", path: "/" },
    { nombre: categoria.nombre, path: `/${categoria.slug}` },
  ];
  const hermanas = categoriasHermanas(categoria.slug);
  const hayStock = categoria.pilares.some((p) => p.publicado);

  return (
    <>
      {/* ===================== ENCABEZADO ================================= */}
      <section
        aria-labelledby="titulo-categoria"
        className="border-b border-borde"
        style={{
          background:
            "radial-gradient(900px 380px at 85% -12%, #fdefcb, transparent 60%), #fdf4e7",
        }}
      >
        <div className="contenedor py-10 md:py-14">
          <Breadcrumbs items={migas} />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-12">
            <div>
              <p className="font-display mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-oro-700">
                <CategoriaIcono slug={categoria.slug} className="h-5 w-5" />
                {categoria.nombre}
              </p>

              {/* --- H1 único, distinto del meta title --------------------- */}
              <h1 id="titulo-categoria" className="text-fluid-h1">
                {categoria.h1}
              </h1>

              {/* --- TL;DR inmediatamente después del H1 ------------------- */}
              <TldrBlock puntos={[...categoria.tldr]} titulo="Key takeaways" className="mt-7" />
            </div>

            <div className="lg:pt-14">
              {/* --- Primer párrafo: resuelve el intent -------------------- */}
              <p className="text-fluid-lead leading-relaxed text-ink-suave">{categoria.intent}</p>

              {/* --- CTA justo después del primer párrafo ------------------ */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <CtaButton
                  href={hayStock ? "#productos" : linkWhatsapp(`categoría ${categoria.nombre}`)}
                  externo={!hayStock}
                  evento={`cta_${categoria.slug}_principal`}
                >
                  {categoria.ctaTexto}
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PRODUCTOS ================================== */}
      <Section id="productos" fondo="lienzo" ariaLabelledby="titulo-productos">
        <SectionHead
          eyebrow={hayStock ? "Catálogo" : "En apertura"}
          id="titulo-productos"
          titulo={
            hayStock
              ? `Productos de ${categoria.nombre.toLowerCase()} disponibles`
              : `Qué vamos a publicar en ${categoria.nombre.toLowerCase()}`
          }
          sub={
            hayStock
              ? "Todos con stock confirmado en Chile. El precio incluye IVA y recibes boleta electrónica."
              : "Estas son las líneas confirmadas para esta categoría. Escríbenos si quieres que prioricemos alguna."
          }
        />

        {/* Lista 1 de la sección */}
        <div className="mt-10">
          {/* Grilla, no carrusel: con 5 productos el carrusel dejaba una tarjeta
              cortada en escritorio, sin flechas ni indicador, y eso se lee como
              un desborde de maquetación y no como una invitación a deslizar. */}
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoria.pilares.map((pilar) => (
              <li key={pilar.slug} className="h-full">
                <ProductCard pilar={pilar} categoriaSlug={categoria.slug} />
              </li>
            ))}
          </ul>
        </div>

        {/* Tabla 2 de la sección (el máximo permitido es 3).
            Responde la pregunta real de una página de categoría —"¿cuál me
            sirve?"— y es el bloque que los motores de IA citan con más
            frecuencia, porque ya viene estructurado. */}
        {categoria.comparativa && (
          <div className="mt-14">
            <h3 className="text-fluid-h3">{categoria.comparativa.titulo}</h3>
            <div className="mt-5 overflow-x-auto rounded-marca-lg border border-borde bg-white">
              <table className="w-full min-w-[44rem] border-collapse text-left text-[15px]">
                <caption className="sr-only">
                  Comparación de los productos de {categoria.nombre.toLowerCase()} por
                  destinatario, problema que resuelven y mantención que requieren
                </caption>
                <thead>
                  <tr className="border-b border-borde bg-crema-suave">
                    {categoria.comparativa.columnas.map((columna) => (
                      <th
                        key={columna}
                        scope="col"
                        className="font-display px-5 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-oro-700"
                      >
                        {columna}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-borde">
                  {categoria.comparativa.filas.map((fila) => (
                    <tr key={fila[0]}>
                      {fila.map((celda, i) =>
                        i === 0 ? (
                          <th
                            key={celda}
                            scope="row"
                            className="px-5 py-4 align-top font-semibold text-ink"
                          >
                            {celda}
                          </th>
                        ) : (
                          <td key={celda} className="px-5 py-4 align-top text-ink-suave">
                            {celda}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Section>

      {/* ===================== CRITERIOS DE SELECCIÓN ===================== */}
      <Section fondo="crema" ariaLabelledby="titulo-criterios">
        <SectionHead
          eyebrow="Criterios"
          id="titulo-criterios"
          titulo="Cómo elegimos lo que entra a esta categoría"
        />

        {/* Lista 1 de la sección */}
        <ol className="pasos-lista mt-12 grid gap-x-6 gap-y-10 md:grid-cols-3">
          {categoria.criterios.map((criterio) => (
            <li
              key={criterio.titulo}
              className="paso-num relative rounded-marca-lg border border-borde bg-white p-6 pt-9 shadow-suave before:absolute before:-top-5 before:left-6 before:flex before:h-10 before:w-10 before:items-center before:justify-center before:rounded-full before:bg-oro-400 before:font-display before:text-sm before:font-extrabold before:text-ink before:shadow-suave"
            >
              <h3 className="font-display text-lg font-bold text-ink">{criterio.titulo}</h3>
              <p className="mt-2 leading-relaxed text-ink-suave">{criterio.detalle}</p>
            </li>
          ))}
        </ol>
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

      {/* ===================== ENLACES LATERALES DEL CLUSTER ============== */}
      <Section fondo="crema" ariaLabelledby="titulo-hermanas">
        <SectionHead
          eyebrow="Sigue explorando"
          id="titulo-hermanas"
          titulo="Otras categorías de MembriShop"
        />

        {/* Lista 1 de la sección */}
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {hermanas.map((hermana) => (
            <li key={hermana.slug}>
              <Link
                href={`/${hermana.slug}`}
                className="group flex h-full items-start gap-4 rounded-marca-lg border border-borde bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-oro-200 hover:shadow-elevada"
              >
                <CategoriaIcono slug={hermana.slug} className="h-9 w-9 shrink-0 text-oro-600" />
                <span>
                  <span className="font-display block text-lg font-bold text-ink transition-colors group-hover:text-oro-700">
                    {hermana.nombre}
                  </span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-ink-suave">
                    {hermana.metaDescription}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* ===================== FAQ ======================================== */}
      <Section fondo="lienzo" ariaLabelledby="faq-titulo">
        <div className="max-w-3xl">
          <FaqSection
            faqs={[...categoria.faqs]}
            titulo={`Preguntas sobre ${categoria.nombre.toLowerCase()}`}
          />
        </div>
      </Section>

      {/* ===================== CIERRE ===================================== */}
      <CtaFinal
        titulo={`¿Dudas antes de comprar en ${categoria.nombre.toLowerCase()}?`}
        texto="Escríbenos por WhatsApp y te respondemos en horario hábil. Si el producto no te sirve, te lo decimos antes de que pagues."
        path={`/${categoria.slug}`}
        tituloCompartir={categoria.metaTitle}
      />

      {/* ===================== DATOS ESTRUCTURADOS ======================== */}
      <JsonLd data={breadcrumbSchema(migas)} />
      <JsonLd data={faqSchema([...categoria.faqs])} />
      {hayStock && <JsonLd data={itemListSchema(categoria)} />}
    </>
  );
}
