/**
 * Configuración central de MembriShop.
 * Fuente única de verdad para dominio, contacto y datos de negocio.
 * Cambia algo aquí y se propaga a metadata, JSON-LD, sitemap y CTAs.
 */

export const site = {
  nombre: "MembriShop",
  nombreLegal: "MembriShop SpA",
  /** Sin barra final. Necesario para canonicals y sitemap absolutos. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://membrishop.cl").replace(/\/$/, ""),
  descripcionCorta:
    "Tienda online chilena de productos para mascotas, tecnología y hogar-cocina con stock nacional.",
  idioma: "es-CL",
  locale: "es_CL",
  pais: "CL",
  moneda: "CLP",

  contacto: {
    email: "contacto@membrishop.cl",
    /** Formato internacional sin +, espacios ni guiones. Chile: 569XXXXXXXX */
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "56974872226",
    mensajeWhatsapp:
      "Hola MembriShop 👋 Vengo desde la web y quiero consultar por un producto.",
    horario: "Lunes a viernes, 09:00–19:00 (hora de Chile continental)",
  },

  /**
   * Solo online: no hay local con atención de público.
   * Si algún día abres tienda física, completa este objeto y `schema.ts`
   * empezará a emitir LocalBusiness/Store además de OnlineStore.
   */
  direccionFisica: null as null | {
    calle: string;
    ciudad: string;
    region: string;
    codigoPostal: string;
    latitud: number;
    longitud: number;
  },

  /**
   * Zonas de despacho reales. Se usan en el JSON-LD (areaServed).
   * Desde 2026-09-16 solo se despacha dentro de la Región Metropolitana.
   * `codigo` es la subdivisión ISO 3166-2 sin el prefijo del país (CL-RM).
   */
  areaDespacho: [{ nombre: "Región Metropolitana de Santiago", codigo: "RM" }],

  redes: {
    instagram: "https://www.instagram.com/membrishop",
    tiktok: "https://www.tiktok.com/@membrishop",
    facebook: "https://www.facebook.com/membrishop",
  },

  analytics: {
    ga4: process.env.NEXT_PUBLIC_GA_ID ?? "",
    gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "",
  },

  /**
   * Medios de pago y couriers que se muestran en el footer.
   * Son texto, no logos: usar las marcas registradas de un tercero en tu web
   * requiere su autorización, y los kits de marca de Webpay o Chilexpress no
   * son de uso libre. Cuando tengas el permiso, cambia las píldoras por sus
   * SVG oficiales.
   */
  /**
   * Plazos por zona. Son promesas comerciales: confírmalas con el courier
   * antes de publicarlas, porque también viajan al llms.txt y a las FAQ.
   * Para abrir una región nueva, agrégala aquí y en `areaDespacho`.
   */
  zonasDespacho: [
    {
      zona: "Región Metropolitana",
      plazo: "24 a 72 h hábiles",
      nota: "Plazo estimado del courier, en días hábiles, desde que se confirma el pago.",
    },
  ],

  /**
   * Solo medios de pago verificados como configurados en la tienda Shopify
   * conectada (fyvfjt-vm.myshopify.com): Mercado Pago con tarjetas de crédito
   * y débito. Webpay y transferencia NO están confirmados ahí — anunciarlos
   * sin tenerlos activos es una promesa que el checkout no cumple. Si más
   * adelante se activan en Shopify, se agregan aquí y se propagan solos a
   * footer, llms.txt y JSON-LD.
   */
  mediosPago: ["MercadoPago", "Tarjeta de crédito", "Tarjeta de débito"],
  couriers: ["Chilexpress", "Starken", "Blue Express", "Correos de Chile"],

  /** Promesas comerciales. Cámbialas solo si puedes cumplirlas. */
  promesas: {
    despacho: "Despacho en 24–72 h hábiles en la Región Metropolitana",
    cobertura: "Despacho solo en la Región Metropolitana",
    garantia: "Garantía legal de 6 meses",
    stock: "Stock en Chile: sin esperas de 30 días",
    pago: "Pago seguro con MercadoPago, tarjeta de crédito o débito",
    retracto: "10 días para arrepentirte, según la Ley del Consumidor",
  },
} as const;

/** URL absoluta a partir de una ruta interna. Úsala siempre para canonicals. */
export function urlAbsoluta(ruta = "/"): string {
  return `${site.url}${ruta.startsWith("/") ? ruta : `/${ruta}`}`;
}

/** Link de WhatsApp con mensaje prellenado y contexto de la página. */
export function linkWhatsapp(contexto?: string): string {
  const texto = contexto
    ? `${site.contacto.mensajeWhatsapp} (${contexto})`
    : site.contacto.mensajeWhatsapp;
  return `https://wa.me/${site.contacto.whatsapp}?text=${encodeURIComponent(texto)}`;
}
