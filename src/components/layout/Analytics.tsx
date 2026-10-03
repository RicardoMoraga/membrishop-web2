import Script from "next/script";
import { ConsentimientoCookies } from "@/components/layout/ConsentimientoCookies";
import { site } from "@/lib/site";

/**
 * Google Analytics 4 en "modo básico" de Consent Mode: sin consentimiento no se
 * carga gtag.js. No se renderiza si NEXT_PUBLIC_GA_ID está vacío, así que en desarrollo
 * no ensucias los datos con tus propias visitas.
 */
export function Analytics() {
  const id = site.analytics.ga4;
  if (!id) return null;

  return (
    <>
      {/* Modo básico (decisión 2026-10-03): gtag.js NO se descarga ni se contacta
          a Google hasta que el visitante pulsa "Aceptar analítica". Antes de eso,
          window.gtag es una función vacía, así que ningún evento se encola ni se
          envía. window.msActivarAnalitica() la llama el aviso de cookies al aceptar
          (o este mismo script si la aceptación quedó guardada de una visita previa). */}
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          (function () {
            var ID = '${id}';
            var cargado = false;
            window.gtag = function () {};
            window['ga-disable-' + ID] = true;

            window.msActivarAnalitica = function () {
              if (cargado) { window['ga-disable-' + ID] = false; window.gtag('consent', 'update', { analytics_storage: 'granted' }); return; }
              cargado = true;
              window['ga-disable-' + ID] = false;
              window.dataLayer = window.dataLayer || [];
              window.gtag = function () { window.dataLayer.push(arguments); };
              window.gtag('consent', 'default', {
                analytics_storage: 'granted',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
              window.gtag('js', new Date());
              window.gtag('config', ID, { send_page_view: true });
              var s = document.createElement('script');
              s.async = true;
              s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
              document.head.appendChild(s);
            };

            window.msDesactivarAnalitica = function () {
              window['ga-disable-' + ID] = true;
              if (cargado) window.gtag('consent', 'update', { analytics_storage: 'denied' });
              // Borra las cookies _ga* del dominio y del dominio padre.
              var partes = location.hostname.split('.');
              var dominios = ['', location.hostname, '.' + partes.slice(-2).join('.')];
              document.cookie.split(';').forEach(function (c) {
                var n = c.split('=')[0].trim();
                if (n === '_ga' || n.indexOf('_ga_') === 0) {
                  dominios.forEach(function (d) {
                    document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
                  });
                }
              });
            };

            var elegida = null;
            try { elegida = localStorage.getItem('ms-consentimiento-analitica'); } catch (e) {}
            if (elegida === 'aceptada') window.msActivarAnalitica();
          })();
        `}
      </Script>
      {/* Un solo listener delegado para toda la página: los botones ya llevan
          data-evento. Solo se envían rótulos de la interfaz, nunca datos
          personales. La compra final se mide en Shopify, no aquí. */}
      <Script id="ga4-eventos" strategy="afterInteractive">
        {`
          document.addEventListener('click', function (e) {
            var el = e.target instanceof Element ? e.target.closest('[data-evento]') : null;
            if (el) gtag('event', 'cta_click', { evento: el.getAttribute('data-evento') });
          });
          document.addEventListener('toggle', function (e) {
            var d = e.target;
            if (d instanceof HTMLDetailsElement && d.open) {
              var s = d.querySelector('summary');
              gtag('event', 'faq_open', { pregunta: (s ? s.textContent : '').trim().slice(0, 100) });
            }
          }, true);
          document.addEventListener('play', function (e) {
            if (e.target instanceof HTMLVideoElement) gtag('event', 'video_play', { pagina: location.pathname });
          }, true);
        `}
      </Script>
      <ConsentimientoCookies />
    </>
  );
}
