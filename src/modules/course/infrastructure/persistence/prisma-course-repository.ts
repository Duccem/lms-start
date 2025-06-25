import { database } from "@/lib/database";
import { PrismaCriteriaConverter } from "@/lib/database/criteria-converter";
import { Criteria } from "@/lib/ddd/core/criteria";
import { Uuid } from "@/lib/ddd/core/value-objects/uuid";
import { Primitives } from "@/lib/ddd/types/primitives";
import { Chapter } from "../../domain/chapter";
import { Course } from "../../domain/course";
import { CourseRepository } from "../../domain/course-repository";
import { Lesson } from "../../domain/lesson";
import { Question } from "../../domain/question";

export class PrismaCourseRepository implements CourseRepository {
  private converter = new PrismaCriteriaConverter();
  async save(course: Course): Promise<void> {
    const { chapters, ...data }: Primitives<Course> = course.toPrimitives();
    await database.course.upsert({
      where: {
        id: data.id,
      },
      create: data,
      update: data,
    });
    await this.saveChapters(chapters);
  }
  async search(criteria: Criteria): Promise<Course[]> {
    const { where } = this.converter.criteria(criteria);
    const response: any = await database.course.findMany({
      where,
    });
    return response.map((course: Primitives<Course>) => Course.fromPrimitives(course));
  }
  async find(id: Uuid): Promise<Course | null> {
    const response: any = await database.course.findUnique({
      where: {
        id: id.value,
      },
      include: {
        chapters: {
          include: {
            lessons: {
              include: {
                article: true,
                video: true,
                quiz: {
                  include: {
                    questions: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!response) {
      return null;
    }
    return Course.fromPrimitives(response);
  }

  /**
   *
   * Funciones recursivas para guardar capítulos y lecciones.
   * primero se itera los capítulos y se guardan en la base de datos.
   * Luego, para cada capítulo, se itera las lecciones y se guardan.
   * Y para cada lección, se guardan los artículos, videos y cuestionarios.
   * En caso de que una lección tenga un cuestionario, se guardan las preguntas del cuestionario.
   */
  private async saveChapters(chapters: Primitives<Chapter>[]): Promise<void> {
    const upsertChapter = async (chapter: Primitives<Chapter>) => {
      const { lessons, ...data } = chapter;
      await database.chapter.upsert({
        where: {
          id: data.id,
        },
        create: data,
        update: data,
      });
      await this.saveLessons(lessons);
    };

    await Promise.all(chapters.map(upsertChapter));
  }

  protected async saveLessons(lessons: Primitives<Lesson>[]): Promise<void> {
    const upsertLesson = async (lesson: Primitives<Lesson>) => {
      const { article, video, quiz, ...data } = lesson;
      await database.lesson.upsert({
        where: {
          id: data.id,
        },
        create: data,
        update: data,
      });
      if (article) {
        await database.lessonArticle.upsert({
          where: {
            id: article.id,
          },
          create: article,
          update: article,
        });
      }
      if (video) {
        await database.lessonVideo.upsert({
          where: {
            id: video.id,
          },
          create: video,
          update: video,
        });
      }
      if (quiz) {
        const { questions, ...quizData } = quiz;
        await database.lessonQuiz.upsert({
          where: {
            id: quiz.id,
          },
          create: quizData,
          update: quizData,
        });
        await this.saveQuestions(questions);
      }
    };

    await Promise.all(lessons.map(upsertLesson));
  }

  protected async saveQuestions(questions: Primitives<Question>[]): Promise<void> {
    const upsertQuestion = async (question: Primitives<Question>) => {
      await database.question.upsert({
        where: {
          id: question.id,
        },
        create: question,
        update: question,
      });
    };

    await Promise.all(questions.map(upsertQuestion));
  }

  async deleteLesson(courseId: Uuid, chapterId: Uuid, lessonId: Uuid): Promise<void> {
    await database.lesson.delete({
      where: {
        id: lessonId.value,
        chapterId: chapterId.value,
        chapter: {
          courseId: courseId.value,
        },
      },
    });
  }
  async deleteChapter(courseId: Uuid, chapterId: Uuid): Promise<void> {
    await database.chapter.delete({
      where: {
        id: chapterId.value,
        courseId: courseId.value,
      },
    });
  }
}
