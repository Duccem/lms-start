import { user } from "@/modules/user/infrastructure/persistence/drizzle-user-schema";
import { relations, sql } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const courseLevelEnum = pgEnum("course_level", ["beginner", "intermediate", "advanced"]);

export const courseStatusEnum = pgEnum("course_status", ["draft", "published", "archived"]);

export const lessonTypeEnum = pgEnum("lesson_type", ["video", "article", "quiz"]);

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
  content: text("content").notNull(),
  type: lessonTypeEnum("type").notNull().default("video"),
  thumbnail: text("thumbnail"),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const lessonVideo = pgTable("lesson_videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lesson.id, { onDelete: "cascade" }),
  video: text("video_url").notNull(),
  duration: integer("duration").notNull().default(0), // Duration in seconds
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const lessonArticle = pgTable("lesson_articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lesson.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const lessonQuiz = pgTable("lesson_quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lesson.id, { onDelete: "cascade" }),
  timeLimit: integer("time_limit").notNull().default(0), // Time limit in seconds
  passingScore: integer("passing_score").notNull().default(0), // Minimum score to pass the quiz
  maxAttempts: integer("max_attempts").notNull().default(1), // Maximum attempts allowed
  weight: integer("weight").notNull().default(1), // Weight of the quiz in the overall course score
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const question = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonQuizId: uuid("lesson_quiz_id")
    .notNull()
    .references(() => lessonQuiz.id, { onDelete: "cascade" }),
  question: text("question_text").notNull(),
  options: text("options")
    .array()
    .default(sql`'{}'::text[]`)
    .notNull(),
  answer: integer("correct_answer").default(0).notNull(), // Store the correct answer
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
  video: one(lessonVideo, { fields: [lesson.id], references: [lessonVideo.lessonId] }),
  article: one(lessonArticle, { fields: [lesson.id], references: [lessonArticle.lessonId] }),
  quiz: one(lessonQuiz, { fields: [lesson.id], references: [lessonQuiz.lessonId] }),
}));

export const lessonQuizRelations = relations(lessonQuiz, ({ many, one }) => ({
  lesson: one(lesson, { fields: [lessonQuiz.lessonId], references: [lesson.id] }),
  questions: many(question),
}));

export const questionRelations = relations(question, ({ one }) => ({
  lessonQuiz: one(lessonQuiz, { fields: [question.lessonQuizId], references: [lessonQuiz.id] }),
}));
