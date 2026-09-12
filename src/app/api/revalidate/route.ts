import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { baseConfigurada, getDb } from "@/db/client";
import { webhookEvents } from "@/db/schema";
import { ETIQUETA_CATALOGO, etiquetaProducto } from "@/lib/shopify";

/**
 * Receptor de webhooks de Shopify para invalidar caché bajo demanda.
 *
 * Temas soportados:
 *   products/update          trae `handle` → invalida ese producto y el catálogo
 *   inventory_levels/update  NO trae handle → invalida solo el catálogo
 *
 * Sobre el segundo: el payload de inventario identifica un `inventory_item_id`,
 * no un producto. Traducirlo a un handle exigiría una llamada al Admin API con
 * credenciales de comerciante, que este frontend no tiene ni debe tener. La
 * decisión es invalidar la etiqueta global: es más amplio de lo necesario,
 * pero es correcto y no inventa un mapeo que no existe. El costo real es una
 * regeneración extra de páginas ya estáticas.
 *
 * Deduplicación: Shopify reintenta un webhook si no responde 200 a tiempo, y
 * eso puede volver a disparar la misma revalidación varias veces. Se registra
 * cada `X-Shopify-Webhook-Id` en `webhook_events` (su propia PK) antes de
 * revalidar: si el INSERT choca con una fila existente, es un reintento del
 * mismo aviso y se responde 200 sin volver a invalidar caché. Si la base no
 * está configurada (`DATABASE_URL` ausente), la deduplicación se salta —no es
 * motivo para rechazar el aviso— y se revalida igual, como antes.
 *
 * Seguridad: la ruta es pública por necesidad —Shopify tiene que alcanzarla—
 * así que la firma HMAC es lo único que separa un aviso legítimo de cualquiera
 * que conozca la URL. Sin `SHOPIFY_WEBHOOK_SECRET` responde 503 y no invalida
 * nada: preferible servir datos algo viejos a dejar abierto un botón público
 * de purga de caché. `robots.ts` ya bloquea `/api/`.
 */

export const runtime = "nodejs"; // `node:crypto` no existe en el runtime edge
export const dynamic = "force-dynamic";

const SECRETO = process.env.SHOPIFY_WEBHOOK_SECRET;

/** Perfil de `cacheLife` que Next 16 exige como segundo argumento. */
const INMEDIATO = { expire: 0 } as const;

function firmaValida(cuerpoCrudo: string, firmaRecibida: string): boolean {
  if (!SECRETO) return false;

  const esperada = createHmac("sha256", SECRETO).update(cuerpoCrudo, "utf8").digest();

  let recibida: Buffer;
  try {
    recibida = Buffer.from(firmaRecibida, "base64");
  } catch {
    return false;
  }

  // `timingSafeEqual` lanza si los largos difieren; se comprueba antes.
  if (recibida.length !== esperada.length) return false;
  return timingSafeEqual(recibida, esperada);
}

export async function POST(request: Request): Promise<Response> {
  if (!SECRETO) {
    console.error("[webhook] SHOPIFY_WEBHOOK_SECRET no está configurado — se rechaza el aviso");
    return new Response("webhook sin configurar", { status: 503 });
  }

  // El cuerpo CRUDO es obligatorio: la firma se calcula sobre los bytes tal
  // como llegaron. Si se parsea antes, el JSON reserializado no coincide.
  const cuerpoCrudo = await request.text();
  const firma = request.headers.get("x-shopify-hmac-sha256");

  if (!firma || !firmaValida(cuerpoCrudo, firma)) {
    console.error("[webhook] firma HMAC inválida o ausente");
    return new Response("firma inválida", { status: 401 });
  }

  const tema = request.headers.get("x-shopify-topic") ?? "desconocido";
  const webhookId = request.headers.get("x-shopify-webhook-id");

  let payload: { handle?: unknown };
  try {
    payload = JSON.parse(cuerpoCrudo) as typeof payload;
  } catch {
    console.error(`[webhook] ${tema} — cuerpo no es JSON válido`);
    return new Response("cuerpo inválido", { status: 400 });
  }

  const handle = typeof payload.handle === "string" && payload.handle ? payload.handle : null;

  if (webhookId && baseConfigurada()) {
    try {
      await getDb().insert(webhookEvents).values({ id: webhookId, tema, handle });
    } catch (error) {
      // Violación de unicidad (23505) = mismo webhook reentregado: se responde
      // 200 sin revalidar de nuevo. Cualquier otro error de base no debe
      // bloquear la revalidación real, así que se registra y se sigue.
      const codigo = (error as { code?: string } | null)?.code;
      if (codigo === "23505") {
        console.info(`[webhook] ${tema} — id ${webhookId} duplicado, se ignora`);
        return Response.json({ ok: true, tema, duplicado: true });
      }
      console.error(`[webhook] no se pudo registrar el evento para deduplicar`, error);
    }
  }

  revalidateTag(ETIQUETA_CATALOGO, INMEDIATO);
  if (handle) revalidateTag(etiquetaProducto(handle), INMEDIATO);

  console.info(`[webhook] ${tema} — revalidado ${handle ? etiquetaProducto(handle) : ETIQUETA_CATALOGO}`);

  // 200 siempre que la firma sea válida: Shopify reintenta ante cualquier otro
  // código, y un reintento en bucle no arregla un payload sin handle.
  return Response.json({ ok: true, tema, revalidado: handle ?? ETIQUETA_CATALOGO });
}
