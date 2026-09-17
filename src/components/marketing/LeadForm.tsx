"use client";

import { useActionState, useEffect, useId, useState } from "react";

import { enviarContacto, suscribir } from "@/app/actions/lead";
import { estiloPrimario } from "@/components/ui/CtaButton";
import { IconoCheck, IconoFlecha } from "@/components/ui/icons";
import { estadoInicial, type EstadoFormulario } from "@/lib/formularios";

type Variante = "newsletter" | "contacto";

type Props = {
  variante: Variante;
  /** Desde dónde se envió: "/", "/mascotas", "footer". Se guarda para medir qué convierte. */
  origen: string;
  className?: string;
  /** Solo para la variante newsletter en fondo oscuro (footer). */
  tono?: "claro" | "oscuro";
};

/**
 * Formulario de captura de leads. Una sola pieza para newsletter y contacto:
 * cambian los campos y la Server Action, no la mecánica ni los estados.
 *
 * Cómo funciona el estado, que es la parte que suele quedar mal hecha:
 *
 *  · `useActionState` conecta el <form> con la Server Action y devuelve
 *    [estado, action, pendiente]. No hay `onSubmit`, ni `fetch`, ni
 *    `useState` de "cargando": React lo maneja.
 *  · El formulario funciona SIN JavaScript. Si el bundle no cargó todavía,
 *    el navegador hace un POST normal y la acción corre igual. Por eso no hay
 *    `event.preventDefault()` en ninguna parte.
 *  · Los errores por campo vuelven del servidor, que es donde se valida de
 *    verdad. La validación del navegador (`required`, `type="email"`) está solo
 *    para dar feedback rápido.
 */
export function LeadForm({ variante, origen, className = "", tono = "claro" }: Props) {
  const accion = variante === "newsletter" ? suscribir : enviarContacto;

  const [estado, ejecutar, pendiente] = useActionState<EstadoFormulario, FormData>(
    accion,
    estadoInicial,
  );

  const idBase = useId();
  const [utm, setUtm] = useState({ source: "", medium: "", campaign: "" });

  /**
   * Campos controlados, y no `defaultValue`, por una razón concreta:
   * React 19 resetea los formularios NO controlados en cuanto termina la acción.
   * Con inputs sueltos, un error de validación te devolvía el formulario en
   * blanco y el usuario perdía el mensaje que acababa de escribir. Manteniendo
   * el valor en estado, el error se corrige sin volver a escribir todo.
   */
  const [valores, setValores] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });

  const cambiar =
    (campo: keyof typeof valores) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValores((v) => ({ ...v, [campo]: e.target.value }));

  /**
   * UTM desde la URL. Se lee de `window.location` en un efecto y no con
   * `useSearchParams()` a propósito: ese hook obliga a envolver el componente
   * en <Suspense> y saca la página del prerender estático. Aquí no hace falta.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtm({
      source: params.get("utm_source") ?? "",
      medium: params.get("utm_medium") ?? "",
      campaign: params.get("utm_campaign") ?? "",
    });
  }, []);

  // Vaciar los campos SOLO tras un envío exitoso. Tras un error se conservan.
  useEffect(() => {
    if (estado.estado === "ok") {
      setValores({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" });
    }
  }, [estado]);

  const err = estado.errores ?? {};
  const oscuro = tono === "oscuro";

  const claseInput = (campo: string) =>
    [
      "w-full rounded-marca border px-4 py-3 text-[15px] transition-colors",
      "placeholder:text-ink-suave/60 focus:outline-none",
      // Sobre fondo oscuro no se usa un color de marca sino blanco translúcido:
      // así el mismo formulario sirve en el footer (tinta) y en el bloque de
      // cierre (degradado dorado) sin que ninguno de los dos desentone.
      oscuro
        ? "border-white/25 bg-white/10 text-white placeholder:text-white/55"
        : "border-borde bg-white text-ink",
      err[campo] ? "border-cocido-500 ring-2 ring-cocido-200" : "",
    ].join(" ");

  const claseLabel = `mb-1.5 block text-sm font-medium ${oscuro ? "text-white/85" : "text-ink"}`;

  /* ---------------- Confirmación de éxito (newsletter) ------------------- */
  if (estado.estado === "ok" && variante === "newsletter") {
    return (
      <div
        role="status"
        className={`flex items-start gap-3 rounded-marca border p-5 ${
          oscuro ? "border-white/25 bg-white/10 text-white" : "border-verde-200 bg-verde-50 text-ink"
        } ${className}`}
      >
        <IconoCheck
          className={`mt-0.5 h-5 w-5 shrink-0 ${oscuro ? "text-oro-300" : "text-verde-500"}`}
        />
        <p className="text-[15px] leading-relaxed">{estado.mensaje}</p>
      </div>
    );
  }

  return (
    <form action={ejecutar} className={className} noValidate>
      {/* Contexto invisible que viaja con el envío */}
      <input type="hidden" name="origen" value={origen} />
      <input type="hidden" name="utmSource" value={utm.source} />
      <input type="hidden" name="utmMedium" value={utm.medium} />
      <input type="hidden" name="utmCampaign" value={utm.campaign} />

      {/* Honeypot: fuera de pantalla, sin tabulación y sin autocompletado.
          Una persona nunca lo ve; un bot que rellena todo, sí. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor={`${idBase}-sitioWeb`}>No completar este campo</label>
        <input
          id={`${idBase}-sitioWeb`}
          type="text"
          name="sitioWeb"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {variante === "contacto" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${idBase}-nombre`} className={claseLabel}>
              Nombre <span className="text-cocido-500">*</span>
            </label>
            <input
              id={`${idBase}-nombre`}
              name="nombre"
            value={valores.nombre}
            onChange={cambiar("nombre")}
              type="text"
              required
              autoComplete="name"
              maxLength={120}
              placeholder="Ricardo Pérez"
              aria-invalid={Boolean(err.nombre)}
              aria-describedby={err.nombre ? `${idBase}-nombre-error` : undefined}
              className={claseInput("nombre")}
            />
            {err.nombre && (
              <p id={`${idBase}-nombre-error`} className="mt-1.5 text-sm text-cocido-600">
                {err.nombre}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={`${idBase}-telefono`} className={claseLabel}>
              Teléfono <span className="text-ink-suave">(opcional)</span>
            </label>
            <input
              id={`${idBase}-telefono`}
              name="telefono"
            value={valores.telefono}
            onChange={cambiar("telefono")}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+56 9 1234 5678"
              aria-invalid={Boolean(err.telefono)}
              aria-describedby={err.telefono ? `${idBase}-telefono-error` : undefined}
              className={claseInput("telefono")}
            />
            {err.telefono && (
              <p id={`${idBase}-telefono-error`} className="mt-1.5 text-sm text-cocido-600">
                {err.telefono}
              </p>
            )}
          </div>
        </div>
      )}

      <div className={variante === "contacto" ? "mt-4" : ""}>
        <label
          htmlFor={`${idBase}-email`}
          className={variante === "newsletter" ? "sr-only" : claseLabel}
        >
          Correo electrónico {variante === "contacto" && <span className="text-cocido-500">*</span>}
        </label>

        <div className={variante === "newsletter" ? "flex flex-col gap-3 sm:flex-row" : ""}>
          <input
            id={`${idBase}-email`}
            name="email"
            value={valores.email}
            onChange={cambiar("email")}
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            maxLength={320}
            placeholder="tucorreo@ejemplo.cl"
            aria-invalid={Boolean(err.email)}
            aria-describedby={err.email ? `${idBase}-email-error` : undefined}
            className={claseInput("email")}
          />

          {variante === "newsletter" && (
            <button
              type="submit"
              disabled={pendiente}
              data-evento="lead_newsletter"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-marca bg-oro-400 px-5 text-[14.5px] font-bold text-ink transition-colors hover:bg-oro-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pendiente ? <Spinner /> : null}
              {pendiente ? "Enviando…" : "Suscribirme"}
            </button>
          )}
        </div>

        {err.email && (
          <p id={`${idBase}-email-error`} className="mt-1.5 text-sm text-cocido-600">
            {err.email}
          </p>
        )}
      </div>

      {variante === "contacto" && (
        <>
          <div className="mt-4">
            <label htmlFor={`${idBase}-asunto`} className={claseLabel}>
              Asunto <span className="text-ink-suave">(opcional)</span>
            </label>
            <input
              id={`${idBase}-asunto`}
              name="asunto"
            value={valores.asunto}
            onChange={cambiar("asunto")}
              type="text"
              maxLength={160}
              placeholder="Consulta por la fuente de agua"
              className={claseInput("asunto")}
            />
          </div>

          <div className="mt-4">
            <label htmlFor={`${idBase}-mensaje`} className={claseLabel}>
              Mensaje <span className="text-cocido-500">*</span>
            </label>
            <textarea
              id={`${idBase}-mensaje`}
              name="mensaje"
            value={valores.mensaje}
            onChange={cambiar("mensaje")}
              required
              rows={5}
              minLength={10}
              maxLength={4000}
              placeholder="Cuéntanos qué necesitas y te respondemos en horario hábil."
              aria-invalid={Boolean(err.mensaje)}
              aria-describedby={err.mensaje ? `${idBase}-mensaje-error` : undefined}
              className={`${claseInput("mensaje")} resize-y`}
            />
            {err.mensaje && (
              <p id={`${idBase}-mensaje-error`} className="mt-1.5 text-sm text-cocido-600">
                {err.mensaje}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={pendiente}
            data-evento="lead_contacto"
            className={`mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-marca px-5 text-[14.5px] font-bold transition-colors ${estiloPrimario} disabled:cursor-not-allowed disabled:opacity-70`}
          >
            {pendiente ? <Spinner /> : null}
            {pendiente ? "Enviando…" : "Enviar mensaje"}
            {!pendiente && <IconoFlecha className="h-5 w-5" />}
          </button>
        </>
      )}

      {/* Región viva: los lectores de pantalla anuncian el resultado sin que
          el foco tenga que moverse. */}
      <div aria-live="polite" role="status">
        {estado.estado === "ok" && variante === "contacto" && (
          <p className="mt-4 flex items-start gap-2 rounded-marca border border-verde-200 bg-verde-50 p-4 text-[15px] text-ink">
            <IconoCheck className="mt-0.5 h-5 w-5 shrink-0 text-verde-500" />
            {estado.mensaje}
          </p>
        )}
        {estado.estado === "error" && (
          <p
            className={`mt-4 rounded-marca border p-3 text-sm ${
              oscuro
                ? "border-white/30 bg-white/10 text-white"
                : "border-cocido-300 bg-cocido-50 text-cocido-700"
            }`}
          >
            {estado.mensaje}
          </p>
        )}
      </div>

      {variante === "newsletter" && (
        <p className={`mt-3 text-[13px] ${oscuro ? "text-white/70" : "text-ink-suave"}`}>
          Solo avisos de stock nuevo. Puedes darte de baja cuando quieras.
        </p>
      )}
    </form>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      role="presentation"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
