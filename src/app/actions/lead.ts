"use server";

import { createHash } from "node:crypto";
import { and, eq, gte, sql } from "drizzle-orm";
import { headers } from "next/headers";

import { baseConfigurada, getDb } from "@/db/client";
import { contacts, subscribers } from "@/db/schema";
import type { EstadoFormulario } from "@/lib/formularios";
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
 * últimos minutos. No es una defensa perfecta —una botnet la sortea— pero corta
 * en seco el caso real: un script tonto llenando el formulario.
 *
 * Si algún día necesitas algo más serio, mueve esto a Vercel KV o Upstash; la
 * firma de la función no cambia.
 */
const VENTANA_MINUTOS = 10;
const MAX_POR_VENTANA = 5;

async function superaLimite(ipHash: string | null): Promise<boolean> {
  if (!ipHash) return false;

  const desde = new Date(Date.now() - VENTANA_MINUTOS * 60_000);
  const db = getDb();

  const [fila] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(contacts)
    .where(and(eq(contacts.ipHash, ipHash), gte(contacts.creadoEn, desde)));

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
  // El detalle va al log del servidor; al usuario se le da algo accionable.
  console.error(`[lead:${contexto}]`, error);
  return {
    estado: "error",
    mensaje: "No pudimos guardar tus datos. Inténtalo de nuevo o escríbenos por WhatsApp.",
  };
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

  try {
    const db = getDb();
    const ipHash = await hashIp();

    // El índice único es sobre lower(email): la búsqueda tiene que serlo también.
    const [existente] = await db
      .select({ id: subscribers.id, estado: subscribers.estado })
      .from(subscribers)
      .where(sql`lower(${subscribers.email}) = ${datos.email}`)
      .limit(1);

    if (existente) {
      if (existente.estado === "baja") {
        // Se había dado de baja y vuelve: se reactiva en vez de crear un duplicado.
        await db
          .update(subscribers)
          .set({ estado: "pendiente", bajaEn: null, actualizadoEn: new Date() })
          .where(eq(subscribers.id, existente.id));

        return { estado: "ok", mensaje: "¡Te volvimos a sumar! Revisa tu correo." };
      }

      return { estado: "ok", mensaje: "Ese correo ya estaba en la lista. Todo en orden." };
    }

    await db.insert(subscribers).values({
      email: datos.email,
      nombre: datos.nombre || null,
      origen: datos.origen ?? null,
      utmSource: datos.utmSource ?? null,
      utmMedium: datos.utmMedium ?? null,
      utmCampaign: datos.utmCampaign ?? null,
      ipHash,
      estado: "pendiente",
    });

    return {
      estado: "ok",
      mensaje: "¡Listo! Te avisamos cuando entre stock nuevo. Sin spam, lo prometemos.",
    };
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

    if (await superaLimite(ipHash)) {
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
