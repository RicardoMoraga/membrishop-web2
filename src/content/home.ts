import type { Faq } from "@/content/clusters";

/**
 * Copy de la Home.
 * Se mantiene fuera del componente para que puedas iterar textos (y medir
 * variantes) sin tocar el marcado ni arriesgar la estructura semántica.
 */
export const home = {
  /* --- SEO: meta title ≠ H1 --------------------------------------------- */
  metaTitle: "MembriShop | Mascotas, Tecnología y Hogar con Stock en Chile",
  metaDescription:
    "Tienda online chilena con stock nacional: pet tech, tecnología y hogar-cocina. Despacho en 24–72 h hábiles en la Región Metropolitana, pago con MercadoPago y boleta electrónica.",

  h1: "Productos para tu mascota, tu tecnología y tu cocina, con stock real en Chile",

  /* --- TL;DR: va inmediatamente después del H1 --------------------------- */
  tldr: [
    "Todo lo que publicamos tiene stock físico en Chile: despachamos en la Región Metropolitana en 24–72 h hábiles.",
    "Tres categorías, catálogo corto y curado: mascotas, tecnología y hogar-cocina.",
    "No importamos desde AliExpress. Solo proveedores nacionales, con garantía y boleta.",
    "Dudas antes de comprar: te respondemos por WhatsApp en horario hábil.",
  ],

  /* --- Primer párrafo: resuelve el search intent, luego viene el CTA ----- */
  intro:
    "Si buscas dónde comprar online en Chile sin esperar un mes a que llegue el pedido, MembriShop es una tienda chilena que trabaja solo con proveedores con stock nacional. Eso significa despacho en 24 a 72 horas hábiles dentro de la Región Metropolitana, boleta electrónica, garantía que se responde acá y un catálogo corto en el que cada producto entró porque resuelve un problema concreto: mascotas, tecnología y hogar-cocina.",

  /** Rótulo en versalitas sobre el H1. */
  eyebrow: "Tienda chilena · 3 categorías",

  /**
   * Palabras del H1 que se resaltan con el marcador dorado. Tienen que
   * aparecer tal cual dentro de `h1`, si no el resaltado no encuentra dónde
   * aplicarse y la frase se pinta entera del color base.
   */
  destacadasH1: ["mascota", "tecnología", "cocina"],

  ctaPrincipal: "Ver productos con stock",
  ctaSecundario: "Preguntar por WhatsApp",

  /** Micro-garantías bajo los botones del hero. Cortas: van en una línea. */
  chips: ["Despacho en la Región Metropolitana", "Pago con MercadoPago", "10 días de retracto"],

  /** Cierre de la página, sobre el degradado de dulce de membrillo. */
  cierre: {
    titulo: "¿Listo para armar tu pedido?",
    texto:
      "Cuatro productos con stock hoy y dos categorías en apertura. Escríbenos por WhatsApp si tienes dudas antes de comprar, o déjanos tu correo y te avisamos cuando entre algo nuevo.",
  },

  diferenciadores: [
    {
      titulo: "Stock nacional, no importación",
      detalle:
        "Descartamos el sourcing desde AliExpress. Si el proveedor no tiene la unidad en Chile, el producto no se publica. Es la razón por la que el catálogo es corto.",
    },
    {
      titulo: "Catálogo curado por problema",
      detalle:
        "Cada producto entra respondiendo una pregunta: ¿qué problema medible resuelve? Si la respuesta es vaga, no entra.",
    },
    {
      titulo: "Postventa con nombre y cara",
      detalle:
        "Escribes por WhatsApp y responde una persona, no un formulario que nadie lee. Devoluciones dentro de los 10 días de retracto sin discusión.",
    },
  ],

  pasos: [
    {
      titulo: "Eliges y consultas",
      detalle:
        "Cada ficha dice medidas, compatibilidad y qué incluye. Si algo no queda claro, preguntas por WhatsApp antes de pagar.",
    },
    {
      titulo: "Pagas seguro",
      detalle:
        "MercadoPago, con tarjeta de crédito o débito. Recibes boleta electrónica en el correo.",
    },
    {
      titulo: "Recibes y sigues el envío",
      detalle:
        "Despachamos en 24–72 h hábiles dentro de la Región Metropolitana con courier y te enviamos el número de seguimiento apenas sale de bodega.",
    },
  ],

  faqs: [
    {
      pregunta: "¿MembriShop es una tienda chilena?",
      respuesta:
        "Sí. MembriShop opera desde Chile, factura en pesos chilenos con boleta electrónica y trabaja únicamente con proveedores que mantienen stock dentro del país.",
    },
    {
      pregunta: "¿A qué zonas despachan y cuánto demora?",
      respuesta:
        "Por ahora despachamos solo dentro de la Región Metropolitana, en 24 a 72 horas hábiles. Todavía no despachamos a otras regiones. El plazo empieza a correr cuando se confirma el pago, y recibes el número de seguimiento por correo.",
    },
    {
      pregunta: "¿Qué medios de pago aceptan?",
      respuesta:
        "MercadoPago, con tarjeta de crédito o débito. Todos los pagos se procesan en pesos chilenos.",
    },
    {
      pregunta: "¿Puedo devolver un producto si no me sirve?",
      respuesta:
        "Sí. Tienes 10 días corridos desde la recepción para ejercer el derecho a retracto de la Ley del Consumidor, con el producto sin uso y en su embalaje original. Además, todo producto cuenta con la garantía legal de 6 meses por fallas.",
    },
    {
      pregunta: "¿Por qué el catálogo tiene tan pocos productos?",
      respuesta:
        "Porque cada producto exige stock confirmado con proveedor nacional, repuestos disponibles y una unidad de prueba revisada antes de publicarse. Preferimos vender pocas cosas que funcionan a listar miles que no podemos responder.",
    },
    {
      pregunta: "¿Tienen tienda física para retirar?",
      respuesta:
        "No. MembriShop es una tienda 100 % online y todos los pedidos se despachan por courier a la dirección que indiques en la compra, dentro de la Región Metropolitana.",
    },
  ] satisfies Faq[],
} as const;
