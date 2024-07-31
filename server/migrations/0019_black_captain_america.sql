CREATE TABLE IF NOT EXISTS "food_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"serving_unit" text NOT NULL,
	"serving_qty" integer NOT NULL,
	"nf_calories" integer NOT NULL,
	"image_id" text NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "food_table" ADD CONSTRAINT "food_table_image_id_content_table_filename_fk" FOREIGN KEY ("image_id") REFERENCES "public"."content_table"("filename") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "food_table" ADD CONSTRAINT "food_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
