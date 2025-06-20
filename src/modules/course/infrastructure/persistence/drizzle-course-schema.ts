import { user } from "@/modules/user/infrastructure/persistence/drizzle-user-schema";
import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const courseLevelEnum = pgEnum("course_level", ["beginner", "intermediate", "advanced"]);

export const courseStatusEnum = pgEnum("course_status", ["draft", "published", "archived"]);

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

export const chapter = pgTable("chapters", {
  id: uuid("id").primaryKey().defaultRandom(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => course.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const lesson = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  chapterId: uuid("chapter_id")
    .notNull()
    .references(() => chapter.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content"),
  videoUrl: text("video_url"),
  thumbnail: text("thumbnail"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const courseRelations = relations(course, ({ many, one }) => ({
  author: one(user, { fields: [course.authorId], references: [user.id] }),
  chapters: many(chapter),
}));

export const chapterRelations = relations(chapter, ({ many, one }) => ({
  course: one(course, { fields: [chapter.courseId], references: [course.id] }),
  lessons: many(lesson),
}));

export const lessonRelations = relations(lesson, ({ one }) => ({
  chapter: one(chapter, { fields: [lesson.chapterId], references: [chapter.id] }),
}));
