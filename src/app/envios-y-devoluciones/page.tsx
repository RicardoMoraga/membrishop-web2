import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { TldrBlock } from "@/components/seo/TldrBlock";
import { Section } from "@/components/ui/Section";
import type { Faq } from "@/content/clusters";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { linkWhatsapp, site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Envíos y Devoluciones | MembriShop",
  description:
    "Plazos de despacho por zona, costo de envío, cómo hacer un cambio o devolución y el derecho a retracto de 10 días en compras de MembriShop.",
  path: "/envios-y-devoluciones",
});

const TLDR = [
  "Por ahora despachamos solo dentro de la Región Metropolitana: 24–72 h hábiles, y hasta 5 días hábiles en sectores alejados o de difícil acceso.",
  `${site.promesas.retracto}: el producto debe volver en las mismas condiciones en que lo recibiste.`,
  "Si ejerces el retracto una vez despachado el pedido, el costo del envío de vuelta lo pagas tú; si falla o llega mal, lo pagamos nosotros.",
  "Para cualquier cambio, devolución o garantía, escríbenos primero por WhatsApp: ahí te damos las instrucciones de envío.",
];

const FAQS: Faq[] = [
  {
    pregunta: "¿Cuánto cuesta el despacho?",
    respuesta:
      "El costo de envío se calcula en el checkout según tu dirección y se muestra antes de pagar. No cobramos costos ocultos después de la compra.",
  },
  {
    pregunta: "¿Qué hago si mi producto llega dañado?",
    respuesta:
      "Escríbenos apenas lo recibas, por WhatsApp o al correo, con fotos del producto y del empaque, para coordinar cambio, reparación o devolución del dinero según corresponda. Tu garantía legal de 6 meses no depende de ese aviso. Si llegó dañado, incompleto o distinto al pedido, el costo del envío lo cubrimos nosotros.",
  },
  {
    pregunta: "¿Puedo cambiar un producto por otro del catálogo?",
    respuesta:
      "Es un beneficio voluntario de MembriShop, sujeto a stock: puedes solicitarlo dentro de los 10 días desde la recepción, con el producto en las mismas condiciones en que lo recibiste y con su empaque original. No reemplaza tu derecho a retracto ni tu garantía legal. Si hay diferencia de precio, se ajusta al momento del cambio. Escríbenos con tu número de pedido.",
  },
  {
    pregunta: "¿Quién paga el envío de una devolución?",
    respuesta:
      "Si ejerces el retracto antes de que el pedido sea despachado, no tiene ningún costo y te reembolsamos el total. Si lo ejerces una vez despachado el pedido, el costo del envío de vuelta lo pagas tú. Si el problema es nuestro — producto dañado, incompleto, distinto al pedido o con falla cubierta por la garantía legal —, lo cubrimos nosotros.",
  },
];

export default function EnviosYDevolucionesPage() {
  const migas = [
    { nombre: "Inicio", path: "/" },
    { nombre: "Envíos y Devoluciones", path: "/envios-y-devoluciones" },
  ];

  return (
    <>
      <section aria-labelledby="titulo-envios" className="border-b border-crema bg-crema-suave">
        <div className="contenedor py-10 md:py-14">
          <Breadcrumbs items={migas} />

          <div className="mt-6 max-w-3xl">
            <h1 id="titulo-envios" className="text-fluid-h1">
              Cuándo llega tu pedido y cómo devolverlo si no te sirve
            </h1>

            <div className="mt-6">
              <TldrBlock puntos={TLDR} titulo="Key takeaways" />
            </div>

            <p className="mt-6 text-fluid-lead leading-relaxed text-ink-suave">
              Todo el catálogo de {site.nombre} tiene stock físico en Chile, así que los plazos
              de despacho se cuentan en días hábiles, no en semanas de importación. Por ahora
              despachamos solo dentro de la Región Metropolitana. Si el
              producto no te sirve, tienes 10 días para devolverlo o cambiarlo.
            </p>

            <div className="mt-7">
              <a
                href={linkWhatsapp("quiero hacer un cambio o devolución")}
                target="_blank"
                rel="noopener noreferrer"
                data-evento="cta_envios_whatsapp"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-ink transition-[filter] hover:brightness-95"
              >
                Iniciar un cambio o devolución por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <Section ariaLabelledby="plazos-titulo">
        <h2 id="plazos-titulo" className="text-fluid-h3 text-ink">
          Zona y plazo de despacho
        </h2>
        <div className="mt-6 overflow-x-auto rounded-marca-lg border border-crema">
          <table className="w-full min-w-[560px] border-collapse text-left text-[14px]">
            <thead>
              <tr className="bg-crema-suave text-ink">
                <th className="px-4 py-3 font-semibold">Zona</th>
                <th className="px-4 py-3 font-semibold">Plazo estimado</th>
                <th className="px-4 py-3 font-semibold">Nota</th>
              </tr>
            </thead>
            <tbody>
              {site.zonasDespacho.map((zona) => (
                <tr key={zona.zona} className="border-t border-crema">
                  <td className="px-4 py-3 font-medium text-ink">{zona.zona}</td>
                  <td className="px-4 py-3 text-ink-suave">{zona.plazo}</td>
                  <td className="px-4 py-3 text-ink-suave">{zona.nota}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[13px] text-ink-tenue">
          Plazos estimados por el courier, en días hábiles, desde la confirmación del pago. Pueden
          extenderse por caso fortuito o fuerza mayor (clima, cortes de ruta, alta demanda del
          courier); en ese caso te avisamos.
        </p>
      </Section>

      <Section fondo="crema" ariaLabelledby="devoluciones-titulo">
        <div className="mx-auto max-w-3xl space-y-8 text-[15px] leading-relaxed text-ink-suave">
          <div>
            <h2 id="devoluciones-titulo" className="text-fluid-h3 text-ink">
              Derecho a retracto (10 días)
            </h2>
            <p className="mt-3">
              Según la Ley N°19.496 del Consumidor, tienes 10 días corridos desde que recibes el
              producto para arrepentirte de la compra, sin necesidad de justificar el motivo. El
              producto debe devolverse en las mismas condiciones en que lo recibiste: sin deterioro
              imputable a ti y con sus accesorios y, cuando corresponda, su empaque original.
              Abrirlo y probarlo para decidir si te sirve no te quita el derecho. Si ejerces el
              retracto una vez despachado el pedido, el costo del envío de vuelta es de tu cargo;
              si lo ejerces antes del despacho, no tiene costo. Algunos productos pueden estar
              legalmente excluidos del retracto (por ejemplo, los de higiene abiertos); en ese
              caso lo informamos antes de que compres.
            </p>
          </div>

          <div>
            <h2 className="text-fluid-h3 text-ink">Cómo hacer un cambio o devolución</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>Escríbenos por WhatsApp (o a {site.contacto.email}) con tu número de pedido, antes de enviar nada.</li>
              <li>Te confirmamos si aplica cambio, devolución con reembolso o reparación en garantía.</li>
              <li>Si el producto debe volver a nosotros, por WhatsApp te damos las instrucciones de envío y la dirección de destino.</li>
              <li>Una vez que revisamos el producto, procesamos el reembolso o el envío del reemplazo.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-fluid-h3 text-ink">Garantía legal (6 meses)</h2>
            <p className="mt-3">
              Además del retracto de 10 días, todo el catálogo tiene garantía legal de 6 meses
              por fallas de fabricación, gestionada directamente con nosotros — no necesitas
              contactar a un proveedor extranjero.
            </p>
          </div>
        </div>
      </Section>

      <Section ariaLabelledby="faq-titulo">
        <div className="max-w-3xl">
          <FaqSection faqs={FAQS} titulo="Preguntas sobre envíos y devoluciones" />
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema(migas)} />
      <JsonLd data={faqSchema(FAQS)} />
    </>
  );
}
