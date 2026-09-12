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

  /** Zonas de despacho reales. Se usan en el JSON-LD (areaServed). */
  areaDespacho: ["Chile"],

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
   */
  zonasDespacho: [
    {
      zona: "Región Metropolitana",
      plazo: "24 a 72 h hábiles",
      nota: "Retiro del courier el mismo día si el pago se confirma antes de las 14:00.",
    },
    {
      zona: "Valparaíso y O'Higgins",
      plazo: "2 a 3 días hábiles",
      nota: "Incluye Viña del Mar, Quilpué y Rancagua.",
    },
    {
      zona: "Resto del país",
      plazo: "3 a 5 días hábiles",
      nota: "Desde Coquimbo hasta Los Lagos, por carretera.",
    },
    {
      zona: "Zonas extremas e islas",
      plazo: "5 a 8 días hábiles",
      nota: "Arica, Aysén, Magallanes, Chiloé y Juan Fernández pueden tener recargo.",
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
    despacho: "Despacho en 24–72 h hábiles a todo Chile",
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
