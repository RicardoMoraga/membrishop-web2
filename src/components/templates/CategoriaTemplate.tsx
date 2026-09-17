import Link from "next/link";

import { CategoriaIcono } from "@/components/brand/CategoriaIcono";
import { CtaFinal } from "@/components/marketing/CtaFinal";
import { ProductCard } from "@/components/marketing/ProductCard";
import { TablaDespacho } from "@/components/marketing/TablaDespacho";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { TldrBlock } from "@/components/seo/TldrBlock";
import { IconoFlecha } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { categoriasHermanas, type Categoria } from "@/content/clusters";
import { breadcrumbSchema, faqSchema, itemListSchema } from "@/lib/schema";

/**
 * Plantilla de página pilar (categoría). Las tres categorías la comparten:
 * cambiar esto cambia /mascotas, /tecnologia y /hogar-cocina a la vez.
 *
 * Orden semántico fijo:
 *   breadcrumb → H1 → productos → otras categorías → intent + TL;DR → H2…
 *
 * Cada sección usa como máximo 3 listas o tablas, según la regla del brief.
 */
export function CategoriaTemplate({ categoria }: { categoria: Categoria }) {
  const migas = [
    { nombre: "Inicio", path: "/" },
    { nombre: categoria.nombre, path: `/${categoria.slug}` },
  ];
  const hermanas = categoriasHermanas(categoria.slug);
  const publicados = categoria.pilares.filter((p) => p.publicado).length;
  const hayStock = publicados > 0;

  return (
    <>
      {/* ===================== ENCABEZADO + PRODUCTOS =====================
          Al entrar a una categoría lo primero son las fotos de producto. El
          encabezado queda en una línea (migas + H1); el TL;DR, el párrafo de
          intención y el CTA bajan a "Sobre la categoría", bajo las hermanas. */}
      <section id="productos" aria-labelledby="titulo-categoria" className="bg-lienzo pb-7 pt-4 md:pb-10 md:pt-5">
        <div className="contenedor">
          <Breadcrumbs items={migas} />

          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            {/* --- H1 único, distinto del meta title --------------------- */}
            <h1 id="titulo-categoria" className="text-fluid-h2 leading-tight">
              {categoria.h1}
            </h1>
            <p className="text-[13px] text-ink-tenue">
              {hayStock
                ? `${publicados} ${publicados === 1 ? "producto" : "productos"} · precio con IVA y boleta electrónica`
                : "Categoría en apertura"}
            </p>
          </div>

          <h2 className="sr-only">
            {hayStock
              ? `Productos de ${categoria.nombre.toLowerCase()} disponibles`
              : `Qué vamos a publicar en ${categoria.nombre.toLowerCase()}`}
          </h2>

          {/* Grilla, no carrusel: con 5 productos el carrusel dejaba una tarjeta
              cortada en escritorio, sin flechas ni indicador. */}
          <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categoria.pilares.map((pilar) => (
              <li key={pilar.slug} className="h-full">
                <ProductCard pilar={pilar} categoriaSlug={categoria.slug} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===================== ENLACES LATERALES DEL CLUSTER ==============
          Justo bajo la grilla: quien no encontró lo que buscaba salta a otra
          categoría sin recorrer el texto. */}
      <section aria-labelledby="titulo-hermanas" className="contenedor">
        <h2 id="titulo-hermanas" className="text-[17px] font-extrabold leading-tight">
          Otras categorías de MembriShop
        </h2>
        <ul className="mt-3 grid gap-4 md:grid-cols-2">
          {hermanas.map((hermana) => (
            <li key={hermana.slug}>
              <Link
                href={`/${hermana.slug}`}
                className="group flex h-full items-start gap-3 rounded-marca-lg border border-borde bg-white p-4 transition-colors hover:border-borde-2"
              >
                <CategoriaIcono slug={hermana.slug} className="h-8 w-8 shrink-0 text-oro-600" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-ink">{hermana.nombre}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink-suave">
                    {hermana.metaDescription}
                  </span>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[13px] font-bold text-verde-600">
                    Ver {hermana.nombre.toLowerCase()}
                    <IconoFlecha className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ===================== SOBRE LA CATEGORÍA (texto de búsqueda) ===== */}
      <Section ariaLabelledby="titulo-sobre" className="pb-0 md:pb-0">
        <div className="rounded-marca-lg border border-borde bg-white p-5 md:p-6">
          <h2 id="titulo-sobre" className="text-[17px] font-extrabold leading-tight">
            Sobre {categoria.nombre.toLowerCase()} en MembriShop
          </h2>
          {/* --- Primer párrafo: resuelve el intent -------------------- */}
          <p className="mt-2 max-w-3xl text-[14.5px] leading-relaxed text-ink-suave">
            {categoria.intent}
          </p>
          <TldrBlock puntos={[...categoria.tldr]} titulo="Key takeaways" className="mt-4" />
        </div>

        {/* Tabla 2 de la sección (el máximo permitido es 3).
            Responde la pregunta real de una página de categoría —"¿cuál me
            sirve?"— y es el bloque que los motores de IA citan con más
            frecuencia, porque ya viene estructurado. */}
        {categoria.comparativa && (
          <div className="mt-6">
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
          titulo="Zona y plazo de despacho"
          sub="Por ahora despachamos solo dentro de la Región Metropolitana. El plazo empieza a correr cuando se confirma el pago y recibes el número de seguimiento por correo."
        />
        <TablaDespacho />
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
