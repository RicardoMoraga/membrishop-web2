/**
 * Eventos de analítica (GA4). Si GA4 no está cargado —falta NEXT_PUBLIC_GA_ID,
 * bloqueador, desarrollo— la llamada no hace nada.
 *
 * Solo nombres de evento y rótulos de la interfaz: nunca datos personales.
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function registrarEvento(nombre: string, parametros: Record<string, string | number> = {}): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", nombre, parametros);
}
