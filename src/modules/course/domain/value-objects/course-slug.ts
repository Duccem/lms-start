import { StringValueObject } from "@/lib/ddd/core/value-object";

export class CourseSlug extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.validate(value);
  }

  private validate(value: string) {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(value)) {
      throw new Error("Course slug must be a valid slug format.");
    }
  }
}

