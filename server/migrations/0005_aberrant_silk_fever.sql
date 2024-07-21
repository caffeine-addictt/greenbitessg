ALTER TABLE "tokens" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "tokens" DROP COLUMN IF EXISTS "token";--> statement-breakpoint
ALTER TABLE "tokens" ADD COLUMN "token" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
UPDATE "tokens" SET "token" = gen_random_uuid();--> statement-breakpoint
ALTER TABLE "tokens" ADD PRIMARY KEY ("token");
