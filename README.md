# MembriShop — landing page y topic cluster

Landing page de **membrishop.cl** en Next.js 16 (App Router) + Tailwind CSS v4 + TypeScript.
Todo el sitio se prerenderiza estático: 12 rutas, cero JavaScript de servidor en runtime.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción (verificado: 12/12 rutas estáticas)
npm run typecheck  # tsc --noEmit
```

Antes de arrancar, copia `.env.example` a `.env.local` y completa al menos
`NEXT_PUBLIC_WHATSAPP` (formato `569XXXXXXXX`, sin `+` ni espacios).

---

## 1. Estructura de archivos

```
membrishop-web/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    Layout global: fuentes, header, footer,
│   │   │                                 sticky CTA, JSON-LD de sitio, GA4
│   │   ├── page.tsx                      HOME  (hub del topic cluster)
│   │   ├── globals.css                   Tokens de Tailwind v4 (@theme) + base
│   │   ├── fonts.ts                      Poppins + Inter autoalojadas
│   │   ├── not-found.tsx                 404 con enlaces a las 3 categorías
│   │   ├── robots.ts                     → /robots.txt
│   │   ├── sitemap.ts                    → /sitemap.xml
│   │   ├── llms.txt/route.ts             → /llms.txt        (índice para IA)
│   │   ├── llms-full.txt/route.ts        → /llms-full.txt   (texto completo)
│   │   ├── icon.svg                      favicon (membrillo)
│   │   ├── actions/lead.ts               Server Actions: newsletter y contacto
│   │   ├── contacto/page.tsx             formulario de contacto
│   │   ├── mascotas/
│   │   │   ├── page.tsx                  PILAR 1
│   │   │   └── fuente-agua/page.tsx      ficha de producto (plantilla de nivel 3)
│   │   ├── tecnologia/page.tsx           PILAR 2
│   │   └── hogar-cocina/page.tsx         PILAR 3
│   │
│   ├── components/
│   │   ├── brand/Logo.tsx                Logo + isotipo (integración tipográfica)
│   │   ├── layout/{Header,Footer,Analytics}.tsx
│   │   ├── marketing/
│   │   │   ├── StickyCta.tsx             botón flotante WhatsApp (solo móvil)
│   │   │   ├── ShareButtons.tsx          compartir en redes + Web Share API
│   │   │   ├── {Category,Product}Card.tsx
│   │   │   ├── ImagenMarcador.tsx        placeholder con el nombre de archivo esperado
│   │   │   ├── LeadForm.tsx              formulario newsletter + contacto
│   │   │   └── TrustBar.tsx
│   │   ├── seo/{TldrBlock,FaqSection,Breadcrumbs,JsonLd}.tsx
│   │   ├── templates/CategoriaTemplate.tsx   plantilla compartida de los 3 pilares
│   │   └── ui/{CtaButton,Section,icons}.tsx
│   │
│   ├── content/
│   │   ├── clusters.ts                   ⭐ TODO el contenido de las 3 categorías
│   │   └── home.ts                       ⭐ copy de la Home
│   │
│   ├── db/
│   │   ├── schema.ts                     ⭐ tablas de Neon (fuente de verdad)
│   │   └── client.ts                     conexión Drizzle + @neondatabase/serverless
│   │
│   ├── lib/
│   │   ├── site.ts                       ⭐ dominio, contacto, WhatsApp, promesas
│   │   ├── seo.ts                        buildMetadata(): canonical + OG + robots
│   │   ├── schema.ts                     constructores de JSON-LD
│   │   ├── validaciones.ts               esquemas Zod de los formularios
│   │   └── formularios.ts                tipo y estado inicial compartidos
│   │
│   └── fonts/                            .woff2 autoalojados
│
├── public/
│   ├── humans.txt
│   └── images/                           aquí van las fotos de producto
│
├── db/schema.sql                         SQL listo para pegar en la consola de Neon
├── drizzle/                              migraciones generadas por drizzle-kit
├── drizzle.config.ts                     configuración de drizzle-kit
├── DESPLIEGUE.md                         guía paso a paso de Vercel + NIC Chile + GA4
├── next.config.ts                        redirects 301, headers, formatos de imagen
└── postcss.config.mjs                    @tailwindcss/postcss
```

**Los tres archivos que vas a tocar el 90 % del tiempo** son `src/lib/site.ts`,
`src/content/clusters.ts` y `src/content/home.ts`. El marcado no se toca para
cambiar textos, precios ni productos.

---

## 2. Sistema de diseño

No hay `tailwind.config.js`: Tailwind v4 define el tema en CSS con `@theme`, dentro
de `src/app/globals.css`. Ahí está la paleta **Membrillo natural**:

| Token | Hex | Uso |
|---|---|---|
| `verde-600` | `#1F5C3D` | verde membrillo — color principal, footer, CTA secundario |
| `verde-500` | `#2F7D4F` | verde hoja — hoja del logo, checks, foco |
| `oro-400` | `#E8A33D` | dorado — CTA principal, ruedas del carro |
| `oro-300` | `#F2C14E` | ámbar — fruto del membrillo, TL;DR |
| `cocido-500` | `#C15F3C` | membrillo cocido — tallo, acentos cálidos |
| `crema` | `#F6EFE2` | crema de marca — secciones alternas |
| `lienzo` | `#FAFAFB` | fondo base de página |
| `ink` / `ink-suave` | `#14201A` / `#4A5751` | titulares / cuerpo |

Cada color tiene escala 50–900, así que `bg-verde-50`, `text-oro-700`,
`border-crema` y demás funcionan como en cualquier proyecto Tailwind.

**Contraste**: el CTA principal es dorado con texto `ink` (8,9:1) y no dorado sobre
blanco, que se queda en 2,1:1 y reprueba WCAG AA. Lo mismo con el botón de
WhatsApp: texto oscuro sobre `#25D366`, no blanco.

**Tipografía**: Poppins (500/600/700) para titulares y logo, Inter variable para
texto. Van autoalojadas en `src/fonts/` vía `next/font/local`, no desde Google
Fonts: el build no depende de una CDN externa, no hay petición a terceros en
producción y desaparece el problema de consentimiento de Google Fonts en la UE.

**Logo**: `Logo.tsx` no es un ícono junto a un texto. El nombre es texto real y
sobre él se dibujan dos marcas — el membrillo en torno a la **o** (fruto detrás,
tallo y hoja encima) y las ruedas del carro bajo la **h**, cuyo asta hace de mango.
Todo en `em`, así que escala solo con el `font-size` del contenedor.

---

## 3. Reglas SEO on-page: dónde vive cada una

| Regla del brief | Implementación | Verificado |
|---|---|---|
| Intent resuelto en el primer párrafo | `intent` en `clusters.ts` / `intro` en `home.ts` | ✅ |
| Meta title y description únicos | `buildMetadata()` en cada `page.tsx` | ✅ 5/5 páginas |
| Un solo H1, distinto del meta title | `h1` separado de `metaTitle` en los datos | ✅ 5/5 |
| TL;DR justo después del H1 | `<TldrBlock>` como primer elemento tras el `<h1>` | ✅ 5/5 |
| CTA tras el primer párrafo | `<CtaButton>` inmediatamente después del `<p>` de intro | ✅ 5/5 |
| Jerarquía H1 → H2 → H3 estricta | sin saltos de nivel; el footer usa `<p>`, no `<h2>` | ✅ 5/5 |
| URLs sin stopwords | `/mascotas/fuente-agua`, `/mascotas/collar-gps` | ✅ |
| Máx. 3 listas/tablas por sección | máximo observado: 2 | ✅ |
| FAQ + `FAQPage` JSON-LD | `<FaqSection>` + `faqSchema()` | ✅ |
| Esquema de tienda | `OnlineStore` (ver §4) | ✅ |

Orden semántico fijo en las 5 páginas:

```
breadcrumb → H1 → TL;DR → primer párrafo (intent) → CTA → H2 … → FAQ → JSON-LD
```

Los meta titles se mantienen bajo 62 caracteres para que Google no los trunque;
las descriptions, entre 140 y 160.

---

## 4. Datos estructurados (JSON-LD)

Se emiten desde `src/lib/schema.ts`. Qué lleva cada página:

| Página | Esquemas |
|---|---|
| Todas (layout) | `OnlineStore`, `WebSite` |
| Home | `+ FAQPage`, `BreadcrumbList` |
| Categorías | `+ FAQPage`, `BreadcrumbList`, `ItemList` |
| Producto | `+ FAQPage`, `BreadcrumbList`, `Product` con `Offer` |

Tres decisiones que conviene que sepas, porque no son las obvias:

**a) `OnlineStore`, no `LocalBusiness`/`Store`.** Google recomienda explícitamente
el subtipo `OnlineStore` para sitios de ecommerce, y `LocalBusiness` exige
`address` — una dirección física que el cliente pueda visitar. MembriShop es 100 %
online, así que declarar `Store` con una dirección inventada sería marcado
engañoso. El constructor `storeSchema()` **ya está escrito** y se activa solo:
completa `site.direccionFisica` en `src/lib/site.ts` el día que tengas local y el
`Store` empieza a emitirse automáticamente, enlazado como `parentOrganization` de
la organización.

**b) El `FAQPage` ya no genera rich results.** Google retiró los resultados
enriquecidos de FAQ de la búsqueda el **7 de mayo de 2026** (cierre de un repliegue
que empezó en 2023, cuando los limitó a sitios de salud y gobierno). El marcado
sigue siendo válido, no penaliza, y **sí** lo aprovechan los motores de IA
(ChatGPT, Perplexity, resúmenes de IA) para extraer respuestas. Lo dejamos por eso
—estrategia GEO— no porque vaya a pintar un acordeón en la SERP. Si alguien te
vende "FAQ schema para rich snippets" en 2026, te está vendiendo humo.

**c) Sin `aggregateRating`.** Con 0 ventas no hay valoraciones que declarar.
Inventarlas es motivo de acción manual por spam de datos estructurados. Cuando
tengas reseñas reales y verificables, se agregan en `productoSchema()`.

---

## 5. Topic cluster y linkeado interno

```
                        HOME  (/)
                          │  hub: enlaza a las 3 categorías desde el hero,
                          │  la grilla de categorías y el footer
        ┌─────────────────┼─────────────────┐
   /mascotas         /tecnologia       /hogar-cocina      ← páginas pilar
        │                 │                 │             ← cada una enlaza a las
        │                 │                 │                otras dos (lateral)
   /mascotas/fuente-agua                                  ← nivel producto
   /mascotas/collar-gps          (pendientes de publicar)
   /mascotas/cepillo-autolimpiante
   /mascotas/comedero-interactivo
```

Cada nivel enlaza **hacia arriba** (breadcrumb + "Volver a…"), **hacia abajo**
(tarjetas de producto) y **hacia los lados** (categorías hermanas). El footer
repite el mapa completo, así que ninguna URL queda a más de dos clics de la home.

Las fichas con `publicado: false` en `clusters.ts` **no** se enlazan, **no** entran
al sitemap y se muestran como "próximamente": un enlace interno a un 404 gasta
crawl budget y erosiona confianza.

### Las dos banderas de cada producto

No son lo mismo y confundirlas produce 404 internos:

| Bandera | Significa | Controla |
|---|---|---|
| `publicado` | hay stock confirmado con proveedor nacional | precio visible y badge "Con stock" |
| `fichaPublicada` | existe `/categoria/slug` como página real | el enlace, el sitemap y el `ItemList` |

Un producto puede tener stock y todavía no tener ficha: se muestra con precio y
badge, pero sin enlace, y no entra al sitemap. Hoy los cuatro SKU de mascotas
tienen `publicado: true` y solo `fuente-agua` tiene `fichaPublicada: true`.

### Añadir un producto

1. En `src/content/clusters.ts`, agrega el objeto al array `pilares` de su categoría
   con `publicado: true, fichaPublicada: false`. El `slug` va sin stopwords ni
   conectores: `cama-ortopedica`, no `cama-para-perros`.
2. Crea `src/app/<categoria>/<slug>/page.tsx` copiando `mascotas/fuente-agua/page.tsx`.
3. Recién ahí pon `fichaPublicada: true`. Entra al sitemap y se enlaza solo.

---

## 6. Imágenes

Mientras no existan las fotos, `<ImagenMarcador>` dibuja un marcador con el nombre
de archivo esperado, así el brief de producción queda documentado en la propia web.

Convención (ya aplicada en `clusters.ts`): **kebab-case, sin stopwords, keyword
principal primero, sin el nombre de la marca salvo que aporte**.

| Archivo | `alt` | `title` |
|---|---|---|
| `fuente-agua-gatos-filtro-carbon.webp` | Fuente de agua para gatos con filtro de carbón activo y flujo continuo | Fuente de agua con filtro para gatos y perros pequeños |
| `collar-gps-perros-rastreo-tiempo-real.webp` | Collar GPS para perros con rastreo en tiempo real desde el celular | Collar GPS con rastreo en tiempo real para perros |
| `cepillo-autolimpiante-perros-gatos.webp` | Cepillo autolimpiante para perros y gatos con botón de expulsión de pelo | Cepillo autolimpiante para perros y gatos |
| `comedero-interactivo-lento-perros.webp` | Comedero interactivo antivoracidad con laberinto para perros y gatos | Comedero interactivo antivoracidad |

El `alt` describe la imagen para quien no la ve; el `title` es un rótulo corto.
No repitas el mismo texto en los dos: Google lo lee como relleno.

Cuando tengas las fotos, súbelas a `public/images/` con ese nombre exacto y cambia
`<ImagenMarcador>` por `<Image>` de `next/image` — el snippet está comentado dentro
del componente. Formato: WebP o AVIF, cuadradas de 1200×1200 para producto,
1200×630 para la imagen OG.

---

## 7. Archivos técnicos: robots, sitemap y llms

Los cuatro se generan desde código y comparten fuente con las páginas
(`content/clusters.ts`), así que **no se desactualizan**: agregas un producto y
los cuatro se actualizan solos en el siguiente build. Next los prerenderiza, o
sea que en producción se sirven como archivos estáticos.

| Ruta | Origen | Qué hace |
|---|---|---|
| `/robots.txt` | `src/app/robots.ts` | reglas de rastreo + sitemap |
| `/sitemap.xml` | `src/app/sitemap.ts` | solo URLs indexables |
| `/llms.txt` | `src/app/llms.txt/route.ts` | índice del sitio para IA |
| `/llms-full.txt` | `src/app/llms-full.txt/route.ts` | texto completo en un Markdown |

### robots.txt

Bloquea únicamente los espacios de URL **infinitos** —paginación (`/*/page/*`,
`/*?page=`, `/*&page=`), filtros, orden y búsqueda interna— más las rutas
transaccionales (`/carrito`, `/checkout`, `/cuenta`, `/gracias`). Todo lo demás
queda rastreable.

Los rastreadores de IA (`GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`,
`Google-Extended`) están permitidos a propósito, como contraparte de `llms.txt`.
Para cerrarles la puerta, cambia `PERMITIR_IA` a `false` en el archivo: la
constante invierte las cinco reglas de una vez.

> **Cambio respecto de la primera versión**: quité `utm_`, `fbclid` y `gclid` del
> `Disallow`. Bloquearlos suena bien pero es contraproducente: si Google no puede
> rastrear la URL con parámetros, tampoco puede leer su `rel=canonical`, y
> entonces no consolida las señales con la versión limpia. El síntoma típico es
> "Indexada aunque bloqueada por robots.txt" en Search Console. La consolidación
> la hace el canonical, que ya emiten todas las páginas.

### sitemap.xml

Solo entran páginas indexables: las fichas con `publicado: false` quedan fuera
hasta que existan. Un sitemap que apunta a un 404 aparece como error en Search
Console y erosiona confianza del rastreador.

`changeFrequency` y `priority` van incluidos porque el estándar los define, pero
**Google los ignora desde hace años**; se mantienen para otros rastreadores y
porque no cuestan nada. No esperes que muevan el ranking.

Cuando subas las fotos, pon `IMAGENES_DISPONIBLES = true` al inicio del archivo y
el sitemap empieza a declarar las imágenes de cada URL. Mientras no existan, no
se declaran: apuntar a archivos inexistentes solo genera errores de rastreo.

### llms.txt y llms-full.txt

`llms.txt` es el **índice**: nombre, resumen en blockquote, datos verificables de
la tienda, enlaces a categorías y productos, FAQ y notas para asistentes.
`llms-full.txt` es el **contenido entero** —H1, TL;DR, intro, productos,
criterios, tabla comparativa y FAQ de cada página— en un solo Markdown que un
modelo puede ingerir de una petición.

Ambos declaran explícitamente dos cosas que evitan que una IA invente:
qué productos están anunciados pero **no disponibles**, y que MembriShop **no
tiene valoraciones publicadas**.

> **Expectativa realista**: `llms.txt` es una convención propuesta
> (llmstxt.org), no un estándar adoptado. Ningún buscador ha confirmado
> públicamente que lo rastree. Trátalo como una apuesta barata —cuesta cero
> mantenerlo porque se genera solo— y no como un canal de tráfico. Lo que sí
> mueve la aguja hoy es que el HTML sea extraíble: encabezados limpios, FAQ
> presente en el HTML inicial (por eso el acordeón usa `<details>` y no
> JavaScript) y datos estructurados correctos.

> **Si además mantienes la tienda en Shopify**, ahí no puedes usar este archivo.
> Shopify genera su propio `robots.txt`; se personaliza creando la plantilla
> `templates/robots.txt.liquid` en el tema y agregando dentro del bloque
> `{% for group in robots.default_groups %}` las reglas extra, por ejemplo
> `{{ group.user_agent }}{% for rule in group.rules %}{{ rule }}{% endfor %}`
> más tus `Disallow: /collections/*?page=*`. El sitemap de Shopify vive en
> `/sitemap.xml` y no se edita.

---

## 8. Base de datos: Neon + Drizzle

Los formularios (newsletter y contacto) guardan en **Neon**, un Postgres
serverless. La cadena completa es:

```
LeadForm (cliente)  →  Server Action  →  Zod  →  Drizzle  →  Neon
```

### Puesta en marcha, en cuatro pasos

1. Crea un proyecto en [neon.tech](https://neon.tech) (región **sa-east-1**, São
   Paulo: es la más cercana a Chile y bajan unos 100 ms de latencia frente a
   us-east).
2. Copia la cadena de conexión **pooled** (la que lleva `-pooler` en el host) a
   `DATABASE_URL` en tu `.env.local`. Debe terminar en `?sslmode=require`.
3. Genera la sal del hash de IP y ponla en `LEAD_SALT`:
   ```bash
   openssl rand -hex 32
   ```
4. Crea las tablas. Dos caminos equivalentes:
   ```bash
   npm run db:migrate      # aplica /drizzle a Neon
   ```
   o pega `db/schema.sql` completo en el editor SQL de la consola de Neon.

Después, `npm run db:studio` abre un explorador visual para ver los registros
sin escribir SQL.

### Cómo está diseñado

**El sitio funciona sin base de datos.** `npm run build` y `npm run dev` corren
sin `DATABASE_URL`: el cliente se crea de forma perezosa y los formularios
responden "aún no está conectado, escríbenos por WhatsApp". Si el cliente se
creara al importar el módulo, no podrías ni compilar antes de tener Neon.

**Driver HTTP, no TCP.** `neon-http` hace una petición HTTP por consulta, sin
pool que mantener vivo entre invocaciones serverless. A cambio no soporta
transacciones interactivas; para un INSERT por formulario, sobra.

**La IP no se guarda en claro.** Se guarda `sha256(LEAD_SALT + ip)`. Sirve
igual para limitar abuso —la misma IP da el mismo hash— pero no permite
identificar a nadie ni cruzar la base con otras.

**Tres capas contra el spam**, en este orden: campo trampa (honeypot) fuera de
pantalla que un humano nunca ve; validación con Zod en el servidor; y un límite
de 5 envíos por IP cada 10 minutos, contado contra la propia tabla. Si algún día
necesitas algo más serio, mueve `superaLimite()` a Vercel KV: la firma no cambia.

**El honeypot no falla la validación a propósito.** Devuelve un éxito falso y
descarta el envío. Si fallara, el bot sabría que lo detectaste, y un humano
vería "revisa los datos marcados" sin ningún campo marcado.

### Las dos tablas

`subscribers` guarda el correo con un índice único sobre `lower(email)`, así que
"Ana@Gmail.com" y "ana@gmail.com" son el mismo suscriptor. Tiene estados
(`pendiente` → `activo` → `baja` / `rebotado`) validados por un CHECK en la base,
y un `unsubscribe_token` para el enlace de baja del pie de cada correo. Quien se
da de baja y vuelve se reactiva en vez de duplicarse.

`contacts` guarda el mensaje con estados (`nuevo` → `en_curso` → `respondido` /
`spam`), teléfono normalizado a E.164 y un índice por `(ip_hash, creado_en)` que
es justo el que usa el rate limit.

El final de `db/schema.sql` trae las consultas del día a día ya escritas:
suscriptores por origen, mensajes sin responder, marcar como respondido, dar de
baja.

### Si cambias el esquema

Edita `src/db/schema.ts` —nunca las tablas a mano en la consola de Neon— y
después:

```bash
npm run db:generate     # escribe la migración en /drizzle
npm run db:migrate      # la aplica
```

Si el archivo y la base se desincronizan, drizzle-kit genera migraciones que
borran columnas.

---

## 9. Despliegue, DNS y analítica

Está todo en **[DESPLIEGUE.md](./DESPLIEGUE.md)**: conectar GitHub con Vercel,
las variables de entorno una por una, los registros DNS en Cloudflare (con la
trampa de la nube naranja, que es donde se atasca la mitad de los despliegues) y
el alta del sitemap en Search Console.

La cadena del dominio es `NIC Chile (delegación) → Cloudflare (zona) → Vercel`,
con la tienda Shopify en `tienda.membrishop.cl` y el correo en Google Workspace,
todo conviviendo en la misma zona.

---

## 10. Lo que falta antes de lanzar

- [ ] **Fotos de producto** — el bloqueador real. 4 SKUs × 3 fotos mínimo.
- [ ] Número de WhatsApp definitivo en `NEXT_PUBLIC_WHATSAPP`.
- [x] ~~Imagen OG, apple-icon y logo PNG~~ — generados y en su sitio. Reemplázalos
      cuando tengas la versión final del logo; los nombres de archivo deben ser
      los mismos.
- [ ] URLs reales de Instagram, TikTok y Facebook en `site.redes` (hoy son
      supuestas; un `sameAs` que apunta a un perfil inexistente resta credibilidad).
- [ ] Páginas legales: términos, privacidad, cambios y devoluciones, despacho.
- [ ] Confirmar los plazos de despacho con el courier antes de prometerlos: están
      escritos en `site.promesas` y repetidos en las FAQ y en `llms.txt`.
- [ ] Precios reales de las 4 fichas (`precioDesde` en `clusters.ts`). El precio del
      JSON-LD debe coincidir con el visible o Google marca el producto como inválido.
- [ ] Fichas de `collar-gps`, `cepillo-autolimpiante` y `comedero-interactivo`.
      Hoy tienen stock pero no página: se muestran sin enlace hasta que existan.

Las menciones legales (10 días de retracto, garantía legal de 6 meses) reflejan la
Ley 19.496 tal como quedó tras la Ley 21.398, pero no soy abogado: confírmalas con
uno antes de publicarlas como compromiso comercial.
