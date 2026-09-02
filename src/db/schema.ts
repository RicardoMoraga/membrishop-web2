import { sql } from "drizzle-orm";
import {
  check,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Esquema de la base de datos (Neon Postgres) — fuente única de verdad.
 *
 * De aquí sale el SQL: `npm run db:generate` escribe la migración en /drizzle,
 * y `npm run db:migrate` la aplica. Nunca edites las tablas a mano en la consola
 * de Neon: si el esquema y este archivo se desincronizan, Drizzle genera
 * migraciones que borran columnas.
 *
 * Decisiones de privacidad, porque esto guarda datos de personas reales:
 *  - No se guarda la IP en claro. Se guarda un hash con sal (`ip_hash`), que
 *    sirve para limitar abuso pero no para identificar a nadie ni reconstruir
 *    la IP original.
 *  - No hay columna de "user agent" completo ni fingerprint. No lo necesitas
 *    para vender fuentes de agua.
 *  - `unsubscribe_token` permite dar de baja sin login, que es lo que exige
 *    cualquier práctica decente de email marketing.
 */

/* ==========================================================================
   subscribers — newsletter
   ========================================================================== */
export const subscribers = pgTable(
  "subscribers",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    /** Siempre normalizado a minúsculas y sin espacios antes de insertar. */
    email: varchar("email", { length: 320 }).notNull(),

    /** Opcional: el formulario de newsletter solo pide el correo. */
    nombre: varchar("nombre", { length: 120 }),

    /**
     * pendiente  → se suscribió, falta confirmar (double opt-in)
     * activo     → confirmado, recibe correos
     * baja       → se dio de baja; se conserva la fila para no volver a escribirle
     * rebotado   → el correo rebotó de forma permanente
     */
    estado: varchar("estado", { length: 20 }).notNull().default("pendiente"),

    /** De qué página vino: "/", "/mascotas", "footer". Para medir qué convierte. */
    origen: varchar("origen", { length: 120 }),

    utmSource: varchar("utm_source", { length: 120 }),
    utmMedium: varchar("utm_medium", { length: 120 }),
    utmCampaign: varchar("utm_campaign", { length: 120 }),

    /** SHA-256 con sal de la IP. Nunca la IP en claro. */
    ipHash: varchar("ip_hash", { length: 64 }),

    /** Token para el enlace de baja en el pie de cada correo. */
    unsubscribeToken: uuid("unsubscribe_token").notNull().defaultRandom(),

    confirmadoEn: timestamp("confirmado_en", { withTimezone: true }),
    bajaEn: timestamp("baja_en", { withTimezone: true }),

    creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
    actualizadoEn: timestamp("actualizado_en", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    /**
     * Unicidad case-insensitive. Sin esto, "Ana@Gmail.com" y "ana@gmail.com"
     * entran como dos suscriptores y le mandas todo duplicado.
     */
    uniqueIndex("subscribers_email_lower_idx").on(sql`lower(${t.email})`),
    index("subscribers_estado_idx").on(t.estado),
    index("subscribers_creado_idx").on(t.creadoEn),
    /**
     * La base impone los estados válidos. Un typo en el código —"activa" en vez
     * de "activo"— falla al insertar en vez de contaminar la tabla en silencio.
     */
    check(
      "subscribers_estado_valido",
      sql`${t.estado} in ('pendiente', 'activo', 'baja', 'rebotado')`,
    ),
    check("subscribers_email_formato", sql`position('@' in ${t.email}) > 1`),
  ],
);

/* ==========================================================================
   contacts — formulario de contacto
   ========================================================================== */
export const contacts = pgTable(
  "contacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    nombre: varchar("nombre", { length: 120 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),

    /** Teléfono chileno normalizado a E.164 (+569XXXXXXXX). Opcional. */
    telefono: varchar("telefono", { length: 20 }),

    asunto: varchar("asunto", { length: 160 }),
    mensaje: text("mensaje").notNull(),

    /**
     * nuevo      → sin leer
     * en_curso   → alguien lo está respondiendo
     * respondido → cerrado
     * spam       → descartado
     */
    estado: varchar("estado", { length: 20 }).notNull().default("nuevo"),

    origen: varchar("origen", { length: 120 }),
    ipHash: varchar("ip_hash", { length: 64 }),

    respondidoEn: timestamp("respondido_en", { withTimezone: true }),
    creadoEn: timestamp("creado_en", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("contacts_estado_creado_idx").on(t.estado, t.creadoEn),
    index("contacts_email_idx").on(sql`lower(${t.email})`),
    index("contacts_ip_creado_idx").on(t.ipHash, t.creadoEn),
    check(
      "contacts_estado_valido",
      sql`${t.estado} in ('nuevo', 'en_curso', 'respondido', 'spam')`,
    ),
    check("contacts_mensaje_minimo", sql`length(trim(${t.mensaje})) >= 10`),
  ],
);

/* ==========================================================================
   Tipos derivados. Se generan solos desde las tablas: no los escribas a mano.
   ========================================================================== */
export type Subscriber = typeof subscribers.$inferSelect;
export type NuevoSubscriber = typeof subscribers.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type NuevoContact = typeof contacts.$inferInsert;
