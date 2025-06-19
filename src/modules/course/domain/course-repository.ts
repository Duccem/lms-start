import { Criteria } from "@/lib/ddd/core/criteria";
import { Course } from "./course";

export interface CourseRepository {
  save(course: Course): Promise<void>;
  search(criteria: Criteria): Promise<Course[]>;
}

