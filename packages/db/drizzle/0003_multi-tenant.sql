CREATE TABLE IF NOT EXISTS "clinics" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"email" text,
	"phone" text,
	"address" text,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clinics_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
-- Insert default clinic for existing data
INSERT INTO clinics (name, slug) VALUES ('Clínica Principal', 'principal') ON CONFLICT (slug) DO NOTHING;
--> statement-breakpoint
-- Add columns as nullable first
ALTER TABLE "users" ADD COLUMN "clinic_id" integer;
ALTER TABLE "clients" ADD COLUMN "clinic_id" integer;
ALTER TABLE "patients" ADD COLUMN "clinic_id" integer;
ALTER TABLE "appointments" ADD COLUMN "clinic_id" integer;
ALTER TABLE "medical_records" ADD COLUMN "clinic_id" integer;
ALTER TABLE "products" ADD COLUMN "clinic_id" integer;
ALTER TABLE "suppliers" ADD COLUMN "clinic_id" integer;
ALTER TABLE "invoices" ADD COLUMN "clinic_id" integer;
--> statement-breakpoint
-- Set default clinic_id for existing rows
UPDATE "users" SET "clinic_id" = (SELECT id FROM clinics WHERE slug = 'principal');
UPDATE "clients" SET "clinic_id" = (SELECT id FROM clinics WHERE slug = 'principal');
UPDATE "patients" SET "clinic_id" = (SELECT id FROM clinics WHERE slug = 'principal');
UPDATE "appointments" SET "clinic_id" = (SELECT id FROM clinics WHERE slug = 'principal');
UPDATE "medical_records" SET "clinic_id" = (SELECT id FROM clinics WHERE slug = 'principal');
UPDATE "products" SET "clinic_id" = (SELECT id FROM clinics WHERE slug = 'principal');
UPDATE "suppliers" SET "clinic_id" = (SELECT id FROM clinics WHERE slug = 'principal');
UPDATE "invoices" SET "clinic_id" = (SELECT id FROM clinics WHERE slug = 'principal');
--> statement-breakpoint
-- Now set NOT NULL
ALTER TABLE "users" ALTER COLUMN "clinic_id" SET NOT NULL;
ALTER TABLE "clients" ALTER COLUMN "clinic_id" SET NOT NULL;
ALTER TABLE "patients" ALTER COLUMN "clinic_id" SET NOT NULL;
ALTER TABLE "appointments" ALTER COLUMN "clinic_id" SET NOT NULL;
ALTER TABLE "medical_records" ALTER COLUMN "clinic_id" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "clinic_id" SET NOT NULL;
ALTER TABLE "suppliers" ALTER COLUMN "clinic_id" SET NOT NULL;
ALTER TABLE "invoices" ALTER COLUMN "clinic_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "clients" ADD CONSTRAINT "clients_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "patients" ADD CONSTRAINT "patients_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "products" ADD CONSTRAINT "products_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;
