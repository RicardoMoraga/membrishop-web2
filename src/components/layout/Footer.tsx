import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { LeadForm } from "@/components/marketing/LeadForm";
import { BotonPreferenciasCookies } from "@/components/layout/ConsentimientoCookies";
import { IconoFacebook, IconoInstagram, IconoTiktok } from "@/components/ui/icons";
import { getCatalogo } from "@/lib/catalogo";
import { site } from "@/lib/site";

const REDES = [
  { nombre: "Instagram", href: site.redes.instagram, Icono: IconoInstagram },
  { nombre: "Facebook", href: site.redes.facebook, Icono: IconoFacebook },
  { nombre: "TikTok", href: site.redes.tiktok, Icono: IconoTiktok },
];

function Pildora({ children }: { children: string }) {
  return (
    <li className="text-[12.5px] font-medium text-crema/90">{children}</li>
  );
}

/**
 * Footer sobre tinta (#2a2016), el mismo café oscuro del texto. Sobre ese
 * fondo el dorado de marca funciona como color de enlace con 7:1 de contraste,
 * cosa que no ocurre sobre crema.
 *
 * Contiene además el mapa completo del topic cluster: es el enlace de retorno
 * que cierra el circuito hub → pilar → producto en todas las páginas.
 */
export async function Footer() {
  const { categorias } = await getCatalogo();
  const anio = new Date().getFullYear();

  return (
    <footer className="bg-ink text-crema/85">
      <div className="contenedor py-8 md:py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          <div>
            <Logo tono="claro" className="h-[38px]" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-crema/70">
              {site.descripcionCorta}
            </p>

            <ul className="mt-5 flex gap-2">
              {REDES.map(({ nombre, href, Icono }) => (
                <li key={nombre}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={nombre}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-marca bg-white/10 text-crema transition-colors hover:bg-white/20"
                  >
                    <Icono className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 max-w-xs">
              <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-oro-300">
                Avisos de stock
              </p>
              <LeadForm variante="newsletter" origen="footer" tono="oscuro" className="mt-3" />
            </div>
          </div>

          {categorias.map((categoria) => (
            <nav key={categoria.slug} aria-label={`Enlaces de ${categoria.nombre}`}>
              {/* <p> y no <h2>: el footer no debe competir en el esquema de encabezados. */}
              <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-oro-300">
                <Link href={`/${categoria.slug}`} className="hover:underline">
                  {categoria.nombre}
                </Link>
              </p>
              <ul className="mt-4 space-y-2.5">
                {categoria.pilares.length === 0 && (
                  <li className="text-sm text-crema/70">Próximamente</li>
                )}
                {categoria.pilares.map((pilar) => (
                  <li key={pilar.slug}>
                    {pilar.fichaPublicada ? (
                      <Link
                        href={`/${categoria.slug}/${pilar.slug}`}
                        className="text-sm text-crema/75 transition-colors hover:text-white hover:underline"
                      >
                        {pilar.nombre}
                      </Link>
                    ) : (
                      <span className="text-sm text-crema/70">
                        {pilar.nombre}
                        {pilar.publicado ? " · consultar" : " · pronto"}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Medios de pago y couriers: es la sección que más se mira antes de
            comprar por primera vez en una tienda desconocida. */}
        <div className="mt-8 grid gap-4 border-t border-white/12 pt-5 sm:grid-cols-2">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-oro-300">
              Medios de pago
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
              {site.mediosPago.map((medio) => (
                <Pildora key={medio}>{medio}</Pildora>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-oro-300">
              Despachamos con
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
              {site.couriers.map((courier) => (
                <Pildora key={courier}>{courier}</Pildora>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/12 pt-5 text-[12.5px] text-crema/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {anio} {site.nombre}. Hecho en Chile. Operado por {site.nombreLegal}, RUT {site.rut}, {site.domicilioLegal}.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/contacto" className="hover:text-white hover:underline">
              Contacto
            </Link>
            <Link href="/envios-y-devoluciones" className="hover:text-white hover:underline">
              Envíos y devoluciones
            </Link>
            <Link href="/terminos-y-condiciones" className="hover:text-white hover:underline">
              Términos y condiciones
            </Link>
            <Link href="/politica-de-privacidad" className="hover:text-white hover:underline">
              Política de privacidad
            </Link>
            {site.analytics.ga4 ? (
              <BotonPreferenciasCookies className="hover:text-white hover:underline" />
            ) : null}
            <a
              href={`mailto:${site.contacto.email}`}
              className="text-[13.5px] font-bold text-white hover:underline"
            >
              {site.contacto.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
