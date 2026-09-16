"use server";

import { createHash, randomUUID } from "node:crypto";
import { and, eq, gte, sql } from "drizzle-orm";
import { headers } from "next/headers";

import { baseConfigurada, getDb } from "@/db/client";
import { contacts, subscribers } from "@/db/schema";
import { resumenError } from "@/lib/errores";
import type { EstadoFormulario } from "@/lib/formularios";
import { site, urlAbsoluta } from "@/lib/site";
import { erroresPorCampo, esquemaContacto, esquemaNewsletter } from "@/lib/validaciones";

/**
 * OJO: este archivo lleva "use server", así que solo puede exportar funciones
 * async. `EstadoFormulario` y `estadoInicial` viven en `@/lib/formularios`
 * justamente por eso — exportar un objeto desde aquí hace que Next devuelva 500
 * en cuanto se invoca cualquier acción del archivo.
 */

/* ==========================================================================
   Utilidades internas
   ========================================================================== */

/**
 * Hash con sal de la IP.
 *
 * Guardar la IP en claro convierte un formulario de newsletter en un registro
 * de datos personales que hay que justificar, proteger y borrar. El hash sirve
 * igual para limitar abuso —la misma IP produce el mismo hash— pero no permite
 * recuperar la dirección ni cruzarla con otras bases.
 *
 * La sal debe ser secreta y estable. Si la cambias, los hashes viejos dejan de
 * coincidir y el rate limit arranca de cero (no se rompe nada más).
 */
async function hashIp(): Promise<string | null> {
  const cabeceras = await headers();
  const ip =
    cabeceras.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    cabeceras.get("x-real-ip")?.trim() ??
    null;

  if (!ip) return null;

  const sal = process.env.LEAD_SALT ?? "membrishop-sal-por-defecto-cambiala";
  return createHash("sha256").update(`${sal}:${ip}`).digest("hex");
}

/**
 * Rate limit contra la propia base: cuántos envíos hizo este hash de IP en los
 * últimos minutos desde la tabla especificada. No es una defensa perfecta —una
 * botnet la sortea— pero corta en seco el caso real: un script tonto llenando el formulario.
 */
const VENTANA_MINUTOS = 10;
const MAX_POR_VENTANA = 5;

async function superaLimite(
  ipHash: string | null,
  tabla: "contacts" | "subscribers",
): Promise<boolean> {
  if (!ipHash) return false;

  const desde = new Date(Date.now() - VENTANA_MINUTOS * 60_000);
  const db = getDb();

  let fila;
  if (tabla === "contacts") {
    [fila] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(contacts)
      .where(and(eq(contacts.ipHash, ipHash), gte(contacts.creadoEn, desde)));
  } else {
    [fila] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(subscribers)
      .where(and(eq(subscribers.ipHash, ipHash), gte(subscribers.creadoEn, desde)));
  }

  return (fila?.total ?? 0) >= MAX_POR_VENTANA;
}

function sinBaseDeDatos(): EstadoFormulario {
  return {
    estado: "error",
    mensaje:
      "El formulario aún no está conectado a la base de datos. Escríbenos por WhatsApp mientras tanto.",
  };
}

function errorInesperado(contexto: string, error: unknown): EstadoFormulario {
  console.error(`[lead:${contexto}] ${resumenError(error)}`);
  return {
    estado: "error",
    mensaje: "No pudimos guardar tus datos. Inténtalo de nuevo o escríbenos por WhatsApp.",
  };
}

/**
 * Correo de confirmación (double opt-in) vía la API HTTP de Resend.
 *
 * Sin dependencia nueva: es un POST con `fetch`, igual que `lib/shopify.ts`
 * habla con Shopify. Si `RESEND_API_KEY` no está configurada, no falla nada:
 * el suscriptor queda guardado como "pendiente" y simplemente no recibe el
 * correo todavía — falta conectar el proveedor, no un bug.
 */
async function enviarCorreoConfirmacion(email: string, token: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[lead] RESEND_API_KEY no configurada: el suscriptor queda pendiente sin correo de confirmación.",
    );
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? `${site.nombre} <avisos@membrishop.cl>`;
  const linkConfirmacion = urlAbsoluta(`/api/confirmar-suscripcion?token=${token}`);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: email,
        subject: `Confirma tu suscripción a ${site.nombre}`,
        html: `<p>Un paso más: confirma que quieres recibir avisos de ${site.nombre}.</p><p><a href="${linkConfirmacion}">Confirmar suscripción</a></p><p>Si no la pediste tú, ignora este correo.</p>`,
      }),
    });
    if (!res.ok) {
      console.error(`[lead] Resend respondió ${res.status} al enviar un correo de confirmación`);
    }
  } catch (error) {
    console.error(`[lead] error de red enviando correo de confirmación: ${resumenError(error)}`);
  }
}

/* ==========================================================================
   1) Suscripción a newsletter
   ========================================================================== */

export async function suscribir(
  _prev: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const parseo = esquemaNewsletter.safeParse({
    email: formData.get("email"),
    nombre: formData.get("nombre") ?? "",
    origen: formData.get("origen") ?? undefined,
    utmSource: formData.get("utmSource") ?? undefined,
    utmMedium: formData.get("utmMedium") ?? undefined,
    utmCampaign: formData.get("utmCampaign") ?? undefined,
    sitioWeb: formData.get("sitioWeb") ?? "",
  });

  if (!parseo.success) {
    return {
      estado: "error",
      mensaje: "Revisa los datos marcados.",
      errores: erroresPorCampo(parseo.error),
    };
  }

  // Honeypot lleno = bot. Se responde "ok" a propósito: si le dices que lo
  // detectaste, el siguiente intento viene sin el campo relleno.
  if (parseo.data.sitioWeb) {
    return { estado: "ok", mensaje: "¡Listo! Te avisaremos cuando haya novedades." };
  }

  if (!baseConfigurada()) return sinBaseDeDatos();

  const datos = parseo.data;
  const emailConfirmacionConfigurada = Boolean(process.env.RESEND_API_KEY);

  try {
    const db = getDb();
    const ipHash = await hashIp();

    if (await superaLimite(ipHash, "subscribers")) {
      return {
        estado: "error",
        mensaje:
          "Recibimos varias solicitudes desde tu conexión hace poco. Espera unos minutos e inténtalo de nuevo.",
      };
    }

    // Mensaje de éxito para nuevo suscriptor o cuando ya existe sin estar en baja.
    const mensajeNuevoSuscriptor = (): EstadoFormulario => ({
      estado: "ok",
      mensaje: emailConfirmacionConfigurada
        ? "¡Casi listo! Confirma tu correo para empezar a recibir avisos."
        : "¡Listo! Te avisamos cuando entre stock nuevo. Sin spam, lo prometemos.",
    });

    // El índice único es sobre lower(email): la búsqueda tiene que serlo también.
    const [existente] = await db
      .select({ id: subscribers.id, estado: subscribers.estado })
      .from(subscribers)
      .where(sql`lower(${subscribers.email}) = ${datos.email}`)
      .limit(1);

    if (existente) {
      if (existente.estado === "baja") {
        // Se había dado de baja y vuelve: se reactiva en vez de crear un
        // duplicado, y se le pide confirmar de nuevo (token nuevo).
        const token = randomUUID();
        await db
          .update(subscribers)
          .set({
            estado: "pendiente",
            bajaEn: null,
            confirmacionToken: token,
            confirmadoEn: null,
            actualizadoEn: new Date(),
          })
          .where(eq(subscribers.id, existente.id));

        await enviarCorreoConfirmacion(datos.email, token);
        return {
          estado: "ok",
          mensaje: emailConfirmacionConfigurada
            ? "¡Te volvimos a sumar! Revisa tu correo para confirmar."
            : "¡Te volvimos a sumar! Te avisaremos cuando haya novedades.",
        };
      }

      return mensajeNuevoSuscriptor();
    }

    const token = randomUUID();

    await db.insert(subscribers).values({
      email: datos.email,
      nombre: datos.nombre || null,
      origen: datos.origen ?? null,
      utmSource: datos.utmSource ?? null,
      utmMedium: datos.utmMedium ?? null,
      utmCampaign: datos.utmCampaign ?? null,
      ipHash,
      estado: "pendiente",
      confirmacionToken: token,
    });

    await enviarCorreoConfirmacion(datos.email, token);

    return mensajeNuevoSuscriptor();
  } catch (error) {
    return errorInesperado("suscribir", error);
  }
}

/* ==========================================================================
   2) Formulario de contacto
   ========================================================================== */

export async function enviarContacto(
  _prev: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const parseo = esquemaContacto.safeParse({
    nombre: formData.get("nombre"),
    email: formData.get("email"),
    telefono: formData.get("telefono") ?? "",
    asunto: formData.get("asunto") ?? "",
    mensaje: formData.get("mensaje"),
    origen: formData.get("origen") ?? undefined,
    sitioWeb: formData.get("sitioWeb") ?? "",
  });

  if (!parseo.success) {
    return {
      estado: "error",
      mensaje: "Revisa los datos marcados.",
      errores: erroresPorCampo(parseo.error),
    };
  }

  if (parseo.data.sitioWeb) {
    return { estado: "ok", mensaje: "¡Mensaje recibido! Te respondemos en horario hábil." };
  }

  if (!baseConfigurada()) return sinBaseDeDatos();

  const datos = parseo.data;

  try {
    const ipHash = await hashIp();

    if (await superaLimite(ipHash, "contacts")) {
      return {
        estado: "error",
        mensaje: `Recibimos varios mensajes tuyos hace poco. Espera unos minutos o escríbenos por WhatsApp.`,
      };
    }

    await getDb().insert(contacts).values({
      nombre: datos.nombre,
      email: datos.email,
      telefono: datos.telefono ?? null,
      asunto: datos.asunto || null,
      mensaje: datos.mensaje,
      origen: datos.origen ?? null,
      ipHash,
      estado: "nuevo",
    });

    return {
      estado: "ok",
      mensaje: "¡Mensaje recibido! Te respondemos en horario hábil, de lunes a viernes.",
    };
  } catch (error) {
    return errorInesperado("contacto", error);
  }
}
