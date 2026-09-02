import Script from "next/script";
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
          gtag('js', new Date());
          gtag('config', '${id}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
