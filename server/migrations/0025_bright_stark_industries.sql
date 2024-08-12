CREATE TABLE IF NOT EXISTS "users_to_events" (
	"user_id" integer,
	"event_id" integer,
	CONSTRAINT "users_to_events_user_id_event_id_pk" PRIMARY KEY("user_id","event_id")
);
