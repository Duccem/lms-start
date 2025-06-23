import { DateValueObject, StringValueObject } from "@/lib/ddd/core/value-object";
import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";

export class LessonArticle {
  constructor(
    public id: Uuid,
    public lessonId: Uuid,
    public content: StringValueObject,
    public createdAt: DateValueObject,
    public updatedAt: DateValueObject,
  ) {}

  static create(id: string, lessonId: string, content: string): LessonArticle {
    return new LessonArticle(
      Uuid.fromString(id),
      Uuid.fromString(lessonId),
      new StringValueObject(content),
      DateValueObject.today(),
      DateValueObject.today(),
    );
  }

  static fromPrimitives(data: Primitives<LessonArticle>): LessonArticle {
    return new LessonArticle(
      Uuid.fromString(data.id),
      Uuid.fromString(data.lessonId),
      new StringValueObject(data.content),
      new DateValueObject(data.createdAt),
      new DateValueObject(data.updatedAt),
    );
  }

  toPrimitives(): Primitives<LessonArticle> {
    return {
      id: this.id.value,
      lessonId: this.lessonId.value,
      content: this.content.value,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }
}
