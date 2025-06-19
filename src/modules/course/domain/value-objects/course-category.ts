import { StringValueObject } from "@/lib/ddd/core/value-object";

export class CourseCategory extends StringValueObject {
  constructor(value: string) {
    super(value);
  }

  protected validation(value: string): void {
    const validCategories = [
      "Programming",
      "Design",
      "Marketing",
      "Business",
      "Data Science",
      "Personal Development",
      "Health & Fitness",
      "Music",
      "Photography",
      "Language Learning",
    ];

    if (!validCategories.includes(value)) {
      throw new Error(
        `Invalid course category. Valid categories are: ${validCategories.join(", ")}`
      );
    }
  }
}

