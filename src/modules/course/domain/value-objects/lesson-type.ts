import { Enum } from "@/lib/ddd/core/value-objects/enum";

export enum LessonTypeValue {
  Video = "video",
  Article = "article",
  Quiz = "quiz",
}

export class LessonType extends Enum<LessonTypeValue> {
  constructor(value: LessonTypeValue) {
    super(value, Object.values(LessonTypeValue));
  }
  public static video(): LessonType {
    return new LessonType(LessonTypeValue.Video);
  }
  public static article(): LessonType {
    return new LessonType(LessonTypeValue.Article);
  }
  public static quiz(): LessonType {
    return new LessonType(LessonTypeValue.Quiz);
  }
  public static fromString(value: string): LessonType {
    if (!Object.values(LessonTypeValue).includes(value as LessonTypeValue)) {
      throw new Error(`Invalid lesson type: ${value}`);
    }
    return new LessonType(value as LessonTypeValue);
  }
}
