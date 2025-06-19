import { StringValueObject } from "@/lib/ddd/core/value-object";

export class CourseTitle extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.validate(value);
  }

  private validate(value: string) {
    if (value.length < 3 || value.length > 100) {
      throw new Error("Course title must be between 3 and 100 characters.");
    }
  }
}
