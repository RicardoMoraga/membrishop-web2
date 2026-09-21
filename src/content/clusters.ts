/**
 * Topic cluster de MembriShop — modelo de catálogo rotativo.
 *
 * 9 SKUs totales: 1 producto CORE por nicho (semi-fijo, dura 1-2 meses) +
 * 2 productos TRENDING por nicho (rotan semanal/quincenalmente).
 * Todos son datos de ejemplo (placeholder) listos para reemplazar por productos reales.
 *
 * Arquitectura:  Home (hub)  →  3 páginas pilar de categoría  →  páginas de producto.
 */

export type Faq = {
  pregunta: string;
  respuesta: string;
};

export type Imagen = {
  archivo: string;
  alt: string;
  title: string;
};

export type Especificacion = { etiqueta: string; valor: string };

export type Pilar = {
  slug: string;
  nombre: string;
  gancho: string;
  problema: string;
  /** "core" = semi-fijo (1-2 meses). "trending" = rota semanal/quincenal. */
  tipo: "core" | "trending";
  /**
   * Precio de referencia para el render de respaldo. La fuente de verdad del
   * precio es Shopify: esto solo se muestra si la integración está caída, y
   * en ese caso la interfaz lo rotula como referencial.
   */
  precioDesde: number | null;
  imagen: Imagen;
  /** Galería completa: [0] fondo blanco, [1] lifestyle, [2] detalle, [3] contenido del paquete. */
  galeria: Imagen[];
  publicado: boolean;
  fichaPublicada: boolean;
  descripcionLarga: string[];
  especificaciones: Especificacion[];
  faqs: Faq[];
  /**
   * De dónde sale el pilar. "clusters" = escrito en este archivo (respaldo y
   * contenido editorial histórico). "shopify" = producto real de una colección
   * de Shopify, resuelto en tiempo de ejecución por `lib/catalogo.ts`.
   */
  origen?: "clusters" | "shopify";
  /** URL absoluta de la imagen principal en Shopify, si existe. */
  imagenUrl?: string | null;
};

export type Categoria = {
  slug: string;
  nombre: string;
  navLabel: string;
  emoji: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intent: string;
  tldr: string[];
  ctaTexto: string;
  keywordPrincipal: string;
  imagenHero: Imagen;
  pilares: Pilar[];
  criterios: { titulo: string; detalle: string }[];
  comparativa?: {
    titulo: string;
    columnas: string[];
    filas: string[][];
  };
  faqs: Faq[];
};

export const categorias: Categoria[] = [
  {
    slug: "mascotas",
    nombre: "Mascotas",
    navLabel: "Mascotas",
    emoji: "🐾",
    metaTitle: "Productos para Mascotas con Stock en Chile | MembriShop",
    metaDescription:
      "Pet tech con stock nacional: collar GPS, fuente de agua y cepillo autolimpiante. Despacho 24–72 h en la RM y pago con MercadoPago.",
    h1: "Pet tech que resuelve problemas reales de perros y gatos",
    intent:
      "Si buscas productos para mascotas en Chile sin esperar 30 días de envío, esta es la categoría: pet tech con stock nacional, despacho en 24 a 72 horas hábiles en la Región Metropolitana y boleta. Catálogo curado y rotativo — cuando algo se agota, cambia por otro producto igual de útil.",
    tldr: [
      "Stock físico en Chile: despacho en 24–72 h hábiles en la Región Metropolitana, no en semanas.",
      "Nuestro nicho estrella: la mitad de nuestra curaduría se enfoca acá.",
      "Catálogo rotativo: un producto core + dos en tendencia cada quincena.",
      "Pago con MercadoPago (tarjeta de crédito o débito), con boleta electrónica.",
    ],
    ctaTexto: "Ver productos con stock",
    keywordPrincipal: "productos para mascotas Chile",
    imagenHero: {
      archivo: "productos-mascotas-pet-tech-chile.webp",
      alt: "Collar GPS, fuente de agua y cepillo autolimpiante para mascotas",
      title: "Catálogo pet tech MembriShop con stock en Chile",
    },
    pilares: [
      {
        slug: "collar-gps",
        nombre: "Collar GPS con rastreo en tiempo real",
        gancho: "Sabes dónde está aunque salte la reja",
        problema: "Perros que se arrancan en fuegos artificiales o paseos sueltos.",
        tipo: "core",
        precioDesde: 39990,
        imagen: {
          archivo: "collar-gps-perros-rastreo-tiempo-real.webp",
          alt: "Collar GPS para perros con rastreo en tiempo real desde el celular",
          title: "Collar GPS con rastreo en tiempo real para perros",
        },
        galeria: [
          { archivo: "collar-gps-fondo-blanco.webp", alt: "Collar GPS para perros sobre fondo blanco", title: "Collar GPS MembriShop" },
          { archivo: "collar-gps-perro-paseo.webp", alt: "Perro paseando con collar GPS puesto", title: "Collar GPS en uso" },
          { archivo: "collar-gps-app-detalle.webp", alt: "Detalle de la app de rastreo del collar GPS", title: "App de rastreo en tiempo real" },
          { archivo: "collar-gps-contenido-caja.webp", alt: "Contenido de la caja del collar GPS: collar, cargador y manual", title: "Qué incluye el collar GPS" },
        ],
        publicado: true,
        // TODO: fichaPublicada debería ser `true` (es el producto "core" del
        // nicho), pero la página /mascotas/collar-gps todavía no existe en
        // el repo. Dejarlo en `true` sin la página genera un 404 real desde
        // el footer, la grilla de productos y el sitemap.xml. Vuelve a
        // `true` solo cuando exista `src/app/mascotas/collar-gps/page.tsx`.
        fichaPublicada: false,
        descripcionLarga: [
          "Rastreo en tiempo real desde una app en tu celular, con historial de recorridos y zona segura configurable: si tu perro sale del perímetro, te avisa al instante.",
          "Batería de hasta 7 días de uso normal, resistente a salpicaduras (IPX6), pensada para paseos, patio y escapes inesperados.",
          "Funciona con una SIM nano de cualquier operador chileno. No incluye plan; con datos básicos prepago es suficiente.",
        ],
        especificaciones: [
          { etiqueta: "Material", valor: "Nylon reforzado + carcasa policarbonato" },
          { etiqueta: "Batería", valor: "Hasta 7 días de uso normal" },
          { etiqueta: "Resistencia al agua", valor: "IPX6 (salpicaduras y lluvia)" },
          { etiqueta: "Compatibilidad", valor: "Perros desde 8 kg, cuello 30–55 cm" },
          { etiqueta: "Origen", valor: "Proveedor con stock en Santiago, Chile" },
        ],
        faqs: [
          { pregunta: "¿El collar GPS necesita chip o plan de datos?", respuesta: "Funciona con una SIM nano de cualquier operador chileno. No incluye plan; un prepago básico de datos es suficiente para el rastreo." },
          { pregunta: "¿Sirve para gatos?", respuesta: "Está diseñado para perros desde 8 kg. Para gatos recomendamos consultarnos por WhatsApp antes de comprar." },
        ],
      },
      {
        slug: "fuente-agua",
        nombre: "Fuente de agua con filtro",
        gancho: "Tu gato bebe hasta 3 veces más cuando el agua corre",
        problema: "Gatos que beben poco y terminan con problemas urinarios.",
        tipo: "trending",
        precioDesde: 24990,
        imagen: {
          archivo: "fuente-agua-gatos-filtro-carbon.webp",
          alt: "Fuente de agua para gatos con filtro de carbón activo y flujo continuo",
          title: "Fuente de agua con filtro para gatos y perros pequeños",
        },
        galeria: [
          { archivo: "fuente-agua-fondo-blanco.webp", alt: "Fuente de agua para gatos sobre fondo blanco", title: "Fuente de agua MembriShop" },
          { archivo: "fuente-agua-gato-bebiendo.webp", alt: "Gato bebiendo agua de la fuente con filtro", title: "Fuente de agua en uso" },
          { archivo: "fuente-agua-filtro-detalle.webp", alt: "Detalle del filtro de carbón activo de la fuente de agua", title: "Filtro de carbón activo" },
          { archivo: "fuente-agua-contenido-caja.webp", alt: "Contenido de la caja: fuente, filtro y cable USB", title: "Qué incluye la fuente de agua" },
        ],
        publicado: true,
        fichaPublicada: true,
        descripcionLarga: [
          "Flujo continuo y silencioso que estimula a gatos y perros pequeños a beber más agua durante el día, reduciendo el riesgo de problemas urinarios.",
          "Capacidad de 2,4 litros: alcanza para dos gatos o un perro pequeño durante unos tres días sin rellenar.",
          "Filtro de carbón activo reemplazable cada 3–4 semanas, disponible como repuesto en Chile.",
        ],
        especificaciones: [
          { etiqueta: "Capacidad", valor: "2,4 litros" },
          { etiqueta: "Material", valor: "Plástico libre de BPA" },
          { etiqueta: "Alimentación", valor: "USB 5V, motor ultrasilencioso" },
          { etiqueta: "Apto para", valor: "Gatos y perros hasta 15 kg" },
        ],
        faqs: [
          { pregunta: "¿Cada cuánto se cambia el filtro?", respuesta: "Cada 3 a 4 semanas con uso normal. Vendemos el repuesto por separado." },
          { pregunta: "¿Hace ruido?", respuesta: "El motor es ultrasilencioso, pensado para no espantar a gatos sensibles al sonido." },
        ],
      },
      {
        slug: "cepillo-autolimpiante",
        nombre: "Cepillo autolimpiante",
        gancho: "Un botón y el pelo se suelta solo",
        problema: "Pelo por toda la casa y cepillos imposibles de limpiar.",
        tipo: "trending",
        precioDesde: 12990,
        imagen: {
          archivo: "cepillo-autolimpiante-perros-gatos.webp",
          alt: "Cepillo autolimpiante para perros y gatos con botón de expulsión de pelo",
          title: "Cepillo autolimpiante para perros y gatos",
        },
        galeria: [
          { archivo: "cepillo-fondo-blanco.webp", alt: "Cepillo autolimpiante sobre fondo blanco", title: "Cepillo autolimpiante MembriShop" },
          { archivo: "cepillo-perro-cepillado.webp", alt: "Perro siendo cepillado con el cepillo autolimpiante", title: "Cepillo autolimpiante en uso" },
          { archivo: "cepillo-boton-detalle.webp", alt: "Detalle del botón de expulsión de pelo del cepillo", title: "Botón de expulsión de pelo" },
          { archivo: "cepillo-contenido-caja.webp", alt: "Contenido de la caja del cepillo autolimpiante", title: "Qué incluye el cepillo" },
        ],
        publicado: true,
        fichaPublicada: false,
        descripcionLarga: [
          "Cerdas finas de acero inoxidable que llegan hasta el pelaje interno sin lastimar la piel, ideal para perros y gatos de pelo corto o largo.",
          "Con un botón, las cerdas se retraen y sueltan todo el pelo acumulado de una vez: nada de tirar del cepillo con la mano.",
          "Mango ergonómico antideslizante, cómodo para sesiones largas de cepillado.",
        ],
        especificaciones: [
          { etiqueta: "Material cerdas", valor: "Acero inoxidable fino" },
          { etiqueta: "Mango", valor: "Antideslizante, ergonómico" },
          { etiqueta: "Apto para", valor: "Perros y gatos, pelo corto o largo" },
        ],
        faqs: [
          { pregunta: "¿Sirve para gatos de pelo largo?", respuesta: "Sí, las cerdas están pensadas para llegar al pelaje interno sin dañar la piel, tanto en pelo corto como largo." },
        ],
      },
    ],
    criterios: [
      { titulo: "Repuesto disponible en Chile", detalle: "Un filtro que no puedes reponer convierte el producto en basura en dos meses. Solo entra al catálogo lo que tiene recambio local." },
      { titulo: "Problema medible", detalle: "Cada producto ataca un síntoma que puedes verificar: litros bebidos, pelo suelto, ubicación en tiempo real." },
      { titulo: "Probado antes de publicarlo", detalle: "Nada se publica sin una unidad de muestra revisada. Si no pasa la prueba, no llega a la ficha." },
    ],
    comparativa: {
      titulo: "Cuál te sirve según el problema",
      columnas: ["Producto", "Para quién", "Problema que resuelve", "Requiere mantención"],
      filas: [
        ["Collar GPS", "Perros que se arrancan", "No saber dónde está tras un escape", "SIM con datos y carga semanal"],
        ["Fuente de agua", "Gatos y perros hasta 15 kg", "Bebe poco y arriesga problemas urinarios", "Filtro cada 3–4 semanas"],
        ["Cepillo autolimpiante", "Perros y gatos de pelo largo", "Pelo suelto por toda la casa", "Ninguna"],
      ],
    },
    faqs: [
      { pregunta: "¿Cuánto demora el despacho de productos para mascotas en Chile?", respuesta: "Entre 24 y 72 horas hábiles, dentro de la Región Metropolitana: por ahora no despachamos a otras regiones. Todo el catálogo de mascotas sale desde bodega en Chile, así que no hay esperas de importación." },
      { pregunta: "¿Puedo devolver un producto si no me sirve?", respuesta: "Sí. Tienes 10 días corridos desde la recepción para ejercer el derecho a retracto de la Ley del Consumidor, con el producto sin uso y en su embalaje original. Si el producto falla, cuenta además con la garantía legal de 6 meses." },
    ],
  },

  {
    slug: "tecnologia",
    nombre: "Tecnología",
    navLabel: "Tecnología",
    emoji: "💻",
    metaTitle: "Tecnología y Gadgets con Despacho en Santiago | MembriShop",
    metaDescription:
      "Gadgets tecnológicos con stock en Chile: cámara de seguridad, cargador magnético y audífonos inalámbricos. Despacho 24–72 h hábiles en la RM.",
    h1: "Gadgets que sí usas todos los días",
    intent:
      "Si buscas gadgets de tecnología en Chile y te cansaste de comprar cosas que llegan en un mes y fallan a los tres, esta categoría es una selección corta y verificada: seguridad del hogar, carga y audio, con stock nacional y garantía respondida acá.",
    tldr: [
      "Selección corta a propósito: seguridad, carga y audio, no un catálogo genérico.",
      "Garantía gestionada en Chile, sin trámites con vendedores extranjeros.",
      "Catálogo rotativo: un producto core + dos en tendencia cada quincena.",
      "Despacho en 24–72 h hábiles en la Región Metropolitana, con boleta electrónica.",
    ],
    ctaTexto: "Ver productos con stock",
    keywordPrincipal: "gadgets tecnología Chile",
    imagenHero: {
      archivo: "gadgets-tecnologia-camara-carga-audio-chile.webp",
      alt: "Cámara de seguridad, cargador magnético y audífonos inalámbricos con stock en Chile",
      title: "Categoría de tecnología MembriShop",
    },
    pilares: [
      {
        slug: "camara-seguridad",
        nombre: "Cámara de seguridad wifi",
        gancho: "Ves tu casa desde el celular, sin instalación",
        problema: "Querer vigilar la casa sin contratar un sistema completo.",
        tipo: "core",
        precioDesde: 34990,
        imagen: {
          archivo: "camara-seguridad-wifi-interior-hogar.webp",
          alt: "Cámara de seguridad wifi de interior con visión nocturna",
          title: "Cámara de seguridad wifi para el hogar",
        },
        galeria: [
          { archivo: "camara-fondo-blanco.webp", alt: "Cámara de seguridad wifi sobre fondo blanco", title: "Cámara de seguridad MembriShop" },
          { archivo: "camara-hogar-instalada.webp", alt: "Cámara de seguridad instalada en un living", title: "Cámara de seguridad en uso" },
          { archivo: "camara-app-deteccion.webp", alt: "Detalle de la app con detección de movimiento", title: "Detección de movimiento en la app" },
          { archivo: "camara-contenido-caja.webp", alt: "Contenido de la caja: cámara, soporte y cable", title: "Qué incluye la cámara de seguridad" },
        ],
        publicado: true,
        // TODO: mismo caso que collar-gps — falta
        // src/app/tecnologia/camara-seguridad/page.tsx antes de volver a `true`.
        fichaPublicada: false,
        descripcionLarga: [
          "Visión nocturna hasta 10 metros, detección de movimiento con notificación instantánea al celular y audio bidireccional para hablar a distancia.",
          "Configuración por wifi en menos de 5 minutos, sin cables adicionales ni instalación profesional.",
          "Grabación en la nube opcional (plan aparte) o en tarjeta microSD local, hasta 128 GB.",
        ],
        especificaciones: [
          { etiqueta: "Resolución", valor: "1080p Full HD" },
          { etiqueta: "Visión nocturna", valor: "Hasta 10 metros" },
          { etiqueta: "Conectividad", valor: "Wifi 2.4 GHz" },
          { etiqueta: "Almacenamiento", valor: "MicroSD hasta 128 GB (no incluida)" },
        ],
        faqs: [
          { pregunta: "¿Necesito internet para usarla?", respuesta: "Sí, requiere conexión wifi de 2.4 GHz en el hogar para funcionar y enviar notificaciones." },
          { pregunta: "¿Tiene costo mensual?", respuesta: "No es obligatorio. La grabación local en microSD es gratuita; la nube es un plan opcional del fabricante." },
        ],
      },
      {
        slug: "cargador-magnetico",
        nombre: "Cargador magnético inalámbrico",
        gancho: "Se pega, carga y no te quedas sin cable",
        problema: "Cables que se pelan y celulares a 8 % en el peor momento.",
        tipo: "trending",
        precioDesde: 17990,
        imagen: {
          archivo: "cargador-magnetico-inalambrico-celular.webp",
          alt: "Cargador magnético inalámbrico compatible con celulares MagSafe",
          title: "Cargador magnético inalámbrico",
        },
        galeria: [
          { archivo: "cargador-fondo-blanco.webp", alt: "Cargador magnético inalámbrico sobre fondo blanco", title: "Cargador magnético MembriShop" },
          { archivo: "cargador-celular-cargando.webp", alt: "Celular cargando con el cargador magnético", title: "Cargador magnético en uso" },
          { archivo: "cargador-base-detalle.webp", alt: "Detalle de la base magnética del cargador", title: "Base magnética de carga" },
          { archivo: "cargador-contenido-caja.webp", alt: "Contenido de la caja: cargador y cable USB-C", title: "Qué incluye el cargador magnético" },
        ],
        publicado: true,
        fichaPublicada: false,
        descripcionLarga: [
          "Compatible con celulares con carga inalámbrica MagSafe y Qi estándar, se alinea solo por imán y carga hasta 15W.",
          "Base antideslizante para escritorio o velador, cable USB-C incluido de 1.2 metros.",
        ],
        especificaciones: [
          { etiqueta: "Potencia", valor: "Hasta 15W" },
          { etiqueta: "Compatibilidad", valor: "MagSafe y Qi estándar" },
          { etiqueta: "Cable incluido", valor: "USB-C, 1.2 m" },
        ],
        faqs: [
          { pregunta: "¿Funciona con cualquier celular?", respuesta: "Funciona con cualquier celular compatible con carga inalámbrica Qi; con imán se alinea automáticamente en modelos MagSafe." },
        ],
      },
      {
        slug: "audifonos-inalambricos",
        nombre: "Audífonos inalámbricos",
        gancho: "Batería real de jornada completa",
        problema: "Audífonos baratos que duran dos horas y se despareja el canal.",
        tipo: "trending",
        precioDesde: 22990,
        imagen: {
          archivo: "audifonos-inalambricos-bluetooth-bateria.webp",
          alt: "Audífonos inalámbricos bluetooth con estuche de carga",
          title: "Audífonos inalámbricos con estuche de carga",
        },
        galeria: [
          { archivo: "audifonos-fondo-blanco.webp", alt: "Audífonos inalámbricos sobre fondo blanco", title: "Audífonos inalámbricos MembriShop" },
          { archivo: "audifonos-uso-persona.webp", alt: "Persona usando los audífonos inalámbricos", title: "Audífonos inalámbricos en uso" },
          { archivo: "audifonos-estuche-detalle.webp", alt: "Detalle del estuche de carga de los audífonos", title: "Estuche de carga" },
          { archivo: "audifonos-contenido-caja.webp", alt: "Contenido de la caja: audífonos, estuche y cable", title: "Qué incluye los audífonos" },
        ],
        publicado: true,
        fichaPublicada: false,
        descripcionLarga: [
          "Hasta 6 horas de reproducción continua y 24 horas totales con el estuche de carga incluido.",
          "Conexión bluetooth 5.3 estable, con emparejamiento automático y control táctil.",
        ],
        especificaciones: [
          { etiqueta: "Batería", valor: "6 h + 24 h con estuche" },
          { etiqueta: "Bluetooth", valor: "5.3" },
          { etiqueta: "Resistencia", valor: "IPX4 (sudor y lluvia ligera)" },
        ],
        faqs: [
          { pregunta: "¿Sirven para hacer ejercicio?", respuesta: "Sí, tienen resistencia IPX4 que soporta sudor y lluvia ligera." },
        ],
      },
    ],
    criterios: [
      { titulo: "Garantía que se responde acá", detalle: "Si falla, el trámite es con nosotros y con un proveedor chileno. Sin reclamos a plataformas extranjeras." },
      { titulo: "Compatibilidad declarada", detalle: "Cada ficha dirá con qué modelos funciona y con cuáles no. Preferimos perder una venta a procesar una devolución." },
      { titulo: "Sin gama de entrada desechable", detalle: "No listamos el modelo más barato del mercado si su vida útil es de meses." },
    ],
    faqs: [
      { pregunta: "¿Los productos tienen garantía en Chile?", respuesta: "Sí. Todo lo que publicamos tiene garantía legal de 6 meses según la Ley del Consumidor, gestionada con MembriShop." },
      { pregunta: "¿Venden productos importados desde AliExpress?", respuesta: "No. MembriShop trabaja solo con proveedores que tienen stock físico en Chile." },
    ],
  },

  {
    slug: "hogar-cocina",
    nombre: "Hogar y Cocina",
    navLabel: "Hogar & Cocina",
    emoji: "🏠",
    metaTitle: "Hogar y Cocina: Utensilios Prácticos en Chile | MembriShop",
    metaDescription:
      "Utensilios y organización para casa y cocina con stock en Chile. Despacho 24–72 h hábiles en la RM y pago con MercadoPago.",
    h1: "Soluciones simples para ordenar y cocinar mejor en casa",
    intent:
      "Si buscas utensilios de cocina y organización para la casa en Chile, acá encuentras una selección corta enfocada en una sola pregunta: ¿este producto te ahorra tiempo cada semana o va a terminar guardado en un cajón? Publicamos solo lo que pasa esa prueba.",
    tldr: [
      "El filtro de entrada es el ahorro de tiempo semanal, no la novedad del producto.",
      "Tres líneas: organización, preparación de alimentos y limpieza rápida.",
      "Catálogo rotativo: un producto core + dos en tendencia cada quincena.",
      "Stock en Chile y boleta electrónica en cada compra.",
    ],
    ctaTexto: "Ver productos con stock",
    keywordPrincipal: "utensilios cocina hogar Chile",
    imagenHero: {
      archivo: "utensilios-cocina-organizacion-hogar-chile.webp",
      alt: "Organizador modular, picador manual y escurridor plegable con stock en Chile",
      title: "Categoría de hogar y cocina MembriShop",
    },
    pilares: [
      {
        slug: "organizador-modular",
        nombre: "Organizador modular de despensa",
        gancho: "Ves lo que tienes antes de volver a comprarlo",
        problema: "Despensas donde todo se pierde y se compra duplicado.",
        tipo: "core",
        precioDesde: 29990,
        imagen: {
          archivo: "organizador-modular-despensa-cocina.webp",
          alt: "Organizador modular apilable para despensa de cocina",
          title: "Organizador modular de despensa",
        },
        galeria: [
          { archivo: "organizador-fondo-blanco.webp", alt: "Organizador modular sobre fondo blanco", title: "Organizador modular MembriShop" },
          { archivo: "organizador-despensa-instalado.webp", alt: "Organizador modular instalado en una despensa", title: "Organizador modular en uso" },
          { archivo: "organizador-apilable-detalle.webp", alt: "Detalle del sistema apilable del organizador", title: "Sistema apilable" },
          { archivo: "organizador-contenido-caja.webp", alt: "Contenido de la caja: set de organizadores modulares", title: "Qué incluye el organizador" },
        ],
        publicado: true,
        // TODO: mismo caso — falta
        // src/app/hogar-cocina/organizador-modular/page.tsx antes de volver a `true`.
        fichaPublicada: false,
        descripcionLarga: [
          "Set de contenedores modulares apilables y transparentes que se ajustan al espacio real de tu despensa, con tapas herméticas para mantener la frescura.",
          "Etiquetas removibles incluidas para identificar cada contenido de un vistazo.",
        ],
        especificaciones: [
          { etiqueta: "Material", valor: "Plástico BPA free, transparente" },
          { etiqueta: "Piezas", valor: "Set de 6 contenedores + etiquetas" },
          { etiqueta: "Apto lavavajillas", valor: "Sí" },
        ],
        faqs: [
          { pregunta: "¿Son aptos para lavavajillas?", respuesta: "Sí, todas las piezas son aptas para lavavajillas y libres de BPA." },
        ],
      },
      {
        slug: "picador-manual",
        nombre: "Picador manual de verduras",
        gancho: "Sofrito listo en 20 segundos, sin llorar",
        problema: "Picar cebolla y ajo todos los días quita 10 minutos por comida.",
        tipo: "trending",
        precioDesde: 14990,
        imagen: {
          archivo: "picador-manual-verduras-cocina.webp",
          alt: "Picador manual de verduras con cuerda para cebolla y ajo",
          title: "Picador manual de verduras",
        },
        galeria: [
          { archivo: "picador-fondo-blanco.webp", alt: "Picador manual de verduras sobre fondo blanco", title: "Picador manual MembriShop" },
          { archivo: "picador-cebolla-uso.webp", alt: "Picador manual picando cebolla", title: "Picador manual en uso" },
          { archivo: "picador-cuchillas-detalle.webp", alt: "Detalle de las cuchillas del picador manual", title: "Cuchillas de acero inoxidable" },
          { archivo: "picador-contenido-caja.webp", alt: "Contenido de la caja del picador manual", title: "Qué incluye el picador manual" },
        ],
        publicado: true,
        fichaPublicada: false,
        descripcionLarga: [
          "Sistema de cuerda que acciona 3 cuchillas de acero inoxidable: pica cebolla, ajo o verduras en segundos, sin electricidad ni pilas.",
          "Base antideslizante y depósito transparente que se lava en el lavaplatos.",
        ],
        especificaciones: [
          { etiqueta: "Cuchillas", valor: "Acero inoxidable, sistema de cuerda" },
          { etiqueta: "Capacidad", valor: "500 ml" },
          { etiqueta: "Apto lavavajillas", valor: "Sí (depósito y tapa)" },
        ],
        faqs: [
          { pregunta: "¿Sirve para frutos secos?", respuesta: "Sí, funciona bien con frutos secos, verduras firmes y hierbas." },
        ],
      },
      {
        slug: "escurridor-plegable",
        nombre: "Escurridor plegable sobre lavaplatos",
        gancho: "Recupera el mesón cuando no lo estás usando",
        problema: "Cocinas chicas donde el escurridor ocupa medio mesón.",
        tipo: "trending",
        precioDesde: 19990,
        imagen: {
          archivo: "escurridor-plegable-lavaplatos-cocina.webp",
          alt: "Escurridor plegable enrollable para instalar sobre el lavaplatos",
          title: "Escurridor plegable sobre lavaplatos",
        },
        galeria: [
          { archivo: "escurridor-fondo-blanco.webp", alt: "Escurridor plegable sobre fondo blanco", title: "Escurridor plegable MembriShop" },
          { archivo: "escurridor-lavaplatos-instalado.webp", alt: "Escurridor plegable instalado sobre el lavaplatos", title: "Escurridor plegable en uso" },
          { archivo: "escurridor-enrollado-detalle.webp", alt: "Detalle del escurridor enrollado para guardar", title: "Se enrolla para guardar" },
          { archivo: "escurridor-contenido-caja.webp", alt: "Contenido de la caja del escurridor plegable", title: "Qué incluye el escurridor" },
        ],
        publicado: true,
        fichaPublicada: false,
        descripcionLarga: [
          "Se instala sobre el lavaplatos y se enrolla en segundos cuando no lo necesitas, liberando todo el mesón.",
          "Varillas de acero inoxidable recubiertas en silicona, resistentes a la humedad y fáciles de limpiar.",
        ],
        especificaciones: [
          { etiqueta: "Material", valor: "Acero inoxidable + silicona" },
          { etiqueta: "Dimensiones", valor: "Ajustable, hasta 45 cm" },
          { etiqueta: "Instalación", valor: "Sin herramientas" },
        ],
        faqs: [
          { pregunta: "¿Se puede cortar a medida?", respuesta: "Las varillas son ajustables y se acomodan a lavaplatos de distinto ancho sin necesidad de cortarlas." },
        ],
      },
    ],
    criterios: [
      { titulo: "Ahorra tiempo medible", detalle: "Si no puedes describir cuántos minutos por semana recupera, no entra al catálogo." },
      { titulo: "Se limpia fácil", detalle: "Priorizamos piezas desmontables y aptas para lavavajillas." },
      { titulo: "Ocupa poco", detalle: "Pensado para cocinas chilenas reales: departamentos chicos y mesones cortos." },
    ],
    faqs: [
      { pregunta: "¿Hacen despacho de productos de cocina a regiones?", respuesta: "Por ahora no: despachamos solo dentro de la Región Metropolitana, mediante courier, en 24–72 h hábiles." },
      { pregunta: "¿Los productos de cocina son aptos para lavavajillas?", respuesta: "Cada ficha lo indica explícitamente; priorizamos piezas desmontables y aptas para lavavajillas." },
    ],
  },
];

export function getCategoria(slug: string): Categoria | undefined {
  return categorias.find((c) => c.slug === slug);
}

export function getPilar(categoriaSlug: string, pilarSlug: string) {
  const categoria = getCategoria(categoriaSlug);
  const pilar = categoria?.pilares.find((p) => p.slug === pilarSlug);
  return pilar && categoria ? { categoria, pilar } : undefined;
}

export function categoriasHermanas(slugActual: string): Categoria[] {
  return categorias.filter((c) => c.slug !== slugActual);
}

/** Todos los productos publicados, en todas las categorías (para grillas de home). */
export function todosLosPilares(): { categoria: Categoria; pilar: Pilar }[] {
  return categorias.flatMap((categoria) => categoria.pilares.map((pilar) => ({ categoria, pilar })));
}

export function rutasIndexables(): string[] {
  const rutas = ["/", ...categorias.map((c) => `/${c.slug}`)];
  for (const categoria of categorias) {
    for (const pilar of categoria.pilares) {
      if (pilar.fichaPublicada) rutas.push(`/${categoria.slug}/${pilar.slug}`);
    }
  }
  return rutas;
}
