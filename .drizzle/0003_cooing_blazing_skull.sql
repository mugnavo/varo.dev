ALTER TABLE "project_matches" ALTER COLUMN "user_status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_matches" ALTER COLUMN "project_status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_matches" ALTER COLUMN "user1_status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_matches" ALTER COLUMN "user2_status" SET NOT NULL;