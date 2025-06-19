import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
import { Course } from "../domain/course";
import { CourseRepository } from "../domain/course-repository";

export class SaveCourse {
  constructor(private readonly repository: CourseRepository) {}

  async execute(data: Primitives<Course>): Promise<void> {
    let course: Course | null = null;
    course = await this.repository.find(Uuid.fromString(data.id));
    if (course) {
      course.update(data);
    }
    course = Course.create(
      data.id,
      data.title,
      data.summary,
      data.description,
      data.slug,
      data.thumbnail,
      data.price,
      data.duration,
      data.level,
      data.status,
      data.category,
      data.authorId,
    );

    await this.repository.save(course);
  }
}
