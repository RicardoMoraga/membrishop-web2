import type { Config } from "drizzle-kit";

/**
 * Configuración de drizzle-kit.
 *
 *   npm run db:generate  → lee src/db/schema.ts y escribe el SQL en /drizzle
 *   npm run db:migrate   → aplica las migraciones pendientes a Neon
 *   npm run db:studio    → explorador visual de la base en el navegador
 *
 * `db:generate` NO necesita conexión: puedes generar el SQL sin tener Neon
 * todavía y pegarlo a mano en el editor SQL de la consola.
 */
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  // Nombres de índices y constraints legibles en la consola de Neon.
  verbose: true,
  strict: true,
} satisfies Config;
