import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { CourseRepository } from "../domain/course-repository";
import { CourseNotFoundError } from "../domain/errors/course-not-found";

export class DeleteLesson {
  constructor(private readonly repository: CourseRepository) {}

  async execute(courseId: string, chapterId: string, lessonId: string): Promise<void> {
    const course = await this.repository.find(Uuid.fromString(courseId));
    if (!course) {
      throw new CourseNotFoundError(courseId);
    }
    const courseUuid = Uuid.fromString(courseId);
    const chapterUuid = Uuid.fromString(chapterId);
    const lessonUuid = Uuid.fromString(lessonId);

    await this.repository.deleteLesson(courseUuid, chapterUuid, lessonUuid);
  }
}
