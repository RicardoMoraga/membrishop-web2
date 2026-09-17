import Image from "next/image";
import Link from "next/link";
import { ComprarButton } from "@/components/marketing/ComprarButton";
import { ImagenMarcador } from "@/components/marketing/ImagenMarcador";
import { Badge } from "@/components/ui/Badge";
import { estiloPrimario } from "@/components/ui/CtaButton";
import { IconoFlecha, IconoWhatsapp } from "@/components/ui/icons";
import type { Pilar } from "@/content/clusters";
import { precioCLP } from "@/lib/formato";
import { getProductoPorHandle, tiendaAbierta } from "@/lib/shopify";
import { linkWhatsapp, site } from "@/lib/site";

/**
 * Tarjeta de producto: imagen, categoría, nombre, precio real, plazo y CTA.
 *
 * Lo que NO lleva, y no por olvido: estrellas, reseñas, precio tachado,
 * porcentaje de descuento y contadores de escasez. Sin ventas registradas esas
 * señales serían inventadas; el precio anterior además es publicidad engañosa
 * bajo la Ley 19.496 y, en el JSON-LD, spam de datos estructurados. La consulta
 * a Shopify tampoco trae `compareAtPrice`.
 *
 * Precio y disponibilidad salen de Shopify. `precioDesde` del contenido solo
 * aparece si la integración está caída, y se rotula como referencial.
 */
const PLAZO_BASE = site.zonasDespacho[0];

const claseCta = `inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-marca px-2 py-2 text-center text-[13px] font-bold leading-tight transition-colors sm:text-[13.5px] ${estiloPrimario}`;

export async function ProductCard({
  pilar,
  categoriaSlug,
  categoriaNombre,
}: {
  pilar: Pilar;
  categoriaSlug: string;
  categoriaNombre?: string;
}) {
  const shopify = pilar.publicado ? await getProductoPorHandle(pilar.slug) : null;
  const comprable = shopify?.estado === "ok-disponible";
  const agotado = shopify?.estado === "ok-agotado";
  const producto = shopify?.producto ?? null;
  const varianteId = producto?.variantes.find((v) => v.disponible)?.id;

  const precio = producto?.precio ?? null;
  const precioReferencial = precio === null ? pilar.precioDesde : null;

  const primeraImagen = producto?.medios.find((m) => m.tipo === "imagen");
  const href = `/${categoriaSlug}/${pilar.slug}`;

  const media = primeraImagen ? (
    <div className="relative aspect-square w-full overflow-hidden bg-crema">
      <Image
        src={primeraImagen.url}
        alt={primeraImagen.alt || pilar.imagen.alt}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
    </div>
  ) : (
    <ImagenMarcador imagen={pilar.imagen} ratio="aspect-square" mostrarArchivo={false} />
  );

  const cuerpo = (
    <>
      <div className="relative">
        {media}
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1.5">
          {comprable && <Badge tono="stock">Con stock</Badge>}
          {agotado && <Badge tono="pronto">Sin stock</Badge>}
          {!pilar.publicado && <Badge tono="pronto">Próximamente</Badge>}
        </div>
      </div>

      <div className="flex flex-col px-3 pt-3">
        {categoriaNombre && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-tenue">
            {categoriaNombre}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 text-[14px] font-semibold leading-snug tracking-normal">
          {pilar.nombre}
        </h3>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5">
          {precio !== null ? (
            <>
              <span className="text-[22px] font-extrabold leading-none tracking-[-0.02em] text-ink">
                {precioCLP(precio)}
              </span>
              <span className="text-[11px] text-ink-tenue">IVA incluido</span>
            </>
          ) : precioReferencial !== null ? (
            <>
              <span className="text-[22px] font-extrabold leading-none tracking-[-0.02em] text-ink-suave">
                {precioCLP(precioReferencial)}
              </span>
              <span className="text-[11px] text-ink-tenue">referencial</span>
            </>
          ) : (
            <span className="text-[13px] font-medium text-ink-tenue">Precio por confirmar</span>
          )}
        </div>

        {comprable && PLAZO_BASE && (
          <p className="mt-1.5 text-[11.5px] font-semibold leading-snug text-verde-600">
            {PLAZO_BASE.zona}: {PLAZO_BASE.plazo}
          </p>
        )}
      </div>
    </>
  );

  const marco =
    "group flex h-full flex-col overflow-hidden rounded-marca-lg border border-borde bg-white transition-colors hover:border-borde-2";

  if (pilar.fichaPublicada) {
    return (
      <article className={marco}>
        <Link href={href} className="flex h-full flex-col focus-visible:outline-none">
          {cuerpo}
          <span className="mt-auto p-3">
            <span className={claseCta}>
              Ver producto
              <IconoFlecha className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </span>
        </Link>
      </article>
    );
  }

  return (
    <article className={marco}>
      {cuerpo}
      <div className="mt-auto p-3">
        {comprable && tiendaAbierta ? (
          <ComprarButton varianteId={varianteId} handle={pilar.slug} className="w-full" />
        ) : (
          <a
            href={linkWhatsapp(pilar.nombre)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={comprable ? `Comprar ${pilar.nombre} por WhatsApp` : `Consultar ${pilar.nombre} por WhatsApp`}
            data-evento={`cta_card_${pilar.slug}`}
            className={claseCta}
          >
            <IconoWhatsapp className="h-4 w-4" />
            {comprable ? "Comprar por WhatsApp" : "Consultar"}
          </a>
        )}
      </div>
    </article>
  );
}
