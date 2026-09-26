import Script from "next/script";
import { ConsentimientoCookies } from "@/components/layout/ConsentimientoCookies";
import { site } from "@/lib/site";

/**
 * Google Analytics 4.
 * No se renderiza si NEXT_PUBLIC_GA_ID está vacío, así que en desarrollo
 * no ensucias los datos con tus propias visitas.
 */
export function Analytics() {
  const id = site.analytics.ga4;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          // Consent Mode v2: todo denegado hasta que el visitante acepte en el aviso.
          var elegida = null;
          try { elegida = localStorage.getItem('ms-consentimiento-analitica'); } catch (e) {}
          gtag('consent', 'default', {
            analytics_storage: elegida === 'aceptada' ? 'granted' : 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
          gtag('js', new Date());
          gtag('config', '${id}', { send_page_view: true });
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
