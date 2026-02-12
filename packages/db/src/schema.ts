import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["provider", "seeker"]);
export const jobStatusEnum = pgEnum("job_status", [
  "open",
  "closed",
  "in_progress",
  "completed",
]);
export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "accepted",
  "rejected",
  "withdrawn",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "application",
  "message",
  "system",
  "job",
]);

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().notNull(),
    fullName: text("full_name"),
    role: text("role"),
    location: text("location"),
    avatarUrl: text("avatar_url"),
    phone: text("phone"),
    bio: text("bio"),
    skills: text("skills").array(),
    availability: text("availability"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    roleIdx: index("profiles_role_idx").on(table.role),
    locationIdx: index("profiles_location_idx").on(table.location),
  })
);

export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => profiles.id),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category"),
    budget: integer("budget"),
    hourlyRate: integer("hourly_rate"),
    state: text("state"),
    city: text("city"),
    duration: text("duration"),
    hasTimeline: boolean("has_timeline").default(false),
    skills: text("skills").array(),
    status: jobStatusEnum("status").default("open").notNull(),
    viewCount: integer("view_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    providerIdIdx: index("jobs_provider_id_idx").on(table.providerId),
    statusIdx: index("jobs_status_idx").on(table.status),
    categoryIdx: index("jobs_category_idx").on(table.category),
    locationIdx: index("jobs_location_idx").on(table.state, table.city),
    createdAtIdx: index("jobs_created_at_idx").on(table.createdAt),
    budgetIdx: index("jobs_budget_idx").on(table.budget),
    providerStatusIdx: index("jobs_provider_status_idx").on(
      table.providerId,
      table.status
    ),
  })
);

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id),
    seekerId: uuid("seeker_id")
      .notNull()
      .references(() => profiles.id),
    coverLetter: text("cover_letter"),
    proposedRate: integer("proposed_rate"),
    availability: text("availability"),
    status: applicationStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    jobIdIdx: index("applications_job_id_idx").on(table.jobId),
    seekerIdIdx: index("applications_seeker_id_idx").on(table.seekerId),
    statusIdx: index("applications_status_idx").on(table.status),
    createdAtIdx: index("applications_created_at_idx").on(table.createdAt),
    uniqueApplication: unique("applications_unique_idx").on(
      table.jobId,
      table.seekerId
    ),
  })
);

export const savedJobs = pgTable(
  "saved_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("saved_jobs_user_id_idx").on(table.userId),
    jobIdIdx: index("saved_jobs_job_id_idx").on(table.jobId),
    uniqueSave: unique("saved_jobs_unique_idx").on(table.userId, table.jobId),
  })
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id),
    type: notificationTypeEnum("type").notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    relatedJobId: uuid("related_job_id").references(() => jobs.id),
    relatedApplicationId: uuid("related_application_id").references(
      () => applications.id
    ),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("notifications_user_id_idx").on(table.userId),
    isReadIdx: index("notifications_is_read_idx").on(table.isRead),
    createdAtIdx: index("notifications_created_at_idx").on(table.createdAt),
    userUnreadIdx: index("notifications_user_unread_idx")
      .on(table.userId, table.isRead)
      .where(sql`${table.isRead} = false`),
  })
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => profiles.id),
    receiverId: uuid("receiver_id")
      .notNull()
      .references(() => profiles.id),
    jobId: uuid("job_id").references(() => jobs.id),
    content: text("content").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    senderIdIdx: index("messages_sender_id_idx").on(table.senderId),
    receiverIdIdx: index("messages_receiver_id_idx").on(table.receiverId),
    conversationIdx: index("messages_conversation_idx").on(
      table.senderId,
      table.receiverId,
      table.createdAt
    ),
  })
);

export const userPreferences = pgTable("user_preferences", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => profiles.id),
  emailNotifications: boolean("email_notifications").default(true).notNull(),
  pushNotifications: boolean("push_notifications").default(true).notNull(),
  theme: text("theme").default("system"),
  defaultFilters: jsonb("default_filters"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const posts = pgTable("bitwork_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type SavedJob = typeof savedJobs.$inferSelect;
export type NewSavedJob = typeof savedJobs.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type UserPreference = typeof userPreferences.$inferSelect;
export type NewUserPreference = typeof userPreferences.$inferInsert;
