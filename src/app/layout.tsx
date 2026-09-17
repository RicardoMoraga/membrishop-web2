import type { Metadata, Viewport } from "next";
import "./globals.css";

import { inter } from "@/app/fonts";
import { Analytics } from "@/components/layout/Analytics";
import { AnnounceBar } from "@/components/layout/AnnounceBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyCta } from "@/components/marketing/StickyCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizacionSchema, sitioWebSchema, storeSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    // La Home define su propio title absoluto; el resto hereda la plantilla.
    default: "MembriShop | Mascotas, Tecnología y Hogar con Stock en Chile",
    template: "%s",
  },
  description: site.descripcionCorta,
  applicationName: site.nombre,
  authors: [{ name: site.nombre, url: site.url }],
  creator: site.nombre,
  publisher: site.nombre,
  formatDetection: { telephone: false, address: false, email: false },
  ...(site.analytics.gscVerification
    ? { verification: { google: site.analytics.gscVerification } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#155a24",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Emite <meta name="color-scheme" content="light">, en conjunto con el
  // `color-scheme: light` de globals.css (bug 9).
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" className={inter.variable}>
      <body className="min-h-dvh antialiased">
        <a href="#contenido" className="salto-contenido rounded-marca bg-verde-600 px-4 py-2 text-sm font-semibold text-crema">
          Saltar al contenido
        </a>

        <AnnounceBar />
        <Header />

        {/* pb-24 en móvil: espacio para que el sticky CTA no tape el footer. */}
        <main id="contenido" className="pb-24 md:pb-0">
          {children}
        </main>

        <Footer />
        <StickyCta />

        {/* Datos estructurados de sitio: se emiten una sola vez, en el layout. */}
        <JsonLd data={organizacionSchema()} />
        <JsonLd data={sitioWebSchema()} />
        <JsonLd data={storeSchema()} />

        <Analytics />
      </body>
    </html>
  );
}
