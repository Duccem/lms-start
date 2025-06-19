import { NumberValueObject } from "@/lib/ddd/core/value-object";

export class CoursePrice extends NumberValueObject {
  constructor(value: number) {
    super(value);
    this.validate(value);
  }

  private validate(value: number) {
    if (value < 0) {
      throw new Error("Course price cannot be negative.");
    }
  }
}

