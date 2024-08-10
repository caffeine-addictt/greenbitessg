ALTER TABLE "passkeys_table" RENAME  COLUMN "id" TO "credential_id";--> statement-breakpoint
ALTER TABLE "passkeys_table" ALTER COLUMN "credential_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "passkeys_table" DROP CONSTRAINT "passkeys_table_pkey";--> statement-breakpoint
ALTER TABLE "passkeys_table" ADD COLUMN "id" serial NOT NULL PRIMARY KEY;
