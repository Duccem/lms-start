import { DateValueObject } from "@/lib/ddd/core/value-object";
import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
import { Lesson } from "./lesson";
import { ChapterDescription } from "./value-objects/chapter-description";
import { ChapterPosition } from "./value-objects/chapter-position";
import { ChapterTitle } from "./value-objects/chapter-title";
import { LessonTypeValue } from "./value-objects/lesson-type";

export class Chapter {
  constructor(
    public id: Uuid,
    public courseId: Uuid,
    public title: ChapterTitle,
    public description: ChapterDescription,
    public position: ChapterPosition,
    public lessons: Array<Lesson>,
    public createdAt: DateValueObject,
    public updatedAt: DateValueObject,
  ) {}

  public static create(
    id: string,
    courseId: string,
    title: string,
    description: string,
    position: number,
  ): Chapter {
    return new Chapter(
      Uuid.fromString(id),
      Uuid.fromString(courseId),
      new ChapterTitle(title),
      new ChapterDescription(description),
      new ChapterPosition(position),
      Lesson.initialize(),
      DateValueObject.today(),
      DateValueObject.today(),
    );
  }

  public static fromPrimitives(data: Primitives<Chapter>): Chapter {
    return new Chapter(
      Uuid.fromString(data.id),
      Uuid.fromString(data.courseId),
      new ChapterTitle(data.title),
      new ChapterDescription(data.description),
      new ChapterPosition(data.position),
      data.lessons
        ? data.lessons.map((lesson) => Lesson.fromPrimitives(lesson))
        : Lesson.initialize(),
      new DateValueObject(data.createdAt),
      new DateValueObject(data.updatedAt),
    );
  }

  public toPrimitives(): Primitives<Chapter> {
    return {
      id: this.id.value,
      courseId: this.courseId.value,
      title: this.title.value,
      description: this.description.value,
      position: this.position.value,
      lessons: this.lessons.map((lesson) => lesson.toPrimitives()),
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }

  static initialize(): Chapter[] {
    return [];
  }

  hasLesson(lessonId: string): boolean {
    return this.lessons.some((lesson) => lesson.id.value === lessonId);
  }
  saveLesson(lesson: Primitives<Lesson>): void {
    if (!this.hasLesson(lesson.id)) {
      const newLesson = Lesson.create(
        lesson.id,
        this.id.value,
        lesson.title,
        lesson.content,
        lesson.type,
        lesson.thumbnail,
        lesson.position,
      );
      switch (lesson.type) {
        case LessonTypeValue.Video:
          newLesson.setVideo(lesson.video!);
          break;
        case LessonTypeValue.Quiz:
          newLesson.setQuiz(lesson.quiz!);
          break;
        case LessonTypeValue.Article:
          newLesson.setArticle(lesson.article!);
          break;
        default:
          break;
      }
      this.lessons.push(newLesson);
    } else {
      const index = this.lessons.findIndex((l) => l.id.value === lesson.id);
      const newLesson = Lesson.fromPrimitives({
        ...this.lessons[index].toPrimitives(),
        ...lesson,
        id: this.lessons[index].id.value,
        chapterId: this.id.value,
      });
      switch (lesson.type) {
        case LessonTypeValue.Video:
          newLesson.setVideo(lesson.video!);
          break;
        case LessonTypeValue.Quiz:
          newLesson.setQuiz(lesson.quiz!);
          break;
        case LessonTypeValue.Article:
          newLesson.setArticle(lesson.article!);
          break;
        default:
          break;
      }
      this.lessons[index] = newLesson;
    }
    this.updatedAt = DateValueObject.today();
  }
}
