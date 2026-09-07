# MembriShop — Resumen ejecutivo
**Fecha de corte:** 07-09-2026 · Todo verificado en vivo (Shopify Admin API, Vercel dashboard vía capturas, `WebFetch` externo al sitio público).

---

## 1. Situación en una frase

El sitio está técnicamente terminado y desplegado (checkout real de Shopify integrado, 15 productos activos y publicados), pero **sigue público sin protección** y **sin stock real**, por lo que hoy cualquier visitante puede navegar la tienda pero nadie puede comprar nada.

---

## 2. Punto crítico abierto: el sitio sigue público

Le pediste a Ricardo (tú) activar "Vercel Authentication" para que la tienda solo la veas tú mientras no esté lista para lanzar. En la captura que enviaste el toggle aparece **activado** ("Se requiere iniciar sesión" en azul), pero al verificar el sitio desde afuera (sin sesión, con distintos parámetros para evitar caché) **sigue mostrando la landing pública completa**, sin ninguna pantalla de login.

Conclusión: el cambio no se guardó del lado de Vercel, aunque se ve activado en la interfaz.

**Qué falta:** entrar de nuevo a `vercel.com/claude-70f0/membrishop-web2/settings/deployment-protection`, recargar la página primero (para ver el estado real, no el que quedó en el navegador), y si el toggle aparece apagado, activarlo y confirmar que aparece una notificación de guardado exitoso antes de salir. Si aparece encendido pero el sitio sigue público, puede ser un tema de soporte de Vercel (protección que no se propaga) y valdría la pena revisarlo con ellos directamente.

---

## 3. Todo lo demás, verificado hoy

| Área | Estado | Detalle |
|---|---|---|
| Código / checkout real | ✅ Resuelto | Integración con Shopify Storefront API en producción (commit `02433c4`). El botón "Comprar ahora" crea un carrito real y redirige al checkout de Shopify. |
| Bugs de scroll / color-scheme | ✅ Resuelto | En producción. |
| Productos cargados | ✅ Resuelto | 15 SKUs, todos `ACTIVE`, publicados en Tienda online + canal Headless. |
| **Stock real** | ❌ Pendiente | Las 15 variantes tienen `inventoryQuantity: 0` y política `DENY` (no se puede vender sin stock). Sin stock, no hay primera venta posible, ni de prueba. |
| Pasarela de pago (Mercado Pago) | 🟡 Sin reverificar hoy | Última verificación fue el 02-09: app "Mercado Pago Tarjetas CL" instalada y activa. No se volvió a chequear en esta sesión. |
| Protección de acceso (Vercel Auth) | ❌ Pendiente — ver punto 2 | Sitio público pese a la intención de restringirlo. |
| Dominio propio `membrishop.cl` | ❌ Pendiente | Sin registros DNS apuntando al sitio; sigue solo accesible por `membrishop-web2.vercel.app`. |
| Variables de entorno menores | 🟡 Pendiente | Faltan `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP`, `DATABASE_URL`, `LEAD_SALT`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GSC_VERIFICATION`. |
| Token Dropi → Dropify | ❌ Pendiente | Requiere que lo generes tú en `app.dropi.cl` → Mis Integraciones. |
| Catálogo definitivo | ❌ Sin decidir | Falta definir si Dropi reemplaza los 15 SKUs actuales o solo aporta costo/stock/fotos. |
| App Dropshipman | ❌ Sin decidir | Choca con la regla de "solo proveedor nacional"; falta decidir si se desinstala. |
| GA4 / Search Console / páginas legales | ❌ Pendiente | No iniciado. |

---

## 4. Prioridad recomendada (en orden)

1. **Cerrar el punto de acceso público** — confirmar y forzar que Vercel Authentication realmente bloquee el sitio. Es el único riesgo activo hoy (reputacional, ya que el sitio no está listo para vender).
2. **Decidir catálogo real** (Dropi vs. los 15 SKUs actuales) — todo lo demás (fotos, stock, precios reales) depende de esta decisión.
3. **Cargar stock** (real o de prueba) para poder validar una compra de punta a punta con Mercado Pago.
4. Conectar dominio propio y variables de entorno menores — no bloquean nada funcional, pero conviene resolverlas antes del lanzamiento.
5. GA4 / Search Console / legales — al final, antes de abrir al público.

---

## 5. Lo que no requiere ninguna acción tuya

El código (checkout real, fix de bugs, publicación de productos) está resuelto y confirmado en producción. No hay nada pendiente de mi parte en esa capa hasta que definas catálogo/stock.
