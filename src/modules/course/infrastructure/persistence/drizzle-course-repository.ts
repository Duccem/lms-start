import { database } from "@/lib/database";
import { DrizzleCriteriaConverter } from "@/lib/database/criteria-converter";
import { buildConflictUpdateColumns } from "@/lib/database/utils";
import { Criteria } from "@/lib/ddd/core/criteria";
import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
import { desc, eq } from "drizzle-orm";
import { Course } from "../../domain/course";
import { CourseRepository } from "../../domain/course-repository";
import { chapter, course, lesson } from "./drizzle-course-schema";

export class DrizzleCourseRepository implements CourseRepository {
  private converter = new DrizzleCriteriaConverter(course);
  async save(data: Course): Promise<void> {
    const { chapters, ...primitives } = data.toPrimitives();
    const lessons = chapters.flatMap((chapter) => chapter.lessons.map((lesson) => lesson));
    await database
      .insert(course)
      .values(primitives)
      .onConflictDoUpdate({ target: [course.id], set: primitives })
      .execute();
    await database
      .insert(chapter)
      .values(chapters)
      .onConflictDoUpdate({
        target: [chapter.id],
        set: buildConflictUpdateColumns(chapter, ["description", "position", "title"]),
      });
    await database
      .insert(lesson)
      .values(lessons)
      .onConflictDoUpdate({
        target: [lesson.id],
        set: buildConflictUpdateColumns(lesson, [
          "content",
          "position",
          "title",
          "videoUrl",
          "thumbnail",
        ]),
      });
  }

  async search(criteria: Criteria): Promise<Course[]> {
    const { where } = this.converter.criteria(criteria);
    const result: any[] = await database
      .select()
      .from(course)
      .where(where)
      .orderBy(desc(course.createdAt))
      .execute();
    return result.map((row: Primitives<Course>) => Course.fromPrimitives(row));
  }

  async find(id: Uuid): Promise<Course | null> {
    const result: any = await database.query.course.findFirst({
      where: eq(course.id, id.value),
      with: {
        chapters: {
          with: {
            lessons: true,
          },
        },
      },
    });
    if (!result) {
      return null;
    }
    return Course.fromPrimitives(result);
  }
}
