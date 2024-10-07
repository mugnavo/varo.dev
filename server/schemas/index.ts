import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  vector,
} from "drizzle-orm/pg-core";

// maybe convert to barrel file if we're using Nuxt Layers?

export const matchStatusEnum = pgEnum("match_status_enum", [
  "pending",
  "accepted",
  "rejected",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatarUrl: text("avatar_url"),
  email: text("email").unique().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  setupAt: timestamp("setup_at"),
  termsAcceptedAt: timestamp("terms_accepted_at"),

  bio: text("bio"),
  location: text("location"),
  experienceLevel: integer("experience_level"),
  availability: text("availability"),

  // TODO: should we use separate tables for these? (also for project table)
  skills: text("skills")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  techStack: text("tech_stack")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  interests: text("interests")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),

  embedding: vector("embedding", { dimensions: 1536 }),
});

export const oauthAccount = pgTable(
  "oauth_account",
  {
    providerId: text("provider_id"),
    providerUserId: text("provider_user_id"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
  },
  (table) => ({ pk: primaryKey({ columns: [table.providerId, table.providerUserId] }) }),
);

export const project = pgTable("project", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name"),
  description: text("description"),
  repoUrl: text("repo_url"),
  websiteUrl: text("website_url"),
  ownerId: text("owner_id").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),

  matchEnabled: boolean("match_enabled").default(false), // or helpWanted?
  skills: text("skills")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  techStack: text("tech_stack")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  categories: text("categories")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  helpDescription: text("help_description"),

  embedding: vector("embedding", { dimensions: 1536 }),
});

export const userMatch = pgTable(
  "user_match",
  {
    user1Id: text("user1_id").references(() => user.id),
    user2Id: text("user2_id").references(() => user.id),

    user1Status: matchStatusEnum("user_1_status").default("pending"),
    user2Status: matchStatusEnum("user_2_status").default("pending"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({ pk: primaryKey({ columns: [table.user1Id, table.user2Id] }) }),
);

export const projectMatch = pgTable(
  "project_match",
  {
    userId: text("user_id").references(() => user.id),
    projectId: integer("project_id").references(() => project.id),

    userStatus: matchStatusEnum("user_status").default("pending"),
    projectStatus: matchStatusEnum("project_status").default("pending"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({ pk: primaryKey({ columns: [table.userId, table.projectId] }) }),
);

// TODO: add indexes for faster lookups

export type User = typeof user.$inferSelect;
