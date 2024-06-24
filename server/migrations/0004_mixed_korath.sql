ALTER TABLE "jwt_token_blocklist" DROP CONSTRAINT "jwt_token_blocklist_user_id_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_user_id_users_table_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jwt_token_blocklist" ADD CONSTRAINT "jwt_token_blocklist_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
