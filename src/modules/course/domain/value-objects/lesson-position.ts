import { NumberValueObject } from "@/lib/ddd/core/value-object";

export class LessonPosition extends NumberValueObject {
  constructor(value: number) {
    super(value);
  }

  public validation(): void {
    if (this.value < 0) {
      throw new Error("Lesson position must be greater than or equal to zero.");
    }
  }
  public static first(): LessonPosition {
    return new LessonPosition(0);
  }
}
