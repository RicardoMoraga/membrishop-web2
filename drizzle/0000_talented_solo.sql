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
--> statement-breakpoint
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
--> statement-breakpoint
CREATE INDEX "contacts_estado_creado_idx" ON "contacts" USING btree ("estado","creado_en");--> statement-breakpoint
CREATE INDEX "contacts_email_idx" ON "contacts" USING btree (lower("email"));--> statement-breakpoint
CREATE INDEX "contacts_ip_creado_idx" ON "contacts" USING btree ("ip_hash","creado_en");--> statement-breakpoint
CREATE UNIQUE INDEX "subscribers_email_lower_idx" ON "subscribers" USING btree (lower("email"));--> statement-breakpoint
CREATE INDEX "subscribers_estado_idx" ON "subscribers" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "subscribers_creado_idx" ON "subscribers" USING btree ("creado_en");