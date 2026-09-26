import { eq } from "drizzle-orm";
import { baseConfigurada, getDb } from "@/db/client";
import { subscribers } from "@/db/schema";
import { resumenError } from "@/lib/errores";
import { site } from "@/lib/site";

/**
 * Baja del newsletter (enlace en cada correo + cabecera List-Unsubscribe).
 *
 * GET muestra una página con un botón; la baja se ejecuta solo con POST.
 * Así los escáneres de enlaces de los proveedores de correo, que abren cada
 * URL con GET, no dan de baja a nadie por accidente. El POST sin cuerpo que
 * envían los clientes de correo con "List-Unsubscribe=One-Click" (RFC 8058)
 * también se acepta.
 *
 * Nunca revela si el token existe (sin enumeración de correos).
 */

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function escapar(texto: string): string {
  return texto.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function pagina(titulo: string, cuerpo: string, status = 200): Response {
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
  button { font: inherit; font-weight: 600; background: #155a24; color: #fff; border: 0; border-radius: 8px; padding: 12px 20px; cursor: pointer; }
  button:focus-visible { outline: 3px solid #a8710a; outline-offset: 2px; }
</style>
</head>
<body>
  <main>
    <h1>${titulo}</h1>
    ${cuerpo}
    <p><a href="${site.url}">Volver a ${site.nombre}</a></p>
  </main>
</body>
</html>`;
  return new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

function tokenDe(request: Request): string | null {
  const token = new URL(request.url).searchParams.get("token");
  return token && UUID.test(token) ? token : null;
}

const INVALIDO = () =>
  pagina(
    "Enlace inválido",
    `<p>Este enlace de baja no es válido. Si quieres dejar de recibir correos, escríbenos a ${site.contacto.email}.</p>`,
    400,
  );

export async function GET(request: Request): Promise<Response> {
  const token = tokenDe(request);
  if (!token) return INVALIDO();

  return pagina(
    "Dejar de recibir correos",
    `<p>Confirma que ya no quieres recibir avisos de ${site.nombre}.</p>
     <form method="post" action="/api/baja?token=${escapar(token)}"><button type="submit">Darme de baja</button></form>`,
  );
}

export async function POST(request: Request): Promise<Response> {
  const token = tokenDe(request);
  if (!token || !baseConfigurada()) return INVALIDO();

  try {
    // Idempotente: repetir la baja no cambia nada ni revela si el token existía.
    await getDb()
      .update(subscribers)
      .set({ estado: "baja", bajaEn: new Date(), actualizadoEn: new Date() })
      .where(eq(subscribers.unsubscribeToken, token));

    return pagina(
      "Listo, te diste de baja",
      `<p>No volverás a recibir avisos de ${site.nombre}. Si fue un error, puedes suscribirte de nuevo desde la web.</p>`,
    );
  } catch (error) {
    console.error(`[baja] ${resumenError(error)}`);
    return pagina(
      "No pudimos procesar la baja",
      `<p>Inténtalo de nuevo en unos minutos o escríbenos a ${site.contacto.email}.</p>`,
      500,
    );
  }
}
