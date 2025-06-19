import { StringValueObject } from "@/lib/ddd/core/value-object";

export class CourseThumbnail extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.validate(value);
  }

  private validate(value: string) {
    const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/;
    if (!urlRegex.test(value)) {
      throw new Error("Course thumbnail must be a valid URL.");
    }
  }
}

