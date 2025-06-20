import { Aggregate } from "@/lib/ddd/core/aggregate";
import { DateValueObject } from "@/lib/ddd/core/value-object";
import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
import { Chapter } from "./chapter";
import { CourseCategory } from "./value-objects/course-category";
import { CourseDescription } from "./value-objects/course-description";
import { CourseDuration } from "./value-objects/course-duration";
import { CourseLevel } from "./value-objects/course-level";
import { CoursePrice } from "./value-objects/course-price";
import { CourseSlug } from "./value-objects/course-slug";
import { CourseStatus } from "./value-objects/course-status";
import { CourseSummary } from "./value-objects/course-summary";
import { CourseThumbnail } from "./value-objects/course-thumbnail";
import { CourseTitle } from "./value-objects/course-title";

export class Course extends Aggregate {
  constructor(
    id: Uuid,
    public title: CourseTitle,
    public summary: CourseSummary,
    public description: CourseDescription,
    public slug: CourseSlug,
    public thumbnail: CourseThumbnail,
    public price: CoursePrice,
    public duration: CourseDuration,
    public level: CourseLevel,
    public status: CourseStatus,
    public category: CourseCategory,
    public authorId: Uuid,
    public chapters: Array<Chapter>,
    createdAt: DateValueObject,
    updatedAt: DateValueObject,
  ) {
    super(id, createdAt, updatedAt);
  }

  toPrimitives(): Primitives<Course> {
    return {
      id: this.id.value,
      title: this.title.value,
      summary: this.summary.value,
      description: this.description.value,
      slug: this.slug.value,
      thumbnail: this.thumbnail.value,
      price: this.price.value,
      duration: this.duration.value,
      level: this.level.value,
      status: this.status.value,
      category: this.category.value,
      authorId: this.authorId.value,
      chapters: this.chapters.map((chapter) => chapter.toPrimitives()),
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }

  static fromPrimitives(data: Primitives<Course>): Course {
    return new Course(
      new Uuid(data.id),
      new CourseTitle(data.title),
      new CourseSummary(data.summary),
      new CourseDescription(data.description),
      new CourseSlug(data.slug),
      new CourseThumbnail(data.thumbnail),
      new CoursePrice(data.price),
      new CourseDuration(data.duration),
      new CourseLevel(data.level),
      new CourseStatus(data.status),
      new CourseCategory(data.category),
      new Uuid(data.authorId),
      data.chapters ? data.chapters.map((chapter) => Chapter.fromPrimitives(chapter)) : [],
      new DateValueObject(data.createdAt),
      new DateValueObject(data.updatedAt),
    );
  }
  static create(
    id: string,
    title: string,
    summary: string,
    description: string,
    slug: string,
    thumbnail: string,
    price: number,
    duration: number,
    level: string,
    status: string,
    category: string,
    authorId: string,
  ): Course {
    return new Course(
      Uuid.fromString(id),
      new CourseTitle(title),
      new CourseSummary(summary),
      new CourseDescription(description),
      new CourseSlug(slug),
      new CourseThumbnail(thumbnail),
      new CoursePrice(price),
      new CourseDuration(duration),
      CourseLevel.fromString(level),
      CourseStatus.fromString(status),
      new CourseCategory(category),
      Uuid.fromString(authorId),
      Chapter.initialize(), // Initialize with an empty array of chapters
      DateValueObject.today(),
      DateValueObject.today(),
    );
  }

  update(data: Primitives<Course>) {
    Course.fromPrimitives({
      ...this.toPrimitives(),
      ...data,
      id: this.id.value, // Ensure the ID remains the same
      createdAt: this.createdAt.value, // Keep the original creation date
      updatedAt: DateValueObject.today().value, // Update the updatedAt to now
    });
  }

  hasChapter(chapterId: string): boolean {
    return this.chapters.some((chapter) => chapter.id.value === chapterId);
  }

  saveChapter(chapter: Primitives<Chapter>): void {
    if (this.hasChapter(chapter.id)) {
      const existingChapterIndex = this.chapters.findIndex((c) => c.id.value === chapter.id);
      this.chapters[existingChapterIndex] = Chapter.fromPrimitives({
        ...this.chapters[existingChapterIndex].toPrimitives(),
        ...chapter,
        id: this.chapters[existingChapterIndex].id.value, // Ensure the ID remains the same
        courseId: this.id.value, // Update courseId to match the current course
      });
      this.chapters[existingChapterIndex].updatedAt = DateValueObject.today();
    } else {
      this.chapters.push(
        Chapter.create(
          chapter.id,
          this.id.value,
          chapter.title,
          chapter.description,
          chapter.position,
        ),
      );
    }
    this.updatedAt = DateValueObject.today();
  }
}
