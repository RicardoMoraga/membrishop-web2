import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TldrBlock } from "@/components/seo/TldrBlock";
import { Section } from "@/components/ui/Section";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import legal from "@/content/legal/privacidad.json";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Política de Privacidad | MembriShop",
  description:
    "Qué datos personales recopila MembriShop, para qué se usan, con quién se comparten y cómo puedes solicitar acceso, corrección o eliminación.",
  path: "/politica-de-privacidad",
});

const TLDR = [
  "Solo pedimos los datos necesarios para procesar tu pedido y contactarte: nombre, dirección, correo, teléfono.",
  "No vendemos tus datos. Los tratan solo los proveedores que operan la tienda, el pago y el despacho.",
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
          {legal.map((sec) => (
            <div key={sec.titulo} id={sec.titulo.includes("Cookies") ? "cookies" : undefined}>
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
