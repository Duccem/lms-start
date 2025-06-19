import { Aggregate } from "@/lib/ddd/core/aggregate";
import { DateValueObject } from "@/lib/ddd/core/value-object";
import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
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
    createdAt: DateValueObject,
    updatedAt: DateValueObject
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
      new DateValueObject(data.createdAt),
      new DateValueObject(data.updatedAt)
    );
  }
  static create(
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
    authorId: string
  ): Course {
    return new Course(
      Uuid.random(),
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
      DateValueObject.today(),
      DateValueObject.today()
    );
  }
}

