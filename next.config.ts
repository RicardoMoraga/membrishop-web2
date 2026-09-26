import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // No anunciar el framework en cada respuesta (X-Powered-By).
  poweredByHeader: false,

  // Formatos modernos: menos peso = mejor LCP = mejor Core Web Vitals.
  images: {
    formats: ["image/avif", "image/webp"],
    // Agrega aquí el CDN de Shopify si sirves imágenes desde la tienda.
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },

  async redirects() {
    return [
      // Consolidación de señales: una sola URL canónica por intención.
      { source: "/mascotas/cama-para-perros", destination: "/mascotas/cama-ortopedica", permanent: true },
      { source: "/productos-para-mascotas", destination: "/mascotas", permanent: true },
      { source: "/hogar-y-cocina", destination: "/hogar-cocina", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
        ],
      },
      // HSTS se omite hasta verificar que Cloudflare no lo envía ya: es un header que persiste en navegadores
      // y es difícil revertir si hay un problema. CSP se omite hasta probar GA4 y Shopify en modo Report-Only.
    ];
  },
};

export default nextConfig;
