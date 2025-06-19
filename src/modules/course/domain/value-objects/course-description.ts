import { StringValueObject } from "@/lib/ddd/core/value-object";

export class CourseDescription extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.validate(value);
  }

  private validate(value: string) {
    if (value.length < 20 || value.length > 2000) {
      throw new Error(
        "Course description must be between 20 and 2000 characters."
      );
    }
  }
}

