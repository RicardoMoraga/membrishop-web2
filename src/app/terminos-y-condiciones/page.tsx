import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TldrBlock } from "@/components/seo/TldrBlock";
import { Section } from "@/components/ui/Section";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  // Distinto del H1, dentro de 50-60 caracteres.
  title: "Términos y Condiciones | MembriShop",
  description:
    "Condiciones de compra de MembriShop: precios, medios de pago, plazos de despacho, derecho a retracto y responsabilidad del comprador y del vendedor.",
  path: "/terminos-y-condiciones",
});

const TLDR = [
  `Vendemos solo online, con boleta electrónica y precios en ${site.moneda} con IVA incluido.`,
  `${site.promesas.retracto}, según la Ley N°19.496 del Consumidor.`,
  "Por ahora despachamos solo dentro de la Región Metropolitana; los plazos son estimados (ver Envíos y Devoluciones).",
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
          <div>
            <h2 className="text-fluid-h3 text-ink">1. Identificación del vendedor</h2>
            <p className="mt-3">
              {site.nombreLegal} (RUT {site.rut}), con domicilio en {site.domicilioLegal}, opera la
              tienda online {site.nombre}, con atención 100 % digital (sin local de atención al
              público). Contacto:{" "}
              <a href={`mailto:${site.contacto.email}`} className="text-verde-600 underline underline-offset-2">
                {site.contacto.email}
              </a>{" "}
              — horario de atención: {site.contacto.horario}.
            </p>
          </div>

          <div>
            <h2 className="text-fluid-h3 text-ink">2. Precios y medios de pago</h2>
            <p className="mt-3">
              Todos los precios publicados están en {site.moneda} e incluyen IVA. Aceptamos los
              siguientes medios de pago: {site.mediosPago.join(", ")}. El precio y la
              disponibilidad de un producto son los vigentes al momento de confirmar el pago; un
              precio mostrado antes de esa confirmación no constituye una oferta en firme.
            </p>
          </div>

          <div>
            <h2 className="text-fluid-h3 text-ink">3. Confirmación del pedido</h2>
            <p className="mt-3">
              Una compra se considera confirmada cuando el medio de pago aprueba la transacción y
              recibes el correo de confirmación con el número de pedido. Emitimos boleta
              electrónica por cada compra realizada.
            </p>
          </div>

          <div>
            <h2 className="text-fluid-h3 text-ink">4. Despacho</h2>
            <p className="mt-3">
              Por ahora despachamos solo dentro de la Región Metropolitana. Los plazos están detallados en nuestra{" "}
              <a
                href="/envios-y-devoluciones"
                className="text-verde-600 underline underline-offset-2"
              >
                Política de Envíos y Devoluciones
              </a>
              . Son plazos estimados de courier, no una fecha comprometida en horas exactas.
            </p>
          </div>

          <div>
            <h2 className="text-fluid-h3 text-ink">5. Derecho a retracto</h2>
            <p className="mt-3">
              {site.promesas.retracto}. El detalle del procedimiento —cómo solicitarlo, quién
              cubre el costo del envío de vuelta y en qué estado debe llegar el producto— está en
              la{" "}
              <a
                href="/envios-y-devoluciones"
                className="text-verde-600 underline underline-offset-2"
              >
                Política de Envíos y Devoluciones
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-fluid-h3 text-ink">6. Garantía legal</h2>
            <p className="mt-3">
              Todos los productos cuentan con garantía legal de 6 meses según la Ley N°19.496 del
              Consumidor, gestionada directamente con {site.nombre} — sin necesidad de tramitar
              nada con un proveedor extranjero.
            </p>
          </div>

          <div>
            <h2 className="text-fluid-h3 text-ink">7. Disponibilidad de stock</h2>
            <p className="mt-3">
              El catálogo de {site.nombre} es rotativo: un producto puede agotarse y ser
              reemplazado por otro similar. Si un producto se agota después de que confirmaste el
              pago, te contactaremos para ofrecerte un reemplazo equivalente o el reembolso total
              del monto pagado.
            </p>
          </div>

          <div>
            <h2 className="text-fluid-h3 text-ink">8. Modificaciones</h2>
            <p className="mt-3">
              Podemos actualizar estos términos para reflejar cambios operativos o normativos. La
              versión vigente es siempre la publicada en esta página al momento de tu compra.
            </p>
          </div>
        </div>
      </Section>

      <JsonLd data={breadcrumbSchema(migas)} />
    </>
  );
}
