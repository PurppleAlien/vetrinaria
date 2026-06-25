CREATE TABLE "dental_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"clinic_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"teeth" jsonb DEFAULT '[]'::jsonb,
	"notes" jsonb DEFAULT '{}'::jsonb,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dental_records" ADD CONSTRAINT "dental_records_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dental_records" ADD CONSTRAINT "dental_records_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dental_records" ADD CONSTRAINT "dental_records_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dental_records_clinic_id_idx" ON "dental_records" USING btree ("clinic_id");--> statement-breakpoint
CREATE INDEX "dental_records_patient_id_idx" ON "dental_records" USING btree ("patient_id");
