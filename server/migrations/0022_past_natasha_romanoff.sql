ALTER TABLE "feedback_table" RENAME COLUMN "feedback_message" TO "message";--> statement-breakpoint
ALTER TABLE "notification_table" RENAME COLUMN "feedback_message" TO "message";--> statement-breakpoint
ALTER TABLE "notification_table" RENAME COLUMN "notification_type" TO "type";--> statement-breakpoint
ALTER TABLE "notification_table" DROP COLUMN IF EXISTS "is_read";