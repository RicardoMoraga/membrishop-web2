import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

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
        ],
      },
    ];
  },
};

export default nextConfig;
