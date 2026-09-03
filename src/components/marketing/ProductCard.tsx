import Link from "next/link";
import { ImagenMarcador } from "@/components/marketing/ImagenMarcador";
import { ComprarButton } from "@/components/marketing/ComprarButton";
import { Badge } from "@/components/ui/Badge";
import { IconoCheck, IconoFlecha, IconoWhatsapp } from "@/components/ui/icons";
import type { Pilar } from "@/content/clusters";
import { linkWhatsapp } from "@/lib/site";
import { getProductoPorHandle } from "@/lib/shopify";

const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

/**
 * Tarjeta de producto.
 *
 * A diferencia del modelo en el que se inspira, aquí NO hay estrellas de
 * valoración, ni precio tachado, ni badge de descuento. MembriShop todavía no
 * registra ventas: inventar esas señales sería publicidad engañosa, y en el
 * JSON-LD equivale a spam de datos estructurados (acción manual de Google).
 * El espacio que ocuparían lo toma la nota verde, que sí dice algo cierto.
 */
export async function ProductCard({ pilar, categoriaSlug }: { pilar: Pilar; categoriaSlug: string }) {
  const enOferta = pilar.precioDesde != null && pilar.precioAntes != null && pilar.precioAntes > pilar.precioDesde;
  const pocoStock = pilar.publicado && pilar.stock > 0 && pilar.stock < 10;

  // Compra directa vía Shopify: solo se intenta si el pilar ya está
  // publicado en la web (evita pedir por handles que ni siquiera son
  // pilares reales). Si Shopify no tiene ese handle, no está publicado en
  // el canal Headless, o no hay stock, `productoShopify` queda `null` y la
  // tarjeta cae al comportamiento de siempre (WhatsApp / próximamente).
  const productoShopify = pilar.publicado ? await getProductoPorHandle(pilar.slug) : null;
  const comprableEnShopify = Boolean(productoShopify?.disponible);

  const cuerpo = (
    <>
      <div className="relative">
        <ImagenMarcador imagen={pilar.imagen} ratio="aspect-square" mostrarArchivo={false} />
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {pilar.publicado ? (
            <Badge tono="stock">Con stock</Badge>
          ) : (
            <Badge tono="pronto">Próximamente</Badge>
          )}
          {pilar.publicado && !pilar.fichaPublicada && <Badge tono="consultar">Por WhatsApp</Badge>}
          {enOferta && <Badge tono="oferta">Precio rebajado</Badge>}
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="font-display text-[17px] font-bold leading-snug text-ink">{pilar.nombre}</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-suave">{pilar.gancho}</p>

        <p className="mt-3 flex items-start gap-1.5 text-[13px] font-medium leading-snug text-verde-600">
          <IconoCheck className="mt-px h-4 w-4 shrink-0" />
          {pilar.problema}
        </p>

        <div className="mt-4 flex items-baseline gap-2 border-t border-borde pt-3">
          {pilar.precioDesde ? (
            <>
              <span className="font-display text-xl font-extrabold text-ink">
                {clp.format(pilar.precioDesde)}
              </span>
              {enOferta && (
                <span className="text-[13px] font-medium text-ink-tenue line-through">
                  {clp.format(pilar.precioAntes!)}
                </span>
              )}
              <span className="text-[12px] text-ink-tenue">IVA incluido</span>
            </>
          ) : (
            <span className="text-sm font-medium text-ink-tenue">Precio por confirmar</span>
          )}
        </div>

        {pocoStock && (
          <p className="mt-2 text-[12.5px] font-semibold text-oro-700">
            Quedan {pilar.stock} unidades
          </p>
        )}
      </div>
    </>
  );

  const marco =
    "flex h-full flex-col rounded-marca-lg border border-borde bg-white p-3.5 shadow-suave transition-all duration-200";

  /* --- Con ficha propia: la tarjeta entera es el enlace ------------------ */
  if (pilar.fichaPublicada) {
    return (
      <article
        className={`${marco} hover:-translate-y-1 hover:border-oro-200 hover:shadow-elevada`}
      >
        <Link href={`/${categoriaSlug}/${pilar.slug}`} className="flex h-full flex-col">
          {cuerpo}
          <span className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-oro-400 px-4 py-2.5 text-sm font-semibold text-ink transition-colors group-hover:bg-oro-300">
            Ver ficha
            <IconoFlecha className="h-4 w-4" />
          </span>
        </Link>
      </article>
    );
  }

  /* --- Con stock: compra directa si Shopify tiene el handle, si no WhatsApp */
  if (pilar.publicado) {
    return (
      <article className={marco}>
        {cuerpo}
        {comprableEnShopify ? (
          <ComprarButton handle={pilar.slug} className="mt-3 w-full" />
        ) : (
          <a
            href={linkWhatsapp(pilar.nombre)}
            target="_blank"
            rel="noopener noreferrer"
            data-evento={`cta_card_${pilar.slug}`}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-sm font-semibold text-ink transition-[filter] hover:brightness-95"
          >
            <IconoWhatsapp className="h-4 w-4" />
            Consultar
          </a>
        )}
      </article>
    );
  }

  /* --- Aún no disponible: sin enlace y sin CTA -------------------------- */
  return (
    <article className={`${marco} opacity-90`}>
      {cuerpo}
      <span className="mt-3 inline-flex items-center justify-center rounded-full border border-borde-2 px-4 py-2.5 text-sm font-semibold text-ink-tenue">
        Aún no disponible
      </span>
    </article>
  );
}
