import { Notice } from "@/components/ui/Notice";
import { IconoCheck } from "@/components/ui/icons";

/**
 * Bloque TL;DR / Key takeaways.
 * Va SIEMPRE inmediatamente después del H1: es lo primero que lee alguien
 * apurado y el fragmento que los motores de IA citan con más frecuencia.
 */
export function TldrBlock({
  puntos,
  titulo = "TL;DR",
  className = "",
}: {
  puntos: string[];
  titulo?: string;
  className?: string;
}) {
  return (
    <Notice
      tono="oro"
      titulo={`${titulo} · lo esencial`}
      ariaLabel="Resumen de la página"
      className={className}
    >
      <ul className="space-y-2.5">
        {puntos.map((punto) => (
          <li key={punto} className="flex gap-3 text-[15px] leading-relaxed text-ink">
            <IconoCheck className="mt-0.5 h-5 w-5 shrink-0 text-verde-500" />
            <span>{punto}</span>
          </li>
        ))}
      </ul>
    </Notice>
  );
}
