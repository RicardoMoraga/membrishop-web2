import { CtaButton } from "@/components/ui/CtaButton";
import { TituloResaltado } from "@/components/ui/TituloResaltado";
import { IconoCamion, IconoCheck, IconoEscudo, IconoTarjeta } from "@/components/ui/icons";
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
    <section
      aria-labelledby="titulo-home"
      className="relative overflow-hidden border-b border-crema bg-crema-suave"
    >
      <div className="hero-decor" aria-hidden="true" />
      <div className="contenedor relative py-12 md:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-14">
          <div className="max-w-3xl">
            <p className="font-display mb-3.5 inline-flex items-center rounded-full bg-oro-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-oro-700">
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

          {/* Panel de confianza: refuerza el H1 con las tres promesas
              comerciales reales del proyecto (site.promesas), no adornos
              inventados. Solo desde lg — en mobile el TL;DR ya cumple ese rol. */}
          <div className="hidden lg:block">
            <div className="rounded-marca-lg border border-borde bg-white p-6 shadow-elevada">
              <p className="font-display text-sm font-bold text-ink">Por qué comprar en MembriShop</p>
              <ul className="mt-4 grid gap-4">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-verde-50 text-verde-600">
                    <IconoEscudo className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink">Stock real en Chile</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-ink-suave">
                      Disponibilidad confirmada, sin promesas vacías.
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oro-100 text-oro-700">
                    <IconoCamion className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink">Despacho a todo Chile</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-ink-suave">
                      Plazos claros por zona, sin letra chica.
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-verde-50 text-verde-600">
                    <IconoTarjeta className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink">Boleta y pago seguro</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-ink-suave">
                      Compra formal, con respaldo y retracto legal.
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
