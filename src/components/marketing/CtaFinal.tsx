import { ShareButtons } from "@/components/marketing/ShareButtons";
import { CtaButton } from "@/components/ui/CtaButton";
import { linkWhatsapp } from "@/lib/site";

type Props = { titulo: string; texto?: string; path: string; tituloCompartir: string };

/**
 * Bloque de cierre. Sin formulario: el de suscripción vive una sola vez, en el
 * footer, para no pedir el correo dos veces en la misma página.
 */
export function CtaFinal({ titulo, texto, path, tituloCompartir }: Props) {
  return (
    <section aria-labelledby="titulo-cierre" className="contenedor py-7 md:py-10">
      <div className="flex flex-col items-start gap-5 rounded-marca-lg border border-borde bg-crema p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="max-w-xl">
          <h2 id="titulo-cierre" className="text-fluid-h2 leading-tight">
            {titulo}
          </h2>
          {texto && <p className="mt-2 text-[14.5px] leading-relaxed text-ink-suave">{texto}</p>}
          <ShareButtons path={path} titulo={tituloCompartir} className="mt-4" />
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <CtaButton
            href={linkWhatsapp("cierre de la home")}
            externo
            conFlecha={false}
            evento="cta_cierre_whatsapp"
          >
            Consultar por WhatsApp
          </CtaButton>
          <CtaButton href="/contacto" variante="fantasma" evento="cta_cierre_contacto">
            Escribir un mensaje
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
