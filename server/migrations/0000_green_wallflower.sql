CREATE TABLE IF NOT EXISTS "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"permission" smallint DEFAULT 0 NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"date_of_birth" date NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
