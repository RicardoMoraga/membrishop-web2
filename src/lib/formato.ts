/** Formato de moneda único para todo el sitio. CLP no usa decimales. */
const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export function precioCLP(monto: number): string {
  return clp.format(monto);
}
