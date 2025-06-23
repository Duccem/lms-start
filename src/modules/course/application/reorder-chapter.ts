import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { CourseRepository } from "../domain/course-repository";

export type ReorderChapterCommand = {
  courseId: string;
  chapterId: string;
  newPosition: number;
};

/**
 * Caso de uso para reordenar un capítulo dentro de un curso.
 */
export class ReorderChapter {
  constructor(private readonly courseRepository: CourseRepository) {}

  async execute(command: ReorderChapterCommand): Promise<void> {
    const course = await this.courseRepository.find(new Uuid(command.courseId));
    if (!course) {
      throw new Error(`Course with ID ${command.courseId} not found.`);
    }
    course.reorderChapter(command.chapterId, command.newPosition);
    await this.courseRepository.save(course);
  }
}
