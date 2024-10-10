DO $$ BEGIN
 CREATE TYPE "public"."match_status_enum" AS ENUM('pending', 'accepted', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_accounts" (
	"provider_id" text,
	"provider_user_id" text,
	"user_id" text NOT NULL,
	CONSTRAINT "oauth_accounts_provider_id_provider_user_id_pk" PRIMARY KEY("provider_id","provider_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_matches" (
	"user_id" text,
	"project_id" integer,
	"user_status" "match_status_enum" DEFAULT 'pending',
	"project_status" "match_status_enum" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_matches_user_id_project_id_pk" PRIMARY KEY("user_id","project_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "projects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text,
	"description" text,
	"repo_url" text,
	"website_url" text,
	"owner_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"match_enabled" boolean DEFAULT false,
	"skills" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"tech_stack" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"categories" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"help_description" text,
	"embedding" vector(1536)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_matches" (
	"user1_id" text,
	"user2_id" text,
	"user1_status" "match_status_enum" DEFAULT 'pending',
	"user2_status" "match_status_enum" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_matches_user1_id_user2_id_pk" PRIMARY KEY("user1_id","user2_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text,
	"name" text,
	"first_name" text,
	"last_name" text,
	"avatar_url" text,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"setup_at" timestamp,
	"terms_accepted_at" timestamp,
	"bio" text,
	"location" text,
	"experience_level" integer,
	"availability" text,
	"skills" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"tech_stack" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"interests" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"embedding" vector(1536),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_matches" ADD CONSTRAINT "project_matches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_matches" ADD CONSTRAINT "project_matches_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_matches" ADD CONSTRAINT "user_matches_user1_id_users_id_fk" FOREIGN KEY ("user1_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_matches" ADD CONSTRAINT "user_matches_user2_id_users_id_fk" FOREIGN KEY ("user2_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
