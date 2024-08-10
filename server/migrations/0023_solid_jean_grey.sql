ALTER TABLE "passkeys_table" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "passkeys_table" ADD COLUMN "credential_id" text NOT NULL;