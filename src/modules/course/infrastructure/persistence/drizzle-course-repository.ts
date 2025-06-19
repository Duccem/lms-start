import { database } from "@/lib/database";
import { DrizzleCriteriaConverter } from "@/lib/database/criteria-converter";
import { Criteria } from "@/lib/ddd/core/criteria";
import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
import { desc, eq } from "drizzle-orm";
import { Course } from "../../domain/course";
import { CourseRepository } from "../../domain/course-repository";
import { course } from "./drizzle-course-schema";

export class DrizzleCourseRepository implements CourseRepository {
  private converter = new DrizzleCriteriaConverter(course);
  async save(data: Course): Promise<void> {
    const primitives = data.toPrimitives();
    await database
      .insert(course)
      .values(primitives)
      .onConflictDoUpdate({ target: [course.id], set: primitives })
      .execute();
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
    const result: any[] = await database
      .select()
      .from(course)
      .where(eq(course.id, id.value))
      .execute();
    if (result.length === 0) {
      return null;
    }
    return Course.fromPrimitives(result[0]);
  }
}
