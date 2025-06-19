import { Primitives } from "@/lib/ddd/types/primitives";
import { Course } from "../domain/course";
import { CourseRepository } from "../domain/course-repository";

export class CreateCourse {
  constructor(private readonly repository: CourseRepository) {}

  async execute(data: Primitives<Course>): Promise<void> {
    const course = Course.create(
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
      data.authorId
    );

    await this.repository.save(course);
  }
}

