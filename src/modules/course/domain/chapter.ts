import { DateValueObject } from "@/lib/ddd/core/value-object";
import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
import { Lesson } from "./lesson";
import { ChapterDescription } from "./value-objects/chapter-description";
import { ChapterPosition } from "./value-objects/chapter-position";
import { ChapterTitle } from "./value-objects/chapter-title";

export class Chapter {
  constructor(
    public id: Uuid,
    public courseId: Uuid,
    public title: ChapterTitle,
    public description: ChapterDescription,
    public position: ChapterPosition,
    public lessons: Array<Lesson>,
    public createdAt: DateValueObject,
    public updatedAt: DateValueObject,
  ) {}

  public static create(
    id: string,
    courseId: string,
    title: string,
    description: string,
    position: number,
  ): Chapter {
    return new Chapter(
      Uuid.fromString(id),
      Uuid.fromString(courseId),
      new ChapterTitle(title),
      new ChapterDescription(description),
      new ChapterPosition(position),
      Lesson.initialize(),
      DateValueObject.today(),
      DateValueObject.today(),
    );
  }

  public static fromPrimitives(data: Primitives<Chapter>): Chapter {
    return new Chapter(
      Uuid.fromString(data.id),
      Uuid.fromString(data.courseId),
      new ChapterTitle(data.title),
      new ChapterDescription(data.description),
      new ChapterPosition(data.position),
      data.lessons
        ? data.lessons.map((lesson) => Lesson.fromPrimitives(lesson))
        : Lesson.initialize(),
      new DateValueObject(data.createdAt),
      new DateValueObject(data.updatedAt),
    );
  }

  public toPrimitives(): Primitives<Chapter> {
    return {
      id: this.id.value,
      courseId: this.courseId.value,
      title: this.title.value,
      description: this.description.value,
      position: this.position.value,
      lessons: this.lessons.map((lesson) => lesson.toPrimitives()),
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }

  static initialize(): Chapter[] {
    return [];
  }
}
