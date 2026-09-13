import Image from "next/image";
import Link from "next/link";
import { ComprarButton } from "@/components/marketing/ComprarButton";
import { ImagenMarcador } from "@/components/marketing/ImagenMarcador";
import { Badge } from "@/components/ui/Badge";
import { IconoFlecha, IconoWhatsapp } from "@/components/ui/icons";
import type { Pilar } from "@/content/clusters";
import { precioCLP } from "@/lib/formato";
import { getProductoPorHandle, tiendaAbierta } from "@/lib/shopify";
import { linkWhatsapp } from "@/lib/site";

/**
 * Tarjeta de producto: imagen, nombre, precio real, disponibilidad real, CTA.
 *
 * Lo que NO lleva, y no por olvido: estrellas, reseñas, precio tachado,
 * porcentaje de descuento y contadores de escasez. Sin ventas registradas esas
 * señales serían inventadas; el precio anterior además es publicidad engañosa
 * bajo la Ley 19.496 y, en el JSON-LD, spam de datos estructurados.
 *
 * Precio y disponibilidad salen de Shopify. `precioDesde` del contenido solo
 * aparece si la integración está caída, y se rotula como referencial.
 */
export async function ProductCard({ pilar, categoriaSlug }: { pilar: Pilar; categoriaSlug: string }) {
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
    <div className="relative aspect-square w-full overflow-hidden rounded-marca border border-borde/70 bg-crema">
      <Image
        src={primeraImagen.url}
        alt={primeraImagen.alt || pilar.imagen.alt}
        fill
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 300px"
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
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {comprable && <Badge tono="stock">Con stock</Badge>}
          {agotado && <Badge tono="pronto">Sin stock</Badge>}
          {!pilar.publicado && <Badge tono="pronto">Próximamente</Badge>}
        </div>
      </div>

      <div className="mt-3.5 flex flex-1 flex-col">
        <h3 className="font-display text-[16px] font-bold leading-snug text-ink">{pilar.nombre}</h3>
        <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-ink-suave">
          {pilar.gancho}
        </p>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-borde pt-3">
          {precio !== null ? (
            <>
              <span className="font-display text-xl font-extrabold text-ink">
                {precioCLP(precio)}
              </span>
              <span className="text-[12px] text-ink-tenue">IVA incluido</span>
            </>
          ) : precioReferencial !== null ? (
            <>
              <span className="font-display text-xl font-extrabold text-ink-suave">
                {precioCLP(precioReferencial)}
              </span>
              <span className="text-[12px] text-ink-tenue">referencial</span>
            </>
          ) : (
            <span className="text-sm font-medium text-ink-tenue">Precio por confirmar</span>
          )}
        </div>
      </div>
    </>
  );

  const marco =
    "group flex h-full flex-col rounded-marca-lg border border-borde bg-white p-3.5 shadow-suave transition-all duration-200";

  if (pilar.fichaPublicada) {
    return (
      <article className={`${marco} hover:-translate-y-1 hover:border-oro-200 hover:shadow-elevada`}>
        <Link href={href} className="flex h-full flex-col focus-visible:outline-none">
          {cuerpo}
          <span className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-oro-400 px-4 py-2.5 text-sm font-semibold text-ink transition-colors group-hover:bg-oro-300">
            Ver producto
            <IconoFlecha className="h-4 w-4" />
          </span>
        </Link>
      </article>
    );
  }

  return (
    <article className={marco}>
      {cuerpo}
      {comprable && tiendaAbierta ? (
        <ComprarButton
          varianteId={varianteId}
          handle={pilar.slug}
          className="mt-3 w-full"
        />
      ) : (
        <a
          href={linkWhatsapp(pilar.nombre)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={comprable ? `Comprar ${pilar.nombre} por WhatsApp` : `Consultar ${pilar.nombre} por WhatsApp`}
          data-evento={`cta_card_${pilar.slug}`}
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-sm font-semibold text-ink transition-[filter] hover:brightness-95"
        >
          <IconoWhatsapp className="h-4 w-4" />
          {comprable ? "Comprar por WhatsApp" : "Consultar"}
        </a>
      )}
    </article>
  );
}
