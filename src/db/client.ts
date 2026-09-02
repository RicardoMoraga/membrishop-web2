import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

/**
 * Conexión a Neon.
 *
 * Driver: `neon-http`. Habla con Neon por HTTP en vez de por el protocolo
 * TCP de Postgres, y eso importa en serverless: no hay pool que mantener vivo
 * entre invocaciones, ni conexiones colgadas cuando la función se congela.
 * Cada consulta es una petición HTTP independiente.
 *
 * Su límite: no soporta transacciones interactivas de varias sentencias.
 * Para lo que hace esta landing —un INSERT por envío de formulario— sobra.
 * Si algún día necesitas transacciones reales, cambia a `neon-serverless`
 * (WebSocket) o a `node-postgres` con pooler.
 *
 * La inicialización es perezosa a propósito: `npm run build` y `npm run dev`
 * tienen que funcionar sin `DATABASE_URL`. Si el cliente se creara al importar
 * el módulo, el build reventaría antes de que alcances a crear la base en Neon.
 */

let cliente: ReturnType<typeof drizzle<typeof schema>> | null = null;

/** true si hay `DATABASE_URL`. Úsalo para degradar con elegancia, no para asumir. */
export function baseConfigurada(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getDb() {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error(
      "Falta DATABASE_URL. Copia la cadena de conexión pooled de Neon a .env.local " +
        "(y a las variables de entorno de Vercel).",
    );
  }

  if (!cliente) {
    cliente = drizzle(neon(url), { schema });
  }

  return cliente;
}

export { schema };
