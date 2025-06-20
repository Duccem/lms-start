import { StringValueObject } from "@/lib/ddd/core/value-object";

export class ChapterDescription extends StringValueObject {
  constructor(public value: string) {
    super(value);
  }

  protected validation(value: string): void {
    if (!value || value.length < 10 || value.length > 500) {
      throw new Error("Chapter description must be between 10 and 500 characters long.");
    }
  }
}
