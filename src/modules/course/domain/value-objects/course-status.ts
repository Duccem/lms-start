import { Enum } from "@/lib/ddd/core/value-objects/enum";

export enum CourseStatusValue {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export class CourseStatus extends Enum<CourseStatusValue> {
  constructor(value: CourseStatusValue) {
    super(value, Object.values(CourseStatusValue));
  }

  static fromString(value: string): CourseStatus {
    const enumValue =
      CourseStatusValue[value.toUpperCase() as keyof typeof CourseStatusValue];
    if (!enumValue) {
      throw new Error(`Invalid course status: ${value}`);
    }
    return new CourseStatus(enumValue);
  }

  static draft(): CourseStatus {
    return new CourseStatus(CourseStatusValue.DRAFT);
  }

  static published(): CourseStatus {
    return new CourseStatus(CourseStatusValue.PUBLISHED);
  }

  static archived(): CourseStatus {
    return new CourseStatus(CourseStatusValue.ARCHIVED);
  }

  toString(): string {
    return this.value;
  }
}

