-- ============================================================================
-- MembriShop — esquema de base de datos (Neon / PostgreSQL)
--
-- ESTE ARCHIVO ES GENERADO. La fuente de verdad es src/db/schema.ts.
-- Para regenerarlo:  npm run db:generate  (escribe en /drizzle) y copia el .sql
--
-- Dos formas de aplicarlo:
--   A) npm run db:migrate            → aplica /drizzle a Neon (recomendado)
--   B) pega este archivo completo en el editor SQL de la consola de Neon
--
-- Requiere Postgres 13+ por gen_random_uuid(); Neon viene con 16/17, así que
-- no necesitas la extensión pgcrypto.
-- ============================================================================

CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(120) NOT NULL,
	"email" varchar(320) NOT NULL,
	"telefono" varchar(20),
	"asunto" varchar(160),
	"mensaje" text NOT NULL,
	"estado" varchar(20) DEFAULT 'nuevo' NOT NULL,
	"origen" varchar(120),
	"ip_hash" varchar(64),
	"respondido_en" timestamp with time zone,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "contacts_estado_valido" CHECK ("contacts"."estado" in ('nuevo', 'en_curso', 'respondido', 'spam')),
	CONSTRAINT "contacts_mensaje_minimo" CHECK (length(trim("contacts"."mensaje")) >= 10)
);

CREATE TABLE "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"nombre" varchar(120),
	"estado" varchar(20) DEFAULT 'pendiente' NOT NULL,
	"origen" varchar(120),
	"utm_source" varchar(120),
	"utm_medium" varchar(120),
	"utm_campaign" varchar(120),
	"ip_hash" varchar(64),
	"unsubscribe_token" uuid DEFAULT gen_random_uuid() NOT NULL,
	"confirmado_en" timestamp with time zone,
	"baja_en" timestamp with time zone,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"actualizado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_estado_valido" CHECK ("subscribers"."estado" in ('pendiente', 'activo', 'baja', 'rebotado')),
	CONSTRAINT "subscribers_email_formato" CHECK (position('@' in "subscribers"."email") > 1)
);

CREATE INDEX "contacts_estado_creado_idx" ON "contacts" USING btree ("estado","creado_en");
CREATE INDEX "contacts_email_idx" ON "contacts" USING btree (lower("email"));
CREATE INDEX "contacts_ip_creado_idx" ON "contacts" USING btree ("ip_hash","creado_en");
CREATE UNIQUE INDEX "subscribers_email_lower_idx" ON "subscribers" USING btree (lower("email"));
CREATE INDEX "subscribers_estado_idx" ON "subscribers" USING btree ("estado");
CREATE INDEX "subscribers_creado_idx" ON "subscribers" USING btree ("creado_en");
-- ----------------------------------------------------------------------------
-- Consultas útiles para el día a día
-- ----------------------------------------------------------------------------

-- Suscriptores nuevos de los últimos 7 días, por origen
-- SELECT origen, count(*) FROM subscribers
--   WHERE creado_en > now() - interval '7 days'
--   GROUP BY origen ORDER BY count(*) DESC;

-- Mensajes de contacto sin responder, más antiguos primero
-- SELECT creado_en, nombre, email, asunto FROM contacts
--   WHERE estado = 'nuevo' ORDER BY creado_en ASC;

-- Marcar un mensaje como respondido
-- UPDATE contacts SET estado = 'respondido', respondido_en = now() WHERE id = '...';

-- Dar de baja a un suscriptor desde el enlace del correo
-- UPDATE subscribers SET estado = 'baja', baja_en = now(), actualizado_en = now()
--   WHERE unsubscribe_token = '...';

-- Confirmar una suscripción (double opt-in)
-- UPDATE subscribers SET estado = 'activo', confirmado_en = now(), actualizado_en = now()
--   WHERE id = '...' AND estado = 'pendiente';
