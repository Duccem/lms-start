import { DateValueObject, NumberValueObject } from "@/lib/ddd/core/value-object";
import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
import { Question } from "./question";

export class LessonQuiz {
  constructor(
    public id: Uuid,
    public lessonId: Uuid,
    public timeLimit: NumberValueObject,
    public passingScore: NumberValueObject,
    public maxAttempts: NumberValueObject,
    public weight: NumberValueObject,
    public questions: Array<Question>,
    public createdAt: DateValueObject,
    public updatedAt: DateValueObject,
  ) {}

  static create(
    id: string,
    lessonId: string,
    timeLimit: number,
    passingScore: number,
    maxAttempts: number,
    weight: number,
    questions: Array<{
      id: string;
      title: string;
      options: Array<{ option: string; isCorrect: boolean }>;
    }>,
  ): LessonQuiz {
    return new LessonQuiz(
      Uuid.fromString(id),
      Uuid.fromString(lessonId),
      new NumberValueObject(timeLimit),
      new NumberValueObject(passingScore),
      new NumberValueObject(maxAttempts),
      new NumberValueObject(weight),
      questions.map((q) => Question.create(q.id, id, q.title, q.options)),
      DateValueObject.today(),
      DateValueObject.today(),
    );
  }

  static fromPrimitives(data: Primitives<LessonQuiz>): LessonQuiz {
    return new LessonQuiz(
      Uuid.fromString(data.id),
      Uuid.fromString(data.lessonId),
      new NumberValueObject(data.timeLimit),
      new NumberValueObject(data.passingScore),
      new NumberValueObject(data.maxAttempts),
      new NumberValueObject(data.weight),
      data.questions.map((q) => Question.fromPrimitives(q)),
      new DateValueObject(data.createdAt),
      new DateValueObject(data.updatedAt),
    );
  }
  toPrimitives(): Primitives<LessonQuiz> {
    return {
      id: this.id.value,
      lessonId: this.lessonId.value,
      timeLimit: this.timeLimit.value,
      passingScore: this.passingScore.value,
      maxAttempts: this.maxAttempts.value,
      weight: this.weight.value,
      questions: this.questions.map((q) => q.toPrimitives()),
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }
}
