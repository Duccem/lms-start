import { DateValueObject } from "@/lib/ddd/core/value-object";
import { File } from "@/lib/ddd/core/value-objects/file";
import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
import { LessonArticle } from "./article";
import { LessonQuiz } from "./quiz";
import { LessonContent } from "./value-objects/lesson-content";
import { LessonPosition } from "./value-objects/lesson-position";
import { LessonTitle } from "./value-objects/lesson-title";
import { LessonType, LessonTypeValue } from "./value-objects/lesson-type";
import { LessonVideo } from "./video";

export class Lesson {
  constructor(
    public id: Uuid,
    public chapterId: Uuid,
    public title: LessonTitle,
    public content: LessonContent,
    public type: LessonType,
    public thumbnail: File,
    public position: LessonPosition,
    public video: LessonVideo | null,
    public quiz: LessonQuiz | null,
    public article: LessonArticle | null,
    public createdAt: DateValueObject,
    public updatedAt: DateValueObject,
  ) {}

  public static create(
    id: string,
    chapterId: string,
    title: string,
    content: string,
    type: string,
    thumbnail: string,
    position: number,
  ): Lesson {
    return new Lesson(
      Uuid.fromString(id),
      Uuid.fromString(chapterId),
      new LessonTitle(title),
      new LessonContent(content),
      LessonType.fromString(type),
      new File(thumbnail),
      new LessonPosition(position),
      null,
      null,
      null,
      DateValueObject.today(),
      DateValueObject.today(),
    );
  }
  public static fromPrimitives(data: Primitives<Lesson>): Lesson {
    return new Lesson(
      Uuid.fromString(data.id),
      Uuid.fromString(data.chapterId),
      new LessonTitle(data.title),
      new LessonContent(data.content),
      LessonType.fromString(data.type),
      new File(data.thumbnail),
      new LessonPosition(data.position),
      data.video ? LessonVideo.fromPrimitives(data.video) : null,
      data.quiz ? LessonQuiz.fromPrimitives(data.quiz) : null,
      data.article ? LessonArticle.fromPrimitives(data.article) : null,
      new DateValueObject(data.createdAt),
      new DateValueObject(data.updatedAt),
    );
  }

  public toPrimitives(): Primitives<Lesson> {
    return {
      id: this.id.value,
      chapterId: this.chapterId.value,
      title: this.title.value,
      content: this.content.value,
      type: this.type.value,
      thumbnail: this.thumbnail.value,
      position: this.position.value,
      video: this.video ? this.video.toPrimitives() : null,
      quiz: this.quiz ? this.quiz.toPrimitives() : null,
      article: this.article ? this.article.toPrimitives() : null,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }

  static initialize(): Lesson[] {
    return [];
  }

  public update(
    title: string,
    content: string,
    type: string,
    thumbnail: string,
    position: number,
    typeData: Record<string, any> = {},
  ): void {
    this.title = new LessonTitle(title);
    this.content = new LessonContent(content);
    this.type = LessonType.fromString(type);
    this.thumbnail = new File(thumbnail);
    this.position = new LessonPosition(position);
    this.updatedAt = DateValueObject.today();

    if (this.type.value === LessonTypeValue.Video) {
      this.setVideo(typeData as Primitives<LessonVideo>);
    } else if (this.type.value === LessonTypeValue.Quiz) {
      this.setQuiz(typeData as Primitives<LessonQuiz>);
    } else if (this.type.value === LessonTypeValue.Article) {
      this.article?.update((typeData as Primitives<LessonArticle>).content);
    } else {
      this.video = null;
      this.quiz = null;
      this.article = null;
    }
  }

  public setVideo(video: Primitives<LessonVideo>): void {
    if (this.type.value !== LessonTypeValue.Video) {
      throw new Error("Cannot set video for non-video lesson type");
    }

    this.video = LessonVideo.create(
      Uuid.random().value,
      this.id.value,
      video.video,
      video.duration,
    );
  }

  public setQuiz(quiz: Primitives<LessonQuiz>): void {
    if (this.type.value !== LessonTypeValue.Quiz) {
      throw new Error("Cannot set quiz for non-quiz lesson type");
    }

    this.quiz = LessonQuiz.create(
      Uuid.random().value,
      this.id.value,
      quiz.timeLimit,
      quiz.passingScore,
      quiz.maxAttempts,
      quiz.weight,
      quiz.questions.map((q) => ({
        id: Uuid.random().value,
        title: q.question,
        options: q.options.map((option) => ({
          option: option.option,
          isCorrect: option.isCorrect,
        })),
      })),
    );
  }

  public setArticle(article: Primitives<LessonArticle>): void {
    if (this.type.value !== LessonTypeValue.Article) {
      throw new Error("Cannot set article for non-article lesson type");
    }

    this.article = LessonArticle.create(Uuid.random().value, this.id.value, article.content);
  }
}
