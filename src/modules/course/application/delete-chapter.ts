import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { CourseRepository } from "../domain/course-repository";
import { ChapterNotDeleteableError } from "../domain/errors/chapter-not-deleteable";
import { CourseNotFoundError } from "../domain/errors/course-not-found";

export type DeleteChapterErrors = CourseNotFoundError | ChapterNotDeleteableError;

export class DeleteChapter {
  constructor(private readonly repository: CourseRepository) {}

  async execute(courseId: string, chapterId: string): Promise<void> {
    const course = await this.repository.find(Uuid.fromString(courseId));
    if (!course) {
      throw new CourseNotFoundError(courseId);
    }
    const courseUuid = Uuid.fromString(courseId);
    const chapterUuid = Uuid.fromString(chapterId);

    if (!course.chapterIsDeletable(chapterId)) {
      throw new ChapterNotDeleteableError(chapterId);
    }

    await this.repository.deleteChapter(courseUuid, chapterUuid);
  }
}
