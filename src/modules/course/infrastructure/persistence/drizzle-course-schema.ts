import { user } from "@/modules/user/infrastructure/persistence/drizzle-user-schema";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const courseLevelEnum = pgEnum("course_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const courseStatusEnum = pgEnum("course_status", [
  "draft",
  "published",
  "archived",
]);

export const course = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  thumbnail: text("thumbnail"),
  price: integer("price").notNull(),
  duration: integer("duration").notNull().default(0), // Duration in minutes
  level: courseLevelEnum("level").notNull().default("beginner"),
  status: courseStatusEnum("status").notNull().default("draft"),
  category: text("category").notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

