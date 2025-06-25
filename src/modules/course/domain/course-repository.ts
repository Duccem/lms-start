import { Criteria } from "@/lib/ddd/core/criteria";
import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Course } from "./course";

export interface CourseRepository {
  save(course: Course): Promise<void>;
  search(criteria: Criteria): Promise<Course[]>;
  find(id: Uuid): Promise<Course | null>;
  deleteLesson(courseId: Uuid, chapterId: Uuid, lessonId: Uuid): Promise<void>;
  deleteChapter(courseId: Uuid, chapterId: Uuid): Promise<void>;
}
