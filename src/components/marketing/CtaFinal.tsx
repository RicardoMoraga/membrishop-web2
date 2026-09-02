import { LeadForm } from "@/components/marketing/LeadForm";
import { ShareButtons } from "@/components/marketing/ShareButtons";
import { CtaButton } from "@/components/ui/CtaButton";
import { linkWhatsapp } from "@/lib/site";

type Props = { titulo: string; texto: string; path: string; tituloCompartir: string };

/**
 * Bloque de cierre. El degradado va en los tonos del dulce de membrillo
 * (#7a3a0d → #a34c08 → #b2540a): los tres son lo bastante oscuros para que el
 * texto blanco pase 4,5:1, cosa que no ocurriría degradando hacia el dorado
 * claro. Sobre ese fondo el botón dorado es lo más luminoso de la página.
 */
export function CtaFinal({ titulo, texto, path, tituloCompartir }: Props) {
  return (
    <section aria-labelledby="titulo-cierre" className="py-14 md:py-20">
      <div className="contenedor">
        <div
          className="rounded-marca-lg px-6 py-12 text-center md:px-12 md:py-16"
          style={{
            background: "linear-gradient(135deg, #7a3a0d 0%, #a34c08 50%, #b2540a 100%)",
          }}
        >
          <h2 id="titulo-cierre" className="text-fluid-h2 text-white">
            {titulo}
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-oro-100">{texto}</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaButton
              href={linkWhatsapp("cierre de la home")}
              variante="primario"
              externo
              conFlecha={false}
              evento="cta_cierre_whatsapp"
            >
              Consultar por WhatsApp
            </CtaButton>
            <CtaButton href="/contacto" variante="sobre-oscuro" evento="cta_cierre_contacto">
              Escribir un mensaje
            </CtaButton>
          </div>

          <div className="mx-auto mt-10 max-w-md border-t border-white/20 pt-8 text-left">
            <p className="font-display mb-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-oro-200">
              O déjanos tu correo
            </p>
            <LeadForm variante="newsletter" origen="cierre-home" tono="oscuro" />
          </div>

          <div className="mt-10 flex justify-center border-t border-white/20 pt-8">
            <ShareButtons path={path} titulo={tituloCompartir} tono="oscuro" />
          </div>
        </div>
      </div>
    </section>
  );
}
