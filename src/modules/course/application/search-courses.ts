import { Criteria } from "@/lib/ddd/core/criteria";
import { Primitives } from "@/lib/ddd/types/primitives";
import { Course } from "../domain/course";
import { CourseRepository } from "../domain/course-repository";

export class SearchCourses {
  constructor(private repository: CourseRepository) {}

  async execute(): Promise<Primitives<Course>[]> {
    const courses = await this.repository.search(Criteria.fromValues([]));
    return courses.map((course) => course.toPrimitives());
  }
}
