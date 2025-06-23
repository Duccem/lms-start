import {
  BooleanValueObject,
  DateValueObject,
  StringValueObject,
} from "@/lib/ddd/core/value-object";
import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";

export class Question {
  constructor(
    public id: Uuid,
    public lessonQuizId: Uuid,
    public question: StringValueObject,
    public options: QuestionOption[],
    public createdAt: DateValueObject,
    public updatedAt: DateValueObject,
  ) {}

  static create(
    id: string,
    lessonQuizId: string,
    question: string,
    options: { option: string; isCorrect: boolean }[],
  ) {
    return new Question(
      Uuid.fromString(id),
      Uuid.fromString(lessonQuizId),
      new StringValueObject(question),
      options.map((option) => QuestionOption.create(option.option, option.isCorrect)),
      DateValueObject.today(),
      DateValueObject.today(),
    );
  }

  static fromPrimitives(data: Primitives<Question>) {
    return new Question(
      Uuid.fromString(data.id),
      Uuid.fromString(data.lessonQuizId),
      new StringValueObject(data.question),
      data.options.map((option) => QuestionOption.fromPrimitives(option)),
      new DateValueObject(data.createdAt),
      new DateValueObject(data.updatedAt),
    );
  }

  toPrimitives(): Primitives<Question> {
    return {
      id: this.id.value,
      lessonQuizId: this.lessonQuizId.value,
      question: this.question.value,
      options: this.options.map((option) => option.toPrimitives()),
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value,
    };
  }
}

export class QuestionOption {
  constructor(
    public option: StringValueObject,
    public isCorrect: BooleanValueObject,
  ) {}

  static create(option: string, isCorrect: boolean): QuestionOption {
    return new QuestionOption(new StringValueObject(option), new BooleanValueObject(isCorrect));
  }

  static fromPrimitives(data: Primitives<QuestionOption>): QuestionOption {
    return new QuestionOption(
      new StringValueObject(data.option),
      new BooleanValueObject(data.isCorrect),
    );
  }

  toPrimitives(): Primitives<QuestionOption> {
    return {
      option: this.option.value,
      isCorrect: this.isCorrect.value,
    };
  }
}
