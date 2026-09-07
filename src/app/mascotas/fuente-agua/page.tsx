import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ImagenMarcador } from "@/components/marketing/ImagenMarcador";
import { ComprarButton } from "@/components/marketing/ComprarButton";
import { ShareButtons } from "@/components/marketing/ShareButtons";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { TldrBlock } from "@/components/seo/TldrBlock";
import { CtaButton } from "@/components/ui/CtaButton";
import { Section } from "@/components/ui/Section";
import { getPilar, type Faq } from "@/content/clusters";
import { breadcrumbSchema, faqSchema, productoSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getProductoPorHandle } from "@/lib/shopify";
import { linkWhatsapp } from "@/lib/site";

/* ============================================================================
   Página de producto — plantilla de referencia del tercer nivel del cluster.
   URL: /mascotas/fuente-agua  (slug sin stopwords ni conectores)
   ========================================================================== */

const CATEGORIA = "mascotas";
const SLUG = "fuente-agua";

const datos = getPilar(CATEGORIA, SLUG)!;

const H1 = "Fuente de agua con filtro: por qué tu gato bebe más y se enferma menos";

const DESCRIPCION =
  "Fuente de agua de 2,4 litros con filtro de carbón activo y flujo continuo, para gatos y perros de hasta 15 kg. Stock en Chile y despacho en 24–72 h hábiles.";

const TLDR = [
  "El agua en movimiento estimula la ingesta: es el motivo por el que los veterinarios recomiendan fuentes en gatos.",
  "2,4 litros: unos 3 días para dos gatos sin rellenar.",
  "Filtro de carbón activo con recambio disponible en Chile (dura entre 3 y 4 semanas).",
  "Bomba sumergible silenciosa, por debajo de 40 dB, y desmontable para lavar.",
];

const ESPECIFICACIONES = [
  { campo: "Capacidad", valor: "2,4 litros" },
  { campo: "Material", valor: "Plástico ABS libre de BPA" },
  { campo: "Filtro", valor: "Carbón activo, recambio cada 3–4 semanas" },
  { campo: "Alimentación", valor: "USB 5 V (adaptador no incluido)" },
  { campo: "Ruido de la bomba", valor: "Menos de 40 dB" },
  { campo: "Recomendado para", valor: "Gatos y perros de hasta 15 kg" },
];

const FAQS: Faq[] = [
  {
    pregunta: "¿Cada cuánto se cambia el filtro de la fuente de agua?",
    respuesta:
      "Entre 3 y 4 semanas con uso normal de una o dos mascotas. Si el agua se ve turbia o aparece sarro antes de ese plazo, cámbialo igual. Los recambios se venden por separado y tienen stock en Chile.",
  },
  {
    pregunta: "¿Hace mucho ruido durante la noche?",
    respuesta:
      "La bomba sumergible trabaja bajo 40 dB, comparable a una conversación en voz baja. El ruido casi siempre aparece cuando el nivel de agua baja del mínimo y la bomba toma aire: rellenando la fuente se soluciona.",
  },
  {
    pregunta: "¿Sirve si tengo dos gatos?",
    respuesta:
      "Sí. Con 2,4 litros dos gatos adultos tienen agua para unos tres días. Si son tres o más, conviene rellenar día por medio.",
  },
  {
    pregunta: "¿Se puede lavar completa?",
    respuesta:
      "El estanque y la tapa se lavan a mano con agua tibia y jabón neutro. La bomba se desmonta para limpiar el rotor, que es donde se acumula el sarro. No es apta para lavavajillas.",
  },
];

export const metadata: Metadata = buildMetadata({
  // Meta title (54 caracteres) distinto del H1: bajo el corte de ~62 de Google.
  title: "Fuente de Agua para Gatos con Filtro | MembriShop",
  description: DESCRIPCION,
  path: `/${CATEGORIA}/${SLUG}`,
  tipo: "article",
});

const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default async function Page() {
  if (!datos) notFound();
  const { categoria, pilar } = datos;

  // Disponibilidad real vía Shopify — el mismo chequeo que ya usa
  // ProductCard. `pilar.stock` es solo contenido de placeholder, no la
  // fuente de verdad de si hay algo comprable de verdad.
  const productoShopify = pilar.publicado ? await getProductoPorHandle(pilar.slug) : null;
  const comprableEnShopify = Boolean(productoShopify?.disponible);

  const migas = [
    { nombre: "Inicio", path: "/" },
    { nombre: categoria.nombre, path: `/${categoria.slug}` },
    { nombre: pilar.nombre, path: `/${categoria.slug}/${pilar.slug}` },
  ];

  return (
    <>
      <section aria-labelledby="titulo-producto" className="border-b border-crema bg-crema-suave">
        <div className="contenedor py-10 md:py-14">
          <Breadcrumbs items={migas} />

          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <ImagenMarcador imagen={pilar.imagen} ratio="aspect-square" />

            <div>
              {/* H1 único, distinto del meta title */}
              <h1 id="titulo-producto" className="text-fluid-h1">
                {H1}
              </h1>

              {/* TL;DR inmediatamente después del H1 */}
              <div className="mt-6">
                <TldrBlock puntos={TLDR} titulo="Key takeaways" />
              </div>

              {/* Primer párrafo: resuelve el intent */}
              <p className="mt-6 text-fluid-lead leading-relaxed text-ink-suave">
                Los gatos beben poco por instinto y esa es la razón por la que los problemas
                urinarios son tan frecuentes. Una fuente con flujo continuo cambia esa conducta:
                el agua en movimiento les resulta más apetecible y aumentan la ingesta diaria sin
                que tengas que hacer nada. Esta fuente tiene 2,4 litros, filtro de carbón activo
                con recambio disponible en Chile y bomba silenciosa desmontable.
              </p>

              {/* CTA inmediatamente después del primer párrafo */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                {pilar.precioDesde && (
                  <span className="font-display text-3xl font-bold text-verde-600">
                    {clp.format(pilar.precioDesde)}
                  </span>
                )}
                {comprableEnShopify ? (
                  <ComprarButton handle={pilar.slug} />
                ) : (
                  <CtaButton
                    href={linkWhatsapp(`fuente de agua — ${clp.format(pilar.precioDesde ?? 0)}`)}
                    externo
                    conFlecha={false}
                    evento="cta_producto_fuente_agua"
                  >
                    Comprar por WhatsApp
                  </CtaButton>
                )}
              </div>
              <p className="mt-3 text-sm text-ink-suave">
                Precio con IVA · Despacho 24–72 h hábiles · 10 días de retracto
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section ariaLabelledby="titulo-especificaciones">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 id="titulo-especificaciones" className="text-fluid-h2">
              Qué incluye y para qué mascota sirve
            </h2>

            <h3 className="mt-8 text-fluid-h3">Especificaciones</h3>
            {/* Tabla 1 de la sección */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[28rem] border-collapse text-left text-[15px]">
                <caption className="sr-only">
                  Especificaciones técnicas de la fuente de agua con filtro
                </caption>
                <tbody className="divide-y divide-crema">
                  {ESPECIFICACIONES.map((fila) => (
                    <tr key={fila.campo}>
                      <th scope="row" className="py-3 pr-6 align-top font-semibold text-ink">
                        {fila.campo}
                      </th>
                      <td className="py-3 text-ink-suave">{fila.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-10 text-fluid-h3">Cuándo NO te sirve</h3>
            <p className="mt-3 leading-relaxed text-ink-suave">
              Si tienes un perro de más de 15 kilos, la capacidad se queda corta y vas a rellenar
              a diario. Si tu gato ya bebe bien de un bebedero normal, el beneficio es marginal:
              revisa el resto de{" "}
              <Link
                href="/mascotas"
                className="font-medium text-verde-600 underline underline-offset-2"
              >
                la categoría de mascotas
              </Link>
              .
            </p>
          </div>

          <aside className="rounded-marca-lg border border-crema bg-crema-suave p-6">
            <p className="font-display text-lg font-bold text-ink">Del mismo cluster</p>
            {/* Lista 2 de la sección */}
            <ul className="mt-4 space-y-3">
              {categoria.pilares
                .filter((p) => p.slug !== pilar.slug && p.fichaPublicada)
                .map((otro) => (
                  <li key={otro.slug}>
                    <Link
                      href={`/${categoria.slug}/${otro.slug}`}
                      className="block rounded-marca bg-white p-4 text-[15px] transition-colors hover:bg-verde-50"
                    >
                      <span className="block font-semibold text-ink">{otro.nombre}</span>
                      <span className="mt-1 block text-ink-suave">{otro.problema}</span>
                    </Link>
                  </li>
                ))}
            </ul>
            <Link
              href={`/${categoria.slug}`}
              className="mt-5 inline-block text-sm font-semibold text-verde-600 underline underline-offset-2"
            >
              Volver a {categoria.nombre}
            </Link>
          </aside>
        </div>
      </Section>

      <Section fondo="crema" ariaLabelledby="faq-titulo">
        <div className="max-w-3xl">
          <FaqSection faqs={FAQS} titulo="Preguntas sobre la fuente de agua" />
          <div className="mt-10">
            <ShareButtons path={`/${CATEGORIA}/${SLUG}`} titulo={H1} />
          </div>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema(migas)} />
      <JsonLd data={faqSchema(FAQS)} />
      <JsonLd
        data={productoSchema({
          nombre: pilar.nombre,
          descripcion: DESCRIPCION,
          slug: pilar.slug,
          categoriaSlug: categoria.slug,
          precio: pilar.precioDesde ?? 0,
          imagen: pilar.imagen.archivo,
          sku: "MS-MAS-FUENTE-24",
          disponible: comprableEnShopify,
        })}
      />
    </>
  );
}
