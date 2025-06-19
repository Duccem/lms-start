import { StringValueObject } from "@/lib/ddd/core/value-object";

export class CourseSummary extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.validate(value);
  }

  private validate(value: string) {
    if (value.length < 10 || value.length > 500) {
      throw new Error("Course summary must be between 10 and 500 characters.");
    }
  }
}

