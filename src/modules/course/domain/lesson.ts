import { DateValueObject } from "@/lib/ddd/core/value-object";
import { File } from "@/lib/ddd/core/value-objects/file";
import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
import { LessonContent } from "./value-objects/lesson-content";
import { LessonPosition } from "./value-objects/lesson-position";
import { LessonTitle } from "./value-objects/lesson-title";

export class Lesson {
  constructor(
    public id: Uuid,
    public chapterId: Uuid,
    public title: LessonTitle,
    public content: LessonContent,
    public videoUrl: File,
    public thumbnail: File,
    public position: LessonPosition,
    public createdAt: DateValueObject,
    public updatedAt: DateValueObject,
  ) {}

  public static create(
    id: string,
    chapterId: string,
    title: string,
    content: string,
    videoUrl: string,
    thumbnail: string,
  ): Lesson {
    return new Lesson(
      Uuid.fromString(id),
      Uuid.fromString(chapterId),
      new LessonTitle(title),
      new LessonContent(content),
      new File(videoUrl),
      new File(thumbnail),
      LessonPosition.first(), // Default position, can be changed later
      DateValueObject.today(),
      DateValueObject.today(),
    );
  }
  public static fromPrimitives(data: Primitives<Lesson>): Lesson {
    return new Lesson(
      Uuid.fromString(data.id),
      Uuid.fromString(data.chapterId),
      new LessonTitle(data.title),
      new LessonContent(data.content),
      new File(data.videoUrl),
      new File(data.thumbnail),
      new LessonPosition(data.position),
      new DateValueObject(data.createdAt),
      new DateValueObject(data.updatedAt),
    );
  }

  public toPrimitives(): Primitives<Lesson> {
    return {
      id: this.id.value,
      chapterId: this.chapterId.value,
      title: this.title.value,
      content: this.content.value,
      videoUrl: this.videoUrl.value,
      thumbnail: this.thumbnail.value,
      position: this.position.value,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }

  static initialize(): Lesson[] {
    return [];
  }
}
