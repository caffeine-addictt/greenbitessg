CREATE TABLE IF NOT EXISTS "jwt_token_blocklist" (
	"jti" text PRIMARY KEY NOT NULL,
	"expired_at" timestamp NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jwt_token_blocklist" ADD CONSTRAINT "jwt_token_blocklist_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
