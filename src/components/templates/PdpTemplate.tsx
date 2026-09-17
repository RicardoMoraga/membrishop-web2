import Link from "next/link";
import { notFound } from "next/navigation";
import { Resenas } from "@/components/marketing/Resenas";
import { ShareButtons } from "@/components/marketing/ShareButtons";
import { CajaCompra } from "@/components/producto/CajaCompra";
import { ProductGallery, type MedioGaleria } from "@/components/producto/ProductGallery";
import { RelatedProducts } from "@/components/producto/RelatedProducts";
import { TrustBadges } from "@/components/producto/TrustBadges";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqList } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaButton } from "@/components/ui/CtaButton";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { IconoCheck } from "@/components/ui/icons";
import { getPilar, type Faq } from "@/content/clusters";
import { resenas } from "@/content/resenas";
import { breadcrumbSchema, faqSchema, productoSchema } from "@/lib/schema";
import { getProductoPorHandle } from "@/lib/shopify";
import { linkWhatsapp, site } from "@/lib/site";

/**
 * Plantilla única de ficha de producto.
 *
 * Antes cada ficha era un archivo escrito a mano de ~11 KB. Con quince SKU eso
 * no escala: ahora cada `page.tsx` es un envoltorio delgado que aporta
 * metadata y contenido editorial, igual que hicieron las tres categorías con
 * `CategoriaTemplate`.
 *
 * Reparto de responsabilidades, sin excepciones:
 *   Shopify   precio, stock, disponibilidad, variantes, SKU, medios
 *   clusters  copy, beneficios, especificaciones, FAQ, para quién no es
 */

export type ContenidoFicha = {
  categoriaSlug: string;
  slug: string;
  /** H1 centrado en el producto, distinto del meta title. */
  h1: string;
  /** Una línea bajo el H1: el problema que resuelve. */
  resumen: string;
  /** Máximo 3 puntos. Va justo tras el H1 por la regla SEO del proyecto. */
  tldr: string[];
  /**
   * Opcional: el problema real que el producto resuelve. Con él, "Qué
   * resuelve" se muestra como Problema → Solución (la solución es `intro`).
   * No inventar problemas que el producto no resuelva.
   */
  problema?: string;
  /** Primer párrafo: resuelve el intent de búsqueda. */
  intro: string;
  /** `caracteristica` (opcional) es el dato técnico del que sale el beneficio. */
  beneficios: { caracteristica?: string; titulo: string; detalle: string }[];
  incluye: string[];
  paraQuien: string[];
  noSirve: string;
  faqs: Faq[];
};

export async function PdpTemplate({ contenido }: { contenido: ContenidoFicha }) {
  const datos = getPilar(contenido.categoriaSlug, contenido.slug);
  if (!datos) notFound();
  const { categoria, pilar } = datos;

  const shopify = await getProductoPorHandle(pilar.slug);
  const producto = shopify.producto;
  const comprable = shopify.estado === "ok-disponible";

  // Medios: manda Shopify. Si la tienda todavía no tiene fotos subidas, se cae
  // a los marcadores de marca, que reservan la misma proporción para no
  // provocar salto de layout cuando lleguen las fotos reales.
  const medios: MedioGaleria[] =
    producto && producto.medios.length > 0
      ? producto.medios.map((m) =>
          m.tipo === "imagen"
            ? { tipo: "imagen" as const, url: m.url, alt: m.alt || pilar.imagen.alt }
            : { tipo: "video" as const, url: m.url, poster: m.poster, alt: m.alt || pilar.nombre },
        )
      : [pilar.imagen, ...pilar.galeria].map((imagen) => ({ tipo: "marcador" as const, imagen }));

  const migas = [
    { nombre: "Inicio", path: "/" },
    { nombre: categoria.nombre, path: `/${categoria.slug}` },
    { nombre: pilar.nombre, path: `/${categoria.slug}/${pilar.slug}` },
  ];

  const hrefWhatsapp = linkWhatsapp(pilar.nombre);
  const resenasProducto = resenas.filter((r) => r.producto === pilar.slug);

  return (
    <>
      {/* ============ Compra ============ */}
      <section aria-labelledby="titulo-producto" className="border-b border-crema bg-crema-suave">
        <div className="contenedor py-6 md:py-10">
          <Breadcrumbs items={migas} />

          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
            {/* La galería va primero también en mobile: en una ficha de producto
                la identificación visual precede a todo lo demás. */}
            <div>
              <ProductGallery medios={medios} nombre={pilar.nombre} />
            </div>

            <div className="lg:sticky lg:top-24">
              <div className="rounded-marca-lg border border-borde bg-white p-5 shadow-suave md:p-6">
                <h1 id="titulo-producto" className="font-display text-fluid-h2 font-extrabold leading-tight">
                  {contenido.h1}
                </h1>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-suave">{contenido.resumen}</p>

                <ul className="mt-4 grid gap-1.5">
                  {contenido.tldr.slice(0, 3).map((punto) => (
                    <li key={punto} className="flex gap-2 text-[13px] leading-snug text-ink-suave">
                      <IconoCheck className="mt-px h-4 w-4 shrink-0 text-verde-500" />
                      <span>{punto}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#para-quien"
                  className="mt-3 inline-flex text-[13px] font-semibold text-verde-600 underline underline-offset-2 hover:text-verde-700"
                >
                  ¿Es para ti? Revisa para quién es y cuándo no sirve
                </a>

                <div className="mt-5 border-t border-borde pt-5">
                  <CajaCompra
                    estado={shopify.estado}
                    producto={producto}
                    handle={pilar.slug}
                    nombre={pilar.nombre}
                    precioFallback={pilar.precioDesde}
                    hrefWhatsapp={hrefWhatsapp}
                    trustBadges={<TrustBadges variante="micro" />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustBadges />

      {/* ============ Para qué sirve ============ */}
      <Section ariaLabelledby="beneficios">
        <SectionHead eyebrow="Para qué sirve" titulo="Qué resuelve este producto" id="beneficios" />
        {contenido.problema ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-marca-lg border border-borde bg-white p-5">
              <p className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-cocido-500">
                El problema
              </p>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-suave">{contenido.problema}</p>
            </div>
            <div className="rounded-marca-lg border border-verde-200 bg-verde-50 p-5">
              <p className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-verde-600">
                La solución
              </p>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-suave">{contenido.intro}</p>
            </div>
          </div>
        ) : (
          <p className="mt-5 max-w-3xl text-fluid-lead leading-relaxed text-ink-suave">
            {contenido.intro}
          </p>
        )}

        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {contenido.beneficios.map((b) => (
            <li key={b.titulo} className="border-t-2 border-oro-300 pt-4">
              {b.caracteristica && (
                <p className="mb-1 text-[11.5px] font-bold uppercase tracking-[0.06em] text-oro-700">
                  {b.caracteristica}
                </p>
              )}
              <h3 className="font-display text-base font-bold text-ink">{b.titulo}</h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-suave">{b.detalle}</p>
            </li>
          ))}
        </ul>

        <div id="para-quien" className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-marca border border-verde-200 bg-verde-50 p-5">
            <h3 className="font-display text-base font-bold text-verde-600">Para quién es</h3>
            <ul className="mt-3 grid gap-2">
              {contenido.paraQuien.map((linea) => (
                <li key={linea} className="flex gap-2 text-[14.5px] leading-snug text-ink-suave">
                  <IconoCheck className="mt-0.5 h-4 w-4 shrink-0 text-verde-500" />
                  <span>{linea}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-marca border border-borde-2 bg-white p-5">
            <h3 className="font-display text-base font-bold text-cocido-500">Cuándo NO te sirve</h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-suave">{contenido.noSirve}</p>
          </div>
        </div>
      </Section>

      {/* ============ Qué incluye y especificaciones ============ */}
      <Section fondo="crema" ariaLabelledby="detalle">
        <SectionHead eyebrow="Detalle" titulo="Qué incluye y ficha técnica" id="detalle" />
        <div className="mt-7 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-display text-base font-bold text-ink">Qué incluye la caja</h3>
            <ul className="mt-3 grid gap-2">
              {contenido.incluye.map((linea) => (
                <li key={linea} className="flex gap-2 text-[14.5px] leading-snug text-ink-suave">
                  <IconoCheck className="mt-0.5 h-4 w-4 shrink-0 text-verde-500" />
                  <span>{linea}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-bold text-ink">Especificaciones</h3>
            <dl className="mt-3 divide-y divide-borde rounded-marca border border-borde bg-white">
              {pilar.especificaciones.map((e) => (
                <div key={e.etiqueta} className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-2.5">
                  <dt className="min-w-[7rem] text-[13.5px] font-semibold text-ink">{e.etiqueta}</dt>
                  <dd className="text-[13.5px] text-ink-suave">{e.valor}</dd>
                </div>
              ))}
              {producto?.sku && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-2.5">
                  <dt className="min-w-[7rem] text-[13.5px] font-semibold text-ink">SKU</dt>
                  <dd className="text-[13.5px] tabular-nums text-ink-suave">{producto.sku}</dd>
                </div>
              )}
            </dl>
            <p className="mt-3 text-[13px] leading-snug text-ink-tenue">
              Despacho y devoluciones: {site.promesas.despacho}.{" "}
              <Link href="/envios-y-devoluciones" className="font-semibold text-oro-700 underline underline-offset-2">
                Ver condiciones
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      <Resenas
        resenas={resenasProducto}
        titulo={`Opiniones sobre ${pilar.nombre.toLowerCase()}`}
        id="resenas-producto"
      />

      {/* ============ FAQ ============ */}
      <Section ariaLabelledby="faq-producto">
        <SectionHead eyebrow="Dudas" titulo={`Preguntas sobre ${pilar.nombre.toLowerCase()}`} id="faq-producto" />
        <div className="mt-7 max-w-3xl">
          <FaqList faqs={contenido.faqs} />
        </div>
      </Section>

      {/* ============ Relacionados ============ */}
      <Section fondo="crema" ariaLabelledby="relacionados">
        <RelatedProducts categoriaSlug={categoria.slug} excluirSlug={pilar.slug} />
      </Section>

      {/* ============ Cierre ============ */}
      <Section ariaLabelledby="cierre-ficha">
        <div className="rounded-marca-lg border border-borde bg-crema px-6 py-8 text-center md:px-10 md:py-10">
          <h2 id="cierre-ficha" className="text-fluid-h2 leading-tight">
            {comprable ? `¿Te sirve ${pilar.nombre.toLowerCase()}?` : "¿Te quedan dudas?"}
          </h2>
          <p className="mx-auto mt-2 max-w-xl leading-relaxed text-ink-suave">
            {comprable
              ? "Stock en Chile, boleta electrónica y 10 días de retracto. Si prefieres preguntar antes de pagar, escríbenos."
              : "Escríbenos por WhatsApp y te confirmamos disponibilidad, plazo y precio antes de que compres."}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <CtaButton href={hrefWhatsapp} externo variante="whatsapp" evento={`cierre_whatsapp_${pilar.slug}`}>
              Consultar por WhatsApp
            </CtaButton>
            <CtaButton href={`/${categoria.slug}`} variante="fantasma">
              Ver toda la categoría
            </CtaButton>
          </div>
          <div className="mt-5 flex justify-center">
            <ShareButtons path={`/${categoria.slug}/${pilar.slug}`} titulo={contenido.h1} />
          </div>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema(migas)} />
      <JsonLd data={faqSchema(contenido.faqs)} />
      <JsonLd
        data={productoSchema({
          nombre: pilar.nombre,
          descripcion: contenido.resumen,
          slug: pilar.slug,
          categoriaSlug: categoria.slug,
          precio: producto?.precio ?? pilar.precioDesde ?? 0,
          imagen: pilar.imagen.archivo,
          sku: producto?.sku ?? undefined,
          disponible: comprable,
        })}
      />
    </>
  );
}
