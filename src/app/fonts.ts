import localFont from "next/font/local";

/**
 * Fuentes AUTOALOJADAS (self-hosted).
 *
 * ¿Por qué no `next/font/google`? Tres razones prácticas:
 *  1. El build no depende de que fonts.googleapis.com responda: compila offline
 *     y en cualquier CI, incluidos runners con egress restringido.
 *  2. Cero peticiones a terceros en producción → mejor LCP y sin el problema de
 *     consentimiento que arrastra Google Fonts en la UE.
 *  3. `next/font/local` calcula igual las métricas de fallback, así que no hay
 *     salto de layout (CLS) mientras carga.
 *
 * Los .woff2 salen de los paquetes @fontsource/poppins y
 * @fontsource-variable/inter. Para actualizarlos:
 *   npm i -D @fontsource/poppins @fontsource-variable/inter
 *   cp node_modules/@fontsource/poppins/files/poppins-latin-{500,600,700}-normal.woff2 src/fonts/
 *   cp node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2 src/fonts/
 */

export const poppins = localFont({
  src: [
    { path: "../fonts/poppins-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/poppins-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const inter = localFont({
  src: [{ path: "../fonts/inter-latin-wght-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});
