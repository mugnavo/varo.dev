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

// maybe convert to barrel file if we're using Nuxt Layers?

export const match_status_enum = pgEnum("match_status_enum", [
	"pending",
	"accepted",
	"rejected",
]);

export const users = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	username: text().unique(),
	name: text(),
	first_name: text(),
	last_name: text(),
	avatar_url: text(),
	email: text().unique().notNull(),

	created_at: timestamp().defaultNow().notNull(),
	updated_at: timestamp()
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
	setup_at: timestamp(),
	terms_accepted_at: timestamp(),

	match_user: boolean().default(true),
	match_project: boolean().default(true),

	bio: text(),
	location: text(),
	experience_level: integer(),
	availability: integer(),

	// TODO: should we use separate tables for these? (also for project table)
	skills: text()
		.array()
		.notNull()
		.default(sql`ARRAY[]::text[]`),
	tech_stack: text()
		.array()
		.notNull()
		.default(sql`ARRAY[]::text[]`),
	interests: text()
		.array()
		.notNull()
		.default(sql`ARRAY[]::text[]`),
});

export const userMessages = pgTable("user_messages", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	sender_id: integer()
		.notNull()
		.references(() => users.id),
	recipient_id: integer()
		.notNull()
		.references(() => users.id),
	message: text(),
	created_at: timestamp().defaultNow().notNull(),
});

export const oauthAccounts = pgTable(
	"oauth_accounts",
	{
		provider_id: text(),
		provider_user_id: text(),
		user_id: integer()
			.notNull()
			.references(() => users.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.provider_id, table.provider_user_id] }),
	}),
);

export const accountRelations = relations(oauthAccounts, ({ one }) => ({
	user: one(users, { fields: [oauthAccounts.user_id], references: [users.id] }),
}));

export const projects = pgTable("projects", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: text(),
	description: text(),
	repo_url: text(),
	website_url: text(),
	owner_id: integer()
		.notNull()
		.references(() => users.id),
	created_at: timestamp().defaultNow().notNull(),
	updated_at: timestamp()
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),

	match_enabled: boolean().default(false), // or help_wanted?
	skills: text()
		.array()
		.notNull()
		.default(sql`ARRAY[]::text[]`),
	tech_stack: text()
		.array()
		.notNull()
		.default(sql`ARRAY[]::text[]`),
	categories: text()
		.array()
		.notNull()
		.default(sql`ARRAY[]::text[]`),
	help_description: text(),
});

export const projectMessages = pgTable("project_messages", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	sender_id: integer()
		.notNull()
		.references(() => users.id),
	project_id: integer()
		.notNull()
		.references(() => projects.id),
	message: text(),
	created_at: timestamp().defaultNow().notNull(),
});

export const userMatches = pgTable(
	"user_matches",
	{
		user1_id: integer()
			.notNull()
			.references(() => users.id),
		user2_id: integer()
			.notNull()
			.references(() => users.id),

		user1_status: match_status_enum().default("pending"),
		user2_status: match_status_enum().default("pending"),

		created_at: timestamp().defaultNow().notNull(),
		updated_at: timestamp()
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => ({ pk: primaryKey({ columns: [table.user1_id, table.user2_id] }) }),
);

export const projectMatches = pgTable(
	"project_matches",
	{
		user_id: integer()
			.notNull()
			.references(() => users.id),
		project_id: integer().references(() => projects.id),

		user_status: match_status_enum().default("pending"),
		project_status: match_status_enum().default("pending"),

		created_at: timestamp().defaultNow().notNull(),
		updated_at: timestamp()
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => ({ pk: primaryKey({ columns: [table.user_id, table.project_id] }) }),
);

export const userEmbeddings = pgTable("user_embeddings", {
	id: text()
		.primaryKey()
		.$defaultFn(() => generateId(20)),
	user_id: integer()
		.notNull()
		.references(() => users.id),
	embedding: vector({ dimensions: 768 }),
});

export const projectEmbeddings = pgTable("project_embeddings", {
	id: text()
		.primaryKey()
		.$defaultFn(() => generateId(20)),
	project_id: integer()
		.notNull()
		.references(() => projects.id),
	embedding: vector({ dimensions: 768 }),
});

export const userMatchRelations = relations(userMatches, ({ one }) => ({
	user1: one(users, { fields: [userMatches.user1_id], references: [users.id] }),
	user2: one(users, { fields: [userMatches.user2_id], references: [users.id] }),
}));

export const projectMatchRelations = relations(projectMatches, ({ one }) => ({
	user: one(users, { fields: [projectMatches.user_id], references: [users.id] }),
	project: one(projects, {
		fields: [projectMatches.project_id],
		references: [projects.id],
	}),
}));

// TODO: add indexes for faster lookups

export type User = typeof users.$inferSelect;
