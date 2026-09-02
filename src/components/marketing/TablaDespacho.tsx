import { site } from "@/lib/site";

/**
 * Plazos por zona. Es la duda número uno de cualquier compra online en Chile
 * y la respuesta que más citan los motores de IA, porque ya viene tabulada.
 * El contenedor scrollea en horizontal para que la tabla nunca empuje el body.
 */
export function TablaDespacho() {
  return (
    <div className="mt-10 overflow-x-auto rounded-marca-lg border border-borde bg-white">
      <table className="w-full min-w-[36rem] border-collapse text-left text-[15px]">
        <caption className="sr-only">
          Plazos estimados de despacho de MembriShop por zona de Chile
        </caption>
        <thead>
          <tr className="border-b border-borde bg-crema-suave">
            <th scope="col" className="font-display px-5 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-oro-700">
              Zona
            </th>
            <th scope="col" className="font-display px-5 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-oro-700">
              Plazo estimado
            </th>
            <th scope="col" className="font-display px-5 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-oro-700">
              Observación
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-borde">
          {site.zonasDespacho.map((fila) => (
            <tr key={fila.zona}>
              <th scope="row" className="px-5 py-4 align-top font-semibold text-ink">
                {fila.zona}
              </th>
              <td className="whitespace-nowrap px-5 py-4 align-top font-semibold text-verde-600">
                {fila.plazo}
              </td>
              <td className="px-5 py-4 align-top text-ink-suave">{fila.nota}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
