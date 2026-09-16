import { eq } from "drizzle-orm";
import { baseConfigurada, getDb } from "@/db/client";
import { subscribers } from "@/db/schema";
import { tokenVencido } from "@/lib/confirmacion";
import { resumenError } from "@/lib/errores";
import { site } from "@/lib/site";

/**
 * Confirmación de suscripción (double opt-in).
 *
 * El correo que envía `enviarCorreoConfirmacion` (en `app/actions/lead.ts`)
 * apunta acá con `?token=`. Si el token existe, el suscriptor está
 * "pendiente", y el token no ha vencido (< 48 horas desde `actualizadoEn`),
 * se marca "activo" y `confirmadoEn`. Cualquier otro caso (token inválido,
 * ya confirmado, dado de baja, token vencido) muestra una página apropiada
 * sin enumeración de correos.
 *
 * `dynamic = "force-dynamic"`: lee y escribe la base en cada visita, no se
 * puede prerenderizar ni cachear.
 */

export const dynamic = "force-dynamic";

function pagina(titulo: string, texto: string): Response {
  const html = `<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${titulo} · ${site.nombre}</title>
<style>
  body { font-family: system-ui, sans-serif; background: #fdf8ee; color: #2a2016; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 24px; }
  main { max-width: 28rem; text-align: center; }
  h1 { font-size: 1.35rem; margin-bottom: 0.75rem; }
  a { color: #a8710a; font-weight: 600; }
</style>
</head>
<body>
  <main>
    <h1>${titulo}</h1>
    <p>${texto}</p>
    <p><a href="${site.url}">Volver a ${site.nombre}</a></p>
  </main>
</body>
</html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function GET(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get("token");

  if (!token || !baseConfigurada()) {
    return pagina(
      "Enlace inválido",
      "Este enlace de confirmación no es válido o ya expiró. Si sigues interesado, suscríbete de nuevo desde la web.",
    );
  }

  try {
    const db = getDb();
    const [suscriptor] = await db
      .select({
        id: subscribers.id,
        estado: subscribers.estado,
        actualizadoEn: subscribers.actualizadoEn,
      })
      .from(subscribers)
      .where(eq(subscribers.confirmacionToken, token))
      .limit(1);

    if (!suscriptor || suscriptor.estado !== "pendiente") {
      return pagina(
        "Enlace inválido",
        "Este enlace de confirmación no es válido o ya fue usado. Si sigues interesado, suscríbete de nuevo desde la web.",
      );
    }

    if (tokenVencido(suscriptor.actualizadoEn)) {
      return pagina(
        "Enlace vencido",
        "Este enlace de confirmación venció (dura 48 horas). Vuelve a suscribirte desde la web y te enviaremos uno nuevo.",
      );
    }

    await db
      .update(subscribers)
      .set({ estado: "activo", confirmadoEn: new Date(), actualizadoEn: new Date() })
      .where(eq(subscribers.id, suscriptor.id));

    return pagina(
      "¡Suscripción confirmada!",
      `Listo, quedaste anotado. Te avisamos apenas haya novedades de ${site.nombre}.`,
    );
  } catch (error) {
    console.error(`[confirmar-suscripcion] ${resumenError(error)}`);
    return pagina(
      "No pudimos confirmar tu suscripción",
      "Ocurrió un problema al procesar tu confirmación. Inténtalo de nuevo más tarde o escríbenos por WhatsApp.",
    );
  }
}
