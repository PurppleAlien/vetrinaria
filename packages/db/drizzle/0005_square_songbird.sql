CREATE TABLE "vaccines" (
	"id" serial PRIMARY KEY NOT NULL,
	"clinic_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"species" text NOT NULL,
	"frequency_days" integer DEFAULT 365 NOT NULL,
	"is_core" boolean DEFAULT true NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vaccination_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"clinic_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"vaccine_id" integer NOT NULL,
	"applied_date" date NOT NULL,
	"next_due_date" date,
	"batch_number" text,
	"application_site" text,
	"dose_number" integer DEFAULT 1,
	"administered_by" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vaccines" ADD CONSTRAINT "vaccines_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vaccination_records" ADD CONSTRAINT "vaccination_records_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vaccination_records" ADD CONSTRAINT "vaccination_records_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vaccination_records" ADD CONSTRAINT "vaccination_records_vaccine_id_vaccines_id_fk" FOREIGN KEY ("vaccine_id") REFERENCES "public"."vaccines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vaccination_records" ADD CONSTRAINT "vaccination_records_administered_by_users_id_fk" FOREIGN KEY ("administered_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "vaccines_clinic_id_idx" ON "vaccines" USING btree ("clinic_id");--> statement-breakpoint
CREATE INDEX "vaccines_species_idx" ON "vaccines" USING btree ("species");--> statement-breakpoint
CREATE INDEX "vaccination_records_clinic_id_idx" ON "vaccination_records" USING btree ("clinic_id");--> statement-breakpoint
CREATE INDEX "vaccination_records_patient_id_idx" ON "vaccination_records" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "vaccination_records_vaccine_id_idx" ON "vaccination_records" USING btree ("vaccine_id");--> statement-breakpoint
CREATE INDEX "vaccination_records_patient_due_idx" ON "vaccination_records" USING btree ("patient_id","next_due_date");