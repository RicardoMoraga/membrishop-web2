# Desplegar MembriShop: Vercel + NIC Chile + Google

Guía de una sola pasada. El orden importa: cada paso depende del anterior.
Tiempo real: unos 40 minutos de trabajo, más la espera de propagación del DNS.

Antes de partir necesitas: cuenta de GitHub, cuenta de Vercel (el plan Hobby
alcanza de sobra) y el proyecto de Neon creado. El dominio `membrishop.cl` ya
está inscrito en NIC Chile y su zona DNS ya está en Cloudflare, así que el paso 4
es agregar registros, no delegar de nuevo.

---

## 1. Subir el proyecto a GitHub

En la carpeta del proyecto:

```bash
git init
git add .
git commit -m "MembriShop: landing, topic cluster SEO y captura de leads"
git branch -M main
```

Crea el repositorio **privado** en GitHub (github.com/new, sin README ni
.gitignore: ya los tienes) y súbelo:

```bash
git remote add origin https://github.com/TU-USUARIO/membrishop-web.git
git push -u origin main
```

Verifica que `.env.local` **no** aparezca en GitHub. El `.gitignore` ya lo
excluye, pero míralo: es el error que más caro sale, porque publica la cadena de
conexión de tu base de datos.

---

## 2. Conectar el repositorio con Vercel

1. En [vercel.com/new](https://vercel.com/new), **Import Git Repository**. La
   primera vez GitHub te pide autorizar la app de Vercel: puedes darle acceso a
   todos los repos o solo a `membrishop-web` (mejor solo a ese).
2. Elige `membrishop-web` → **Import**.
3. Vercel detecta Next.js solo. **No toques** Build Command, Output Directory ni
   Install Command: los valores automáticos son los correctos.
4. Antes de darle Deploy, despliega **Environment Variables** y carga las del
   paso 3. Si haces el primer deploy sin ellas, no se rompe nada —el sitio está
   diseñado para funcionar sin base de datos— pero los formularios responderán
   "aún no conectado" hasta que las agregues y vuelvas a desplegar.
5. **Deploy**. El primer build tarda 1–2 minutos y te deja una URL
   `membrishop-web.vercel.app` funcionando.

Desde ese momento: cada `git push` a `main` publica a producción, y cada push a
otra rama genera una URL de preview propia. No hay que volver a tocar Vercel.

---

## 3. Variables de entorno

**Settings → Environment Variables**. Márcalas todas para los tres entornos
(Production, Preview, Development) salvo donde se diga lo contrario.

| Variable | Valor | Notas |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://membrishop.cl` | Sin barra final. De aquí salen todos los canonical, el sitemap y el JSON-LD. Si queda mal, el SEO apunta a un dominio equivocado. |
| `NEXT_PUBLIC_WHATSAPP` | `569XXXXXXXX` | Solo dígitos: sin `+`, sin espacios, sin guiones. |
| `DATABASE_URL` | cadena **pooled** de Neon | Márcala como **Sensitive**. La pooled es la que lleva `-pooler` en el host y termina en `?sslmode=require`. |
| `LEAD_SALT` | `openssl rand -hex 32` | También **Sensitive**. Solo Production y Preview. |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Solo **Production**. Así tus pruebas en preview no ensucian los datos. |
| `NEXT_PUBLIC_GSC_VERIFICATION` | valor del `content` de la meta | Solo si verificas por etiqueta HTML en vez de DNS. |

Dos cosas que se olvidan siempre:

- Las variables **no se aplican solas**. Después de agregarlas hay que
  redesplegar: **Deployments → el último → ⋯ → Redeploy**.
- Las que empiezan con `NEXT_PUBLIC_` viajan al navegador y son públicas. Nunca
  pongas ahí la `DATABASE_URL` ni la `LEAD_SALT`.

### Neon: usa la integración si puedes

En **Vercel → Integrations → Neon**, conectar el proyecto inyecta `DATABASE_URL`
automáticamente y la mantiene sincronizada si rotas credenciales. Es menos
trabajo y menos margen de error que copiarla a mano.

---

## 4. DNS: NIC Chile → Cloudflare → Vercel

Tu configuración ya está decidida y es la correcta: **NIC Chile guarda solo la
delegación** (los nameservers) y **Cloudflare administra la zona** (todos los
registros). Vercel nunca toca tu DNS: solo recibe el tráfico que Cloudflare le
manda.

```
NIC Chile          Cloudflare              destino
(delegación)       (zona: A, CNAME, MX)
membrishop.cl  →   ns.cloudflare.com   →   @      A/CNAME  → Vercel   (landing)
                                           www    CNAME    → Vercel   (redirect)
                                           tienda CNAME    → Shopify  (tienda)
                                           MX              → Google Workspace
```

### 4.1 Agregar el dominio en Vercel

1. **Settings → Domains → Add**, escribe `membrishop.cl`.
2. Elige la configuración **por registros DNS**, no por nameservers: tu zona vive
   en Cloudflare.
3. Vercel te muestra el registro `A` para el ápice y el `CNAME` para `www`.
   **Anota exactamente esos valores**: se asignan por proyecto y no siempre son
   los genéricos (`76.76.21.21` / `cname.vercel-dns.com`).
4. Agrega también `www.membrishop.cl` y márcalo como **redirect a
   membrishop.cl**. Una sola versión canónica; la otra con 301.

### 4.2 Crear los registros en Cloudflare

En **Cloudflare → membrishop.cl → DNS → Records**:

| Tipo | Nombre | Contenido | Proxy | TTL |
|---|---|---|---|---|
| `A` | `@` | la IP que muestre Vercel | **DNS only** (nube gris) | Auto |
| `CNAME` | `www` | el destino que muestre Vercel | **DNS only** (nube gris) | Auto |

> ### ⚠️ La nube tiene que estar GRIS
>
> Es el error que más tiempo cuesta depurar. Si dejas el proxy naranja activado
> sobre un dominio de Vercel, Cloudflare intercepta el tráfico y pasan dos cosas:
> Vercel no puede emitir su certificado (el dominio se queda en "Invalid
> Configuration" para siempre) y, si igual conecta, quedas con dos CDN encadenados
> y bucles de redirección `ERR_TOO_MANY_REDIRECTS`.
>
> **Haz clic en la nube naranja hasta que quede gris ("DNS only")** en los dos
> registros. Cloudflare solo resuelve el nombre; el CDN y el TLS los pone Vercel,
> que es lo que quieres.
>
> Si más adelante quisieras usar el proxy de Cloudflare a propósito, primero
> tienes que poner **SSL/TLS → Full (strict)**. Con "Flexible" el bucle es seguro.

### 4.3 No toques los MX

Tu correo `contacto@membrishop.cl` está en **Google Workspace** y sus registros
ya viven en Cloudflare. Como aquí **no** cambias nameservers, los MX, el SPF, el
DKIM y el DMARC se quedan donde están y el correo no se interrumpe.

Solo confirma que siguen ahí antes y después:

```bash
dig MX membrishop.cl +short
dig TXT membrishop.cl +short
```

Regla general para esta zona: **agrega registros, nunca reemplaces la zona
completa.** Los MX y el `tienda` de Shopify conviven con los de Vercel sin
problema, porque son nombres distintos.

### 4.4 Convivencia con la tienda Shopify

`tienda.membrishop.cl` apunta a Shopify con su propio `CNAME` y no interfiere:
la landing vive en la raíz, la tienda en el subdominio. Ese registro también va
en **DNS only**; Shopify emite su propio certificado.

Si algún día quieres enlazar la tienda desde la landing, el enlace normal basta —
no hay que tocar DNS.

### 4.5 Comprobar

Como la zona ya está delegada a Cloudflare, los cambios de registro propagan en
minutos (no hay que esperar 48 horas: eso aplica solo al cambio de nameservers,
que ya hiciste).

```bash
dig NS membrishop.cl +short        # debe responder los ns de Cloudflare
dig A membrishop.cl +short         # la IP de Vercel
dig CNAME www.membrishop.cl +short
dig MX membrishop.cl +short        # los de Google Workspace, intactos
```

En Vercel el dominio pasa de "Invalid Configuration" a **Valid Configuration**.
El certificado TLS se emite solo. Cuando `https://membrishop.cl` cargue, confirma
que `NEXT_PUBLIC_SITE_URL` apunte ahí y redespliega si la cambiaste.

---

## 5. Google Analytics 4

1. [analytics.google.com](https://analytics.google.com) → **Administrar** →
   **Crear** → **Propiedad**.
   - Nombre: `MembriShop`
   - Zona horaria: **(GMT-04:00) Santiago**
   - Moneda: **Peso chileno (CLP)**
2. Objetivo del negocio: *Generar clientes potenciales* o *Impulsar ventas
   online*.
3. **Flujo de datos** → **Web** → URL `https://membrishop.cl`, nombre
   "MembriShop web". Deja activada la **medición mejorada**: te da scroll, clics
   salientes y búsqueda interna sin escribir una línea.
4. Copia el **ID de medición** (`G-XXXXXXXXXX`) a `NEXT_PUBLIC_GA_ID` en Vercel y
   **redespliega**.

### Verificar que quedó bien

No te fíes de que "se ve el script". Comprueba:

- **Tiempo real** en GA4: entra a `membrishop.cl` desde el celular con datos
  móviles (no wifi de la casa, para no confundirte con tu propia sesión). Deberías
  aparecer en menos de un minuto.
- En el navegador: DevTools → Network → filtra por `collect`. Debe haber una
  petición a `google-analytics.com/g/collect` con tu `G-...`.
- Si no aparece nada: revisa que la variable esté en **Production** y que hayas
  redesplegado *después* de agregarla. El componente `Analytics.tsx` no renderiza
  nada si la variable está vacía, así que el silencio es esperable sin ella.

### Medir los formularios y los CTA

Todos los botones importantes ya llevan `data-evento`: `cta_home_principal`,
`cta_whatsapp_flotante`, `cta_producto_fuente_agua`, `lead_newsletter`,
`lead_contacto`. Para convertirlos en eventos, la forma limpia es Google Tag
Manager con un activador de clic sobre `[data-evento]`. Si no quieres montar GTM
ahora, en GA4 **Administrar → Eventos clave** puedes marcar como conversión los
eventos de clic saliente hacia `wa.me`, que ya llegan solos por la medición
mejorada.

---

## 6. Google Search Console y el sitemap

1. [search.google.com/search-console](https://search.google.com/search-console) →
   **Agregar propiedad** → **Dominio** (`membrishop.cl`).
   - La propiedad de tipo **Dominio** cubre `http`, `https`, `www` y subdominios
     de una vez. Es la que conviene.
2. Verificación por **TXT en el DNS**:
   - **Cloudflare → DNS → Records → Add record**: tipo `TXT`, nombre `@`, valor
     el que te dio Google. Los TXT no se proxean, así que no hay nube que apagar.
   - Espera unos minutos y dale **Verificar** en Search Console.
   - Ojo: ya tienes un TXT de verificación de Google Workspace y probablemente un
     SPF. **Agrega uno nuevo, no edites los existentes**: puede haber varios TXT
     en `@` sin conflicto.
   - ¿No quieres tocar DNS? Usa **Prefijo de URL** con el método *Etiqueta HTML*:
     pega **solo el valor** del atributo `content` en
     `NEXT_PUBLIC_GSC_VERIFICATION` y redespliega. El layout inyecta la meta solo.
3. **Sitemaps** → escribe `sitemap.xml` (ruta relativa, no la URL completa) →
   **Enviar**. Debe quedar en estado "Correcto" con 6 URLs descubiertas.
4. **Inspección de URL** → pega `https://membrishop.cl/` → **Solicitar
   indexación**. Repite para las tres categorías, `/contacto` y la ficha de
   producto. Con 6 URLs vale la pena hacerlo a mano una vez; después no sirve de
   nada, no acelera nada y consume cuota.
5. **Vincula GA4 con Search Console**: en GA4, **Administrar → Vinculaciones de
   productos → Search Console**. Es lo que te deja ver las consultas de búsqueda
   dentro de GA4.

### Qué revisar a los 7 días

- **Páginas → No indexadas**: es donde aparece si el `robots.txt` bloqueó de más.
- **Sitemaps**: si dice "No se pudo obtener", casi siempre es que
  `NEXT_PUBLIC_SITE_URL` no coincide con el dominio real.
- **Experiencia → Core Web Vitals**: tarda 28 días en juntar datos de campo. No
  te preocupes si sale vacío al principio.

---

## 7. Lista de comprobación final

Con el dominio ya funcionando, revisa en este orden:

- [ ] `https://membrishop.cl` carga con candado (certificado TLS emitido).
- [ ] `https://www.membrishop.cl` redirige con **301** a la versión sin www.
- [ ] `https://membrishop.cl/robots.txt` responde y su línea `Sitemap:` apunta al
      dominio correcto.
- [ ] `https://membrishop.cl/sitemap.xml` lista 6 URLs, todas con `200`.
- [ ] `https://membrishop.cl/llms.txt` y `/llms-full.txt` responden.
- [ ] El formulario de `/contacto` guarda de verdad: envíalo y busca la fila con
      `npm run db:studio` o en la consola de Neon.
- [ ] El botón flotante de WhatsApp abre un chat con **tu** número.
- [ ] El correo sigue llegando a `contacto@membrishop.cl` (`dig MX membrishop.cl`).
- [ ] `tienda.membrishop.cl` sigue resolviendo a Shopify.
- [ ] Los registros de Vercel en Cloudflare están en **DNS only** (nube gris).
- [ ] Los datos estructurados pasan el
      [Rich Results Test](https://search.google.com/test/rich-results) para la
      Home y para `/mascotas/fuente-agua`.
- [ ] `NEXT_PUBLIC_SITE_URL` coincide exactamente con el dominio final.

---

## Problemas frecuentes

**El build falla en Vercel pero funciona local.** Casi siempre es una variable de
entorno que existe en tu `.env.local` y no en Vercel. Mira el log del build: el
mensaje de error nombra la variable.

**El dominio dice "Invalid Configuration" después de horas.** En el 90 % de los
casos es la nube naranja de Cloudflare: ponla en **DNS only** (gris) en el `A` de
`@` y en el `CNAME` de `www`. Si ya está gris, verifica con
`dig A membrishop.cl +short` que devuelva la IP de Vercel y no otra.

**`ERR_TOO_MANY_REDIRECTS` al abrir el sitio.** Proxy de Cloudflare activado con
SSL/TLS en "Flexible". Apaga el proxy (nube gris) o cambia a **Full (strict)**.

**Search Console dice "No se pudo obtener el sitemap".** Casi siempre
`NEXT_PUBLIC_SITE_URL` está mal o falta el redespliegue posterior. Abre
`/sitemap.xml` en el navegador: si las URLs apuntan a `localhost` o a
`.vercel.app`, ese es el problema.

**Los formularios responden "aún no conectado".** Falta `DATABASE_URL` en Vercel,
o se agregó y no se redesplegó.

**Dejó de llegar el correo.** Con esta configuración no debería pasar, porque no
tocas los nameservers. Si pasa, revisa en Cloudflare que los MX de Google
Workspace sigan ahí y que nadie haya reemplazado la zona completa en vez de
agregar registros.
