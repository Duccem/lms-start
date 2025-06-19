import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
import { Course } from "../domain/course";
import { CourseRepository } from "../domain/course-repository";
import { CourseNotFoundError } from "../domain/errors/course-not-found";

export class FindCourse {
  constructor(private readonly repository: CourseRepository) {}

  async execute(id: string): Promise<Primitives<Course>> {
    const courseId = Uuid.fromString(id);
    const course = await this.repository.find(courseId);
    if (!course) {
      throw new CourseNotFoundError(id);
    }

    return course.toPrimitives();
  }
}
