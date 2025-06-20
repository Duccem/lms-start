import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
import { Chapter } from "../domain/chapter";
import { CourseRepository } from "../domain/course-repository";
import { CourseNotFoundError } from "../domain/errors/course-not-found";

export class SaveChapter {
  constructor(private readonly repository: CourseRepository) {}

  async execute(data: Primitives<Chapter>): Promise<void> {
    const course = await this.repository.find(Uuid.fromString(data.courseId));
    if (!course) {
      throw new CourseNotFoundError(data.courseId);
    }

    course.saveChapter(data);
    await this.repository.save(course);
  }
}
