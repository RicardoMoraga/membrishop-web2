CREATE TABLE "webhook_events" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"tema" varchar(60) NOT NULL,
	"handle" varchar(200),
	"recibido_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscribers" ADD COLUMN "confirmacion_token" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
CREATE INDEX "webhook_events_recibido_idx" ON "webhook_events" USING btree ("recibido_en");