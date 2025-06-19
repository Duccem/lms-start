import { database } from "@/lib/database";
import { DrizzleCriteriaConverter } from "@/lib/database/criteria-converter";
import { Criteria } from "@/lib/ddd/core/criteria";
import { Primitives } from "@/lib/ddd/types/primitives";
import { desc } from "drizzle-orm";
import { Course } from "../../domain/course";
import { CourseRepository } from "../../domain/course-repository";
import { course } from "./drizzle-course-schema";

export class DrizzleCourseRepository implements CourseRepository {
  private converter = new DrizzleCriteriaConverter(course);
  async save(data: Course): Promise<void> {
    await database.insert(course).values(data.toPrimitives()).execute();
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
}
