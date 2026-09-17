import { site } from "@/lib/site";

/**
 * Plazos por zona (hoy solo la Región Metropolitana). Es la duda número uno de cualquier compra online en Chile
 * y la respuesta que más citan los motores de IA, porque ya viene tabulada.
 * El contenedor scrollea en horizontal para que la tabla nunca empuje el body.
 */
export function TablaDespacho() {
  const cabecera = "px-4 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.06em] text-ink";

  return (
    <div className="mt-4 overflow-x-auto rounded-marca-lg border border-borde bg-white">
      <table className="w-full min-w-[36rem] border-collapse text-left text-[14px]">
        <caption className="sr-only">
          Zonas y plazos estimados de despacho de MembriShop
        </caption>
        <thead>
          <tr className="border-b border-borde bg-crema">
            <th scope="col" className={cabecera}>
              Zona
            </th>
            <th scope="col" className={cabecera}>
              Plazo estimado
            </th>
            <th scope="col" className={cabecera}>
              Observación
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-borde">
          {site.zonasDespacho.map((fila) => (
            <tr key={fila.zona}>
              <th scope="row" className="px-4 py-3 align-top font-semibold text-ink">
                {fila.zona}
              </th>
              <td className="whitespace-nowrap px-4 py-3 align-top font-semibold text-verde-600">
                {fila.plazo}
              </td>
              <td className="px-4 py-3 align-top text-ink-suave">{fila.nota}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
