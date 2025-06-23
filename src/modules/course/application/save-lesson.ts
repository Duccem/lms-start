import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
import { CourseRepository } from "../domain/course-repository";
import { CourseNotFoundError } from "../domain/errors/course-not-found";
import { Lesson } from "../domain/lesson";

export class SaveLesson {
  constructor(private readonly repository: CourseRepository) {}

  async execute(lesson: Partial<Primitives<Lesson>>, courseId: string): Promise<void> {
    const course = await this.repository.find(Uuid.fromString(courseId));
    if (!course) {
      throw new CourseNotFoundError(courseId);
    }

    course.saveLesson(lesson as Primitives<Lesson>);

    await this.repository.save(course);
  }
}
