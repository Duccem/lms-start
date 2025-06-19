import { database } from "@/lib/database";
import { Course } from "../../domain/course";
import { CourseRepository } from "../../domain/course-repository";
import { course } from "./drizzle-course-schema";

export class DrizzleCourseRepository implements CourseRepository {
  async save(data: Course): Promise<void> {
    await database.insert(course).values(data.toPrimitives()).execute();
  }
}

