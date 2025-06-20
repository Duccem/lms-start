import { StringValueObject } from "@/lib/ddd/core/value-object";

export class LessonContent extends StringValueObject {
  constructor(public value: string) {
    super(value);
  }

  protected validation(value: string): void {
    if (!value || value.length < 10 || value.length > 5000) {
      throw new Error("Lesson content must be between 10 and 5000 characters long.");
    }
  }
}
