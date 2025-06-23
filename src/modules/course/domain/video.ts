import { DateValueObject, NumberValueObject, StringValueObject } from "@/lib/ddd/core/value-object";
import { File } from "@/lib/ddd/core/value-objects/file";
import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";

export class LessonVideo {
  constructor(
    public id: Uuid,
    public lessonId: Uuid,
    public video: File,
    public duration: NumberValueObject,
    public createdAt: DateValueObject,
    public updatedAt: DateValueObject,
  ) {}

  static create(id: string, lessonId: string, video: string, duration: number): LessonVideo {
    return new LessonVideo(
      Uuid.fromString(id),
      Uuid.fromString(lessonId),
      new File(video),
      new NumberValueObject(duration),
      DateValueObject.today(),
      DateValueObject.today(),
    );
  }
  static fromPrimitives(data: Primitives<LessonVideo>): LessonVideo {
    return new LessonVideo(
      Uuid.fromString(data.id),
      Uuid.fromString(data.lessonId),
      new File(data.video),
      new NumberValueObject(data.duration),
      new DateValueObject(data.createdAt),
      new DateValueObject(data.updatedAt),
    );
  }

  toPrimitives(): Primitives<LessonVideo> {
    return {
      id: this.id.value,
      lessonId: this.lessonId.value,
      video: this.video.value,
      duration: this.duration.value,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }
}
