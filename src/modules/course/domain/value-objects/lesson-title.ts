import { StringValueObject } from "@/lib/ddd/core/value-object";

export class LessonTitle extends StringValueObject {
  constructor(public value: string) {
    super(value);
  }

  protected validation(value: string): void {
    if (!value || value.length < 3 || value.length > 100) {
      throw new Error("Lesson title must be between 3 and 100 characters long.");
    }
  }
}
