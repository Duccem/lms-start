import { NumberValueObject } from "@/lib/ddd/core/value-object";

export class ChapterPosition extends NumberValueObject {
  constructor(value: number) {
    super(value);
  }

  public validation(value: number): void {
    if (value < 0) {
      throw new Error("Chapter position must be a non-negative integer.");
    }
  }

  public static first(): ChapterPosition {
    return new ChapterPosition(0);
  }
}
