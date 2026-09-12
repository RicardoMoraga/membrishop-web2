import { CtaButton } from "@/components/ui/CtaButton";
import { TituloResaltado } from "@/components/ui/TituloResaltado";
import { IconoCheck } from "@/components/ui/icons";
import { linkWhatsapp } from "@/lib/site";

/**
 * Hero de la Home. Extraído de `app/page.tsx` para que sea reutilizable
 * (por ejemplo en una futura landing de campaña) sin duplicar marcado, y para
 * que la página quede centrada en composición y no en detalle visual.
 *
 * Mismo contrato de contenido que `home.ts`: recibe los campos ya resueltos,
 * no importa `content/home` directamente, así que sirve para cualquier hero
 * con esta forma (H1 + TL;DR + intro + dos CTA + chips).
 */
type Props = {
  eyebrow: string;
  h1: string;
  destacadasH1: readonly string[];
  tldr: readonly string[];
  intro: string;
  ctaPrincipal: string;
  ctaSecundario: string;
  chips: readonly string[];
  hrefCtaPrincipal?: string;
};

export function Hero({
  eyebrow,
  h1,
  destacadasH1,
  tldr,
  intro,
  ctaPrincipal,
  ctaSecundario,
  chips,
  hrefCtaPrincipal = "#categorias",
}: Props) {
  return (
    <section aria-labelledby="titulo-home" className="border-b border-crema bg-crema-suave">
      <div className="contenedor py-12 md:py-16">
        <div className="max-w-3xl">
          <p className="font-display mb-3 text-xs font-bold uppercase tracking-[0.14em] text-oro-700">
            {eyebrow}
          </p>

          <h1 id="titulo-home" className="text-fluid-h1 font-extrabold leading-[1.08]">
            <TituloResaltado texto={h1} destacadas={[...destacadasH1]} />
          </h1>

          {/* TL;DR justo tras el H1 — tres líneas, no un bloque */}
          <ul className="mt-5 grid gap-1.5">
            {tldr.slice(0, 3).map((punto) => (
              <li key={punto} className="flex gap-2 text-[14px] leading-snug text-ink-suave">
                <IconoCheck className="mt-px h-4 w-4 shrink-0 text-verde-500" />
                <span>{punto}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 max-w-2xl text-fluid-lead leading-relaxed text-ink-suave">{intro}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <CtaButton href={hrefCtaPrincipal} evento="hero_ver_productos">
              {ctaPrincipal}
            </CtaButton>
            <CtaButton
              href={linkWhatsapp("desde la home")}
              externo
              variante="secundario"
              conFlecha={false}
              evento="hero_whatsapp"
            >
              {ctaSecundario}
            </CtaButton>
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {chips.map((chip) => (
              <li key={chip} className="text-[13px] font-medium text-ink-tenue">
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
