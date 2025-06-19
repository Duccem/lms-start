import { Enum } from "@/lib/ddd/core/value-objects/enum";

export enum CourseLevelValue {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}
export class CourseLevel extends Enum<CourseLevelValue> {
  constructor(value: CourseLevelValue) {
    super(value, Object.values(CourseLevelValue));
  }

  static fromString(value: string): CourseLevel {
    const enumValue =
      CourseLevelValue[value.toUpperCase() as keyof typeof CourseLevelValue];
    if (!enumValue) {
      throw new Error(`Invalid course level: ${value}`);
    }
    return new CourseLevel(enumValue);
  }

  static beginner(): CourseLevel {
    return new CourseLevel(CourseLevelValue.BEGINNER);
  }
  static intermediate(): CourseLevel {
    return new CourseLevel(CourseLevelValue.INTERMEDIATE);
  }
  static advanced(): CourseLevel {
    return new CourseLevel(CourseLevelValue.ADVANCED);
  }

  toString(): string {
    return this.value;
  }
}

