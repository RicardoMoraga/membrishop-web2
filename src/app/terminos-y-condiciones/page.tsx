import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TldrBlock } from "@/components/seo/TldrBlock";
import { Section } from "@/components/ui/Section";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import legal from "@/content/legal/terminos.json";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  // Distinto del H1, dentro de 50-60 caracteres.
  title: "Términos y Condiciones | MembriShop",
  description:
    "Condiciones de compra de MembriShop: precios, medios de pago, plazos de despacho, derecho a retracto y responsabilidad del comprador y del vendedor.",
  path: "/terminos-y-condiciones",
});

const TLDR = [
  `Vendemos solo online, con precios en ${site.moneda} con IVA incluido; te enviamos la boleta electrónica por correo o WhatsApp después del pago.`,
  `${site.promesas.retracto}, según la Ley N°19.496 del Consumidor.`,
  "Por ahora despachamos solo dentro de la Región Metropolitana: 24–72 h hábiles, hasta 5 días en sectores alejados.",
  "Si ejerces el retracto una vez despachado el pedido, el envío de vuelta es de tu cargo.",
  "Estos términos rigen toda compra hecha en membrishop.cl, sin excepción.",
];

export default function TerminosPage() {
  const migas = [
    { nombre: "Inicio", path: "/" },
    { nombre: "Términos y Condiciones", path: "/terminos-y-condiciones" },
  ];

  return (
    <>
      <section aria-labelledby="titulo-terminos" className="border-b border-crema bg-crema-suave">
        <div className="contenedor py-10 md:py-14">
          <Breadcrumbs items={migas} />

          <div className="mt-6 max-w-3xl">
            {/* H1 único, distinto del meta title */}
            <h1 id="titulo-terminos" className="text-fluid-h1">
              Las reglas claras de comprar en MembriShop
            </h1>

            <div className="mt-6">
              <TldrBlock puntos={TLDR} titulo="Key takeaways" />
            </div>

            {/* Primer párrafo: resuelve el intent de la página */}
            <p className="mt-6 text-fluid-lead leading-relaxed text-ink-suave">
              Estos términos y condiciones regulan toda compra realizada en {site.nombre}{" "}
              ({site.url.replace("https://", "")}), operado por {site.nombreLegal}. Al confirmar
              un pedido, aceptas las condiciones descritas en esta página. Si tienes dudas antes
              de comprar, puedes escribirnos por WhatsApp o revisar la sección de{" "}
              <a href="/contacto" className="text-verde-600 underline underline-offset-2">
                contacto
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="mx-auto max-w-3xl space-y-10 text-[15px] leading-relaxed text-ink-suave">
          {legal.map((sec) => (
            <div key={sec.titulo}>
              <h2 className="text-fluid-h3 text-ink">{sec.titulo}</h2>
              {sec.bloques.map((b, i) =>
                b.t === "ul" ? (
                  <ul key={i} className="mt-3 list-disc space-y-2 pl-5">
                    {(b.x as string[]).map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i} className="mt-3">
                    {b.x as string}
                  </p>
                ),
              )}
            </div>
          ))}
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema(migas)} />
    </>
  );
}
