CREATE TYPE "public"."match_status_enum" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_account" (
	"provider_id" text,
	"provider_user_id" text,
	"user_id" integer NOT NULL,
	CONSTRAINT "oauth_account_provider_id_provider_user_id_pk" PRIMARY KEY("provider_id","provider_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text,
	"description" text,
	"repo_url" text,
	"website_url" text,
	"owner_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"match_enabled" boolean DEFAULT false,
	"skills" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"categories" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"help_description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_embedding" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"embedding" vector(768),
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_match" (
	"user_id" integer NOT NULL,
	"project_id" integer,
	"user_status" "match_status_enum" DEFAULT 'pending' NOT NULL,
	"project_status" "match_status_enum" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_match_user_id_project_id_pk" PRIMARY KEY("user_id","project_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_message" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_message_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"sender_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" text,
	"name" text,
	"avatar_url" text,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"setup_at" timestamp,
	"terms_accepted_at" timestamp,
	"match_user" boolean DEFAULT true,
	"match_project" boolean DEFAULT true,
	"bio" text,
	"location" text,
	"experience_level" integer,
	"availability" integer,
	"skills" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"interests" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_embedding" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"embedding" vector(768),
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_match" (
	"user1_id" integer NOT NULL,
	"user2_id" integer NOT NULL,
	"user1_status" "match_status_enum" DEFAULT 'pending' NOT NULL,
	"user2_status" "match_status_enum" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_match_user1_id_user2_id_pk" PRIMARY KEY("user1_id","user2_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_message" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_message_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"sender_id" integer NOT NULL,
	"recipient_id" integer NOT NULL,
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_account" ADD CONSTRAINT "oauth_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_embedding" ADD CONSTRAINT "project_embedding_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_match" ADD CONSTRAINT "project_match_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_match" ADD CONSTRAINT "project_match_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_message" ADD CONSTRAINT "project_message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_message" ADD CONSTRAINT "project_message_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_embedding" ADD CONSTRAINT "user_embedding_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_match" ADD CONSTRAINT "user_match_user1_id_user_id_fk" FOREIGN KEY ("user1_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_match" ADD CONSTRAINT "user_match_user2_id_user_id_fk" FOREIGN KEY ("user2_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_message" ADD CONSTRAINT "user_message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_message" ADD CONSTRAINT "user_message_recipient_id_user_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
