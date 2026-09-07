import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TldrBlock } from "@/components/seo/TldrBlock";
import { Section } from "@/components/ui/Section";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Política de Privacidad | MembriShop",
  description:
    "Qué datos personales recopila MembriShop, para qué se usan, con quién se comparten y cómo puedes solicitar acceso, corrección o eliminación.",
  path: "/politica-de-privacidad",
});

const TLDR = [
  "Solo pedimos los datos necesarios para procesar tu pedido y contactarte: nombre, dirección, correo, teléfono.",
  "No vendemos tus datos a terceros. Los compartimos solo con quienes procesan el pago y el despacho.",
  "Puedes pedir que corrijamos o eliminemos tus datos escribiendo a contacto@membrishop.cl.",
  "El formulario web guarda una versión anonimizada (hash) de tu IP, solo para evitar spam.",
];

export default function PrivacidadPage() {
  const migas = [
    { nombre: "Inicio", path: "/" },
    { nombre: "Política de Privacidad", path: "/politica-de-privacidad" },
  ];

  return (
    <>
      <section aria-labelledby="titulo-privacidad" className="border-b border-crema bg-crema-suave">
        <div className="contenedor py-10 md:py-14">
          <Breadcrumbs items={migas} />

          <div className="mt-6 max-w-3xl">
            <h1 id="titulo-privacidad" className="text-fluid-h1">
              Qué hacemos con tus datos, en lenguaje simple
            </h1>

            <div className="mt-6">
              <TldrBlock puntos={TLDR} titulo="Key takeaways" />
            </div>

            <p className="mt-6 text-fluid-lead leading-relaxed text-ink-suave">
              Si nos compras algo o nos escribes por el formulario de contacto, necesitamos
              algunos datos tuyos para poder despacharte el pedido o responderte. Esta página
              explica cuáles pedimos, para qué los usamos y qué derechos tienes sobre ellos.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="mx-auto max-w-3xl space-y-10 text-[15px] leading-relaxed text-ink-suave">
          <div>
            <h2 className="text-fluid-h3 text-ink">1. Responsable de tus datos</h2>
            <p className="mt-3">
              {site.nombreLegal}, operador de {site.nombre}, es responsable del tratamiento de los
              datos personales que nos entregas al comprar o contactarnos. Puedes escribirnos a{" "}
              <a href={`mailto:${site.contacto.email}`} className="text-verde-600 underline underline-offset-2">
                {site.contacto.email}
              </a>{" "}
              para cualquier consulta sobre tus datos.
            </p>
          </div>

          <div>
            <h2 className="text-fluid-h3 text-ink">2. Qué datos recopilamos</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Datos de contacto: nombre, correo, teléfono, dirección de despacho.</li>
              <li>Datos de la compra: productos, monto, número de pedido, medio de pago usado (no guardamos el número de tarjeta; eso lo procesa la pasarela de pago directamente).</li>
              <li>
                Datos del formulario de contacto: nombre, correo o teléfono, y el mensaje que
                escribes. Guardamos también un hash (versión irreversible) de tu dirección IP,
                solo para limitar el envío repetido de spam — nunca la IP en texto plano.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-fluid-h3 text-ink">3. Para qué los usamos</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Procesar y despachar tu pedido.</li>
              <li>Responder tus consultas por WhatsApp, correo o el formulario web.</li>
              <li>Cumplir con obligaciones legales (boleta electrónica, garantía, retracto).</li>
              <li>Enviarte avisos de stock si te suscribes voluntariamente al newsletter del footer — puedes darte de baja cuando quieras.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-fluid-h3 text-ink">4. Con quién compartimos tus datos</h2>
            <p className="mt-3">
              Solo con los proveedores necesarios para completar tu compra: la pasarela de pago
              (procesa el cobro directamente, no nos entrega el número completo de tu tarjeta) y
              la empresa de courier que despacha tu pedido (recibe nombre, dirección y teléfono,
              lo necesario para entregarte). No vendemos ni arrendamos tus datos a terceros con
              fines publicitarios.
            </p>
          </div>

          <div>
            <h2 className="text-fluid-h3 text-ink">5. Tus derechos</h2>
            <p className="mt-3">
              Puedes solicitarnos en cualquier momento acceder a tus datos, corregirlos o pedir su
              eliminación, escribiendo a{" "}
              <a href={`mailto:${site.contacto.email}`} className="text-verde-600 underline underline-offset-2">
                {site.contacto.email}
              </a>
              . Respondemos dentro del horario de atención ({site.contacto.horario}). Si ya tienes
              un pedido en curso, conservamos los datos necesarios para la garantía legal (6
              meses) antes de eliminarlos.
            </p>
          </div>

          <div>
            <h2 className="text-fluid-h3 text-ink">6. Cambios a esta política</h2>
            <p className="mt-3">
              Si actualizamos esta política, la nueva versión reemplaza a esta en la misma
              dirección web, con la fecha de la última actualización.
            </p>
          </div>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema(migas)} />
    </>
  );
}
