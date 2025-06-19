import { NumberValueObject } from "@/lib/ddd/core/value-object";

export class CourseDuration extends NumberValueObject {
  constructor(value: number) {
    super(value);
    this.validate(value);
  }

  private validate(value: number) {
    if (value <= 0) {
      throw new Error("Course duration must be a positive number.");
    }
  }
}
