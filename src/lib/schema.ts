import { site, urlAbsoluta } from "@/lib/site";
import type { Categoria, Faq } from "@/content/clusters";

/* -------------------------------------------------------------------------
 * Constructores de JSON-LD.
 * Devuelven objetos planos; el componente <JsonLd> los serializa.
 * ---------------------------------------------------------------------- */

const ID_ORGANIZACION = `${site.url}/#organizacion`;
const ID_SITIO = `${site.url}/#sitio`;

/**
 * Tipo correcto para una tienda 100 % online.
 * `OnlineStore` es subtipo de `Organization` y es lo que Google espera cuando
 * NO existe un local con atención de público. Ver `storeSchema()` abajo si
 * algún día abres dirección física.
 */
export function organizacionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": ID_ORGANIZACION,
    name: site.nombre,
    legalName: site.nombreLegal,
    url: site.url,
    description: site.descripcionCorta,
    logo: {
      "@type": "ImageObject",
      url: urlAbsoluta("/images/membrishop-logo.png"),
      width: 512,
      height: 512,
    },
    image: urlAbsoluta("/images/og-membrishop.jpg"),
    email: site.contacto.email,
    sameAs: Object.values(site.redes),
    areaServed: site.areaDespacho.map((area) => ({
      "@type": "AdministrativeArea",
      name: area.nombre,
      containedInPlace: { "@type": "Country", name: "Chile" },
    })),
    currenciesAccepted: site.moneda,
    paymentAccepted: site.mediosPago.join(", "),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: site.contacto.email,
        availableLanguage: ["Spanish"],
        areaServed: site.pais,
      },
    ],
  };
}

/**
 * Store / LocalBusiness. Solo se emite si existe dirección física real.
 * Google exige un local que el cliente pueda visitar; declararlo sin dirección
 * es una infracción de las guías de datos estructurados.
 */
export function storeSchema() {
  const dir = site.direccionFisica;
  if (!dir) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${site.url}/#tienda`,
    name: site.nombre,
    url: site.url,
    image: urlAbsoluta("/images/membrishop-local.jpg"),
    email: site.contacto.email,
    telephone: `+${site.contacto.whatsapp}`,
    priceRange: "$$",
    currenciesAccepted: site.moneda,
    address: {
      "@type": "PostalAddress",
      streetAddress: dir.calle,
      addressLocality: dir.ciudad,
      addressRegion: dir.region,
      postalCode: dir.codigoPostal,
      addressCountry: site.pais,
    },
    geo: { "@type": "GeoCoordinates", latitude: dir.latitud, longitude: dir.longitud },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    parentOrganization: { "@id": ID_ORGANIZACION },
  };
}

export function sitioWebSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": ID_SITIO,
    url: site.url,
    name: site.nombre,
    inLanguage: site.idioma,
    publisher: { "@id": ID_ORGANIZACION },
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.pregunta,
      acceptedAnswer: { "@type": "Answer", text: f.respuesta },
    })),
  };
}

export function breadcrumbSchema(items: { nombre: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nombre,
      item: urlAbsoluta(item.path),
    })),
  };
}

/** Listado de productos de una categoría. Refuerza la relación hub → pilar. */
export function itemListSchema(categoria: Categoria) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Productos de ${categoria.nombre} en ${site.nombre}`,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    // Solo items con URL real: una ItemList que apunta a 404 es marcado inválido.
    numberOfItems: categoria.pilares.filter((p) => p.fichaPublicada).length,
    itemListElement: categoria.pilares
      .filter((p) => p.fichaPublicada)
      .map((pilar, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: pilar.nombre,
        url: urlAbsoluta(`/${categoria.slug}/${pilar.slug}`),
      })),
  };
}

/**
 * Product + Offer.
 * IMPORTANTE: el precio del JSON-LD debe coincidir con el precio visible.
 * No se incluye `aggregateRating` a propósito: sin ventas reales, inventar
 * valoraciones es motivo de acción manual por spam de datos estructurados.
 */
export function productoSchema(params: {
  nombre: string;
  descripcion: string;
  slug: string;
  categoriaSlug: string;
  precio: number;
  imagen: string;
  sku?: string;
  /**
   * Disponibilidad REAL (Shopify), no la del placeholder `pilar.stock`.
   * Declarar `InStock` sin verificar el stock real de Shopify es el motivo
   * más común de una acción manual por "datos estructurados engañosos" en
   * Search Console — y hoy el catálogo tiene 0 unidades reales en todos los
   * productos. Por defecto se asume `false` (más seguro que asumir stock).
   */
  disponible?: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: params.nombre,
    description: params.descripcion,
    // URL absoluta (CDN de Shopify) o nombre de archivo en /public/images.
    image: [/^https?:\/\//.test(params.imagen) ? params.imagen : urlAbsoluta(`/images/${params.imagen}`)],
    sku: params.sku ?? params.slug,
    brand: { "@type": "Brand", name: site.nombre },
    category: params.categoriaSlug,
    offers: {
      "@type": "Offer",
      url: urlAbsoluta(`/${params.categoriaSlug}/${params.slug}`),
      priceCurrency: site.moneda,
      price: params.precio,
      availability: params.disponible
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ID_ORGANIZACION },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: site.areaDespacho.map((area) => ({
          "@type": "DefinedRegion",
          addressCountry: site.pais,
          addressRegion: area.codigo,
        })),
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: site.pais,
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 10,
        returnMethod: "https://schema.org/ReturnByMail",
        // El comprador cubre el envío de vuelta en un retracto (ver
        // /envios-y-devoluciones); "FreeReturn" no es cierto y no debe
        // declararse solo porque el valor por defecto de la librería lo sugiere.
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
      },
    },
  };
}
