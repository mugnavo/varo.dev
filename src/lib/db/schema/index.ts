import { generateId } from "ai";
import { relations, sql } from "drizzle-orm";
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
import { user } from "./auth.schema";

export * from "./auth.schema";

export const match_status_enum = pgEnum("match_status_enum", [
  "pending",
  "accepted",
  "rejected",
]);

export const userMessage = pgTable("user_message", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sender_id: text()
    .notNull()
    .references(() => user.id),
  recipient_id: text()
    .notNull()
    .references(() => user.id),
  message: text(),
  created_at: timestamp().defaultNow().notNull(),
});

export const project = pgTable("project", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text(),
  description: text(),
  repo_url: text(),
  website_url: text(),
  owner_id: text()
    .notNull()
    .references(() => user.id),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),

  match_enabled: boolean().default(false),
  skills: text()
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  categories: text()
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  help_description: text(),
});

export const projectMessage = pgTable("project_message", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sender_id: text()
    .notNull()
    .references(() => user.id),
  project_id: integer()
    .notNull()
    .references(() => project.id),
  message: text(),
  created_at: timestamp().defaultNow().notNull(),
});

export const userMatch = pgTable(
  "user_match",
  {
    user1_id: text()
      .notNull()
      .references(() => user.id),
    user2_id: text()
      .notNull()
      .references(() => user.id),

    user1_status: match_status_enum().notNull().default("pending"),
    user2_status: match_status_enum().notNull().default("pending"),

    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp()
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [primaryKey({ columns: [table.user1_id, table.user2_id] })],
);

export const projectMatch = pgTable(
  "project_match",
  {
    user_id: text()
      .notNull()
      .references(() => user.id),
    project_id: integer()
      .notNull()
      .references(() => project.id),

    user_status: match_status_enum().notNull().default("pending"),
    project_status: match_status_enum().notNull().default("pending"),

    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp()
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [primaryKey({ columns: [table.user_id, table.project_id] })],
);

export const userEmbedding = pgTable("user_embedding", {
  id: text()
    .primaryKey()
    .$defaultFn(() => generateId(20)),
  user_id: text()
    .notNull()
    .references(() => user.id),
  embedding: vector({ dimensions: 768 }),
  content: text().notNull(),
  created_at: timestamp().defaultNow().notNull(),
});

export const projectEmbedding = pgTable("project_embedding", {
  id: text()
    .primaryKey()
    .$defaultFn(() => generateId(20)),
  project_id: integer()
    .notNull()
    .references(() => project.id),
  embedding: vector({ dimensions: 768 }),
  content: text().notNull(),
  created_at: timestamp().defaultNow().notNull(),
});

export const userEmbeddingRelations = relations(userEmbedding, ({ one }) => ({
  user: one(user, { fields: [userEmbedding.user_id], references: [user.id] }),
}));

export const userRelations = relations(user, ({ many }) => ({
  embeddings: many(userEmbedding),
}));

export const projectEmbeddingRelations = relations(projectEmbedding, ({ one }) => ({
  project: one(project, {
    fields: [projectEmbedding.project_id],
    references: [project.id],
  }),
}));

export const userMatchRelations = relations(userMatch, ({ one }) => ({
  user1: one(user, { fields: [userMatch.user1_id], references: [user.id] }),
  user2: one(user, { fields: [userMatch.user2_id], references: [user.id] }),
}));

export const projectMatchRelations = relations(projectMatch, ({ one }) => ({
  user: one(user, { fields: [projectMatch.user_id], references: [user.id] }),
  project: one(project, {
    fields: [projectMatch.project_id],
    references: [project.id],
  }),
}));

// TODO: add indexes for faster lookups

export type User = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;
