import Link from "next/link";
import { CtaButton } from "@/components/ui/CtaButton";
import { IconoFlecha } from "@/components/ui/icons";
import type { Categoria } from "@/content/clusters";

/**
 * Hero de la Home: bloque principal (H1 + una línea + un CTA) y, a la derecha,
 * una tarjeta por categoría con su nombre, sus productos y el conteo real del
 * catálogo. Todo el texto llega por props desde `content/`: aquí no se escribe
 * copy.
 */
type Props = {
  eyebrow: string;
  h1: string;
  subtitulo: string;
  ctaPrincipal: string;
  hrefCtaPrincipal: string;
  categorias: readonly Categoria[];
};

export function Hero({ eyebrow, h1, subtitulo, ctaPrincipal, hrefCtaPrincipal, categorias }: Props) {
  return (
    <section aria-labelledby="titulo-home" className="contenedor pt-4 md:pt-6">
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col justify-center rounded-marca-lg border border-borde bg-crema px-6 py-8 md:px-10 md:py-12">
          <p className="inline-flex self-start rounded-[4px] bg-verde-600 px-2 py-1 text-[11px] font-bold uppercase leading-none tracking-[0.06em] text-white">
            {eyebrow}
          </p>

          <h1
            id="titulo-home"
            className="mt-4 max-w-2xl text-[1.875rem] leading-[1.05] tracking-[-0.025em] md:text-[2.5rem]"
          >
            {h1}
          </h1>

          <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-ink-suave">{subtitulo}</p>

          <div className="mt-5">
            <CtaButton href={hrefCtaPrincipal} evento="hero_ver_productos">
              {ctaPrincipal}
            </CtaButton>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {categorias.map((categoria) => {
            const n = categoria.pilares.filter((p) => p.publicado).length;
            return (
              <li key={categoria.slug}>
                <Link
                  href={`/${categoria.slug}`}
                  className="group card-hover flex h-full flex-col justify-center rounded-marca-lg border border-borde bg-white p-4 md:p-5"
                >
                  <h2 className="text-[17px] leading-tight">{categoria.nombre}</h2>
                  <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-ink-suave">
                    {categoria.pilares
                      .slice(0, 3)
                      .map((p) => p.nombre)
                      .join(" · ")}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-bold text-verde-600">
                    {n === 0 ? "Próximamente" : `Ver ${n} ${n === 1 ? "producto" : "productos"}`}
                    <IconoFlecha className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
