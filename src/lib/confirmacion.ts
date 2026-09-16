export const VIGENCIA_CONFIRMACION_MS = 48 * 60 * 60 * 1000;

export function tokenVencido(emitidoEn: Date, ahora = new Date()): boolean {
  return ahora.getTime() - emitidoEn.getTime() > VIGENCIA_CONFIRMACION_MS;
}
