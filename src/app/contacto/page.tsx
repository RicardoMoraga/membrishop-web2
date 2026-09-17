import type { Metadata } from "next";

import { LeadForm } from "@/components/marketing/LeadForm";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { TldrBlock } from "@/components/seo/TldrBlock";
import { CtaButton } from "@/components/ui/CtaButton";
import { Section } from "@/components/ui/Section";
import type { Faq } from "@/content/clusters";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { linkWhatsapp, site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  // 52 caracteres, distinto del H1.
  title: "Contacto MembriShop | Escríbenos y te respondemos",
  description:
    "Escribe a MembriShop por formulario o WhatsApp: consultas de productos, estado de pedidos, cambios y devoluciones. Respondemos en horario hábil desde Chile.",
  path: "/contacto",
});

const TLDR = [
  "Por WhatsApp respondemos más rápido; el formulario queda registrado y no se pierde.",
  "Horario de respuesta: lunes a viernes, 09:00 a 19:00 (hora de Chile continental).",
  "Para cambios y devoluciones, incluye el número de pedido en el mensaje.",
  "No tenemos local: todo el contacto es online.",
];

const FAQS: Faq[] = [
  {
    pregunta: "¿En cuánto tiempo responden un mensaje del formulario?",
    respuesta:
      "Dentro del mismo día hábil si escribes antes de las 17:00. Los mensajes de fin de semana se responden el lunes por la mañana.",
  },
  {
    pregunta: "¿Cómo consulto por el estado de mi pedido?",
    respuesta:
      "Incluye el número de pedido y el correo con el que compraste. Con esos dos datos podemos revisar el seguimiento del courier sin pedirte nada más.",
  },
  {
    pregunta: "¿Puedo pasar a retirar un producto?",
    respuesta:
      "No. MembriShop es una tienda 100 % online y no tiene local con atención de público. Todos los pedidos se despachan por courier dentro de la Región Metropolitana.",
  },
];

export default function ContactoPage() {
  const migas = [
    { nombre: "Inicio", path: "/" },
    { nombre: "Contacto", path: "/contacto" },
  ];

  return (
    <>
      <section aria-labelledby="titulo-contacto" className="border-b border-crema bg-crema-suave">
        <div className="contenedor py-10 md:py-14">
          <Breadcrumbs items={migas} />

          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
            <div>
              {/* H1 único, distinto del meta title */}
              <h1 id="titulo-contacto" className="text-fluid-h1">
                Habla con una persona, no con un formulario que nadie lee
              </h1>

              {/* TL;DR inmediatamente después del H1 */}
              <div className="mt-6">
                <TldrBlock puntos={TLDR} titulo="Key takeaways" />
              </div>

              {/* Primer párrafo: resuelve el intent */}
              <p className="mt-6 text-fluid-lead leading-relaxed text-ink-suave">
                Si necesitas consultar por un producto, saber dónde va tu pedido o coordinar un
                cambio, escríbenos y te responde alguien del equipo en horario hábil. WhatsApp es
                el canal más rápido; el formulario sirve cuando prefieres dejarlo por escrito y
                que quede registrado.
              </p>

              {/* CTA inmediatamente después del primer párrafo */}
              <div className="mt-7">
                <CtaButton
                  href={linkWhatsapp("desde la página de contacto")}
                  variante="whatsapp"
                  externo
                  conFlecha={false}
                  evento="cta_contacto_whatsapp"
                >
                  Escribir por WhatsApp
                </CtaButton>
              </div>

              <dl className="mt-8 space-y-3 text-[15px]">
                <div className="flex gap-2">
                  <dt className="font-semibold text-ink">Correo:</dt>
                  <dd>
                    <a
                      href={`mailto:${site.contacto.email}`}
                      className="text-verde-600 underline underline-offset-2"
                    >
                      {site.contacto.email}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold text-ink">Horario:</dt>
                  <dd className="text-ink-suave">{site.contacto.horario}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-marca-lg border border-crema bg-white p-6 shadow-suave md:p-8">
              <h2 className="text-fluid-h3">Envíanos un mensaje</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-suave">
                Los campos con <span className="text-cocido-500">*</span> son obligatorios.
              </p>
              <LeadForm variante="contacto" origen="/contacto" className="mt-6" />
            </div>
          </div>
        </div>
      </section>

      <Section ariaLabelledby="faq-titulo">
        <div className="max-w-3xl">
          <FaqSection faqs={FAQS} titulo="Preguntas sobre contacto y postventa" />
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema(migas)} />
      <JsonLd data={faqSchema(FAQS)} />
    </>
  );
}
