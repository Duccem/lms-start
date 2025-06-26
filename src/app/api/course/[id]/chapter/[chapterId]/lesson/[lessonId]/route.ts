import { HttpNextResponse } from "@/lib/api/http-next-response";
import { routeHandler } from "@/lib/api/route-handler";
import { DeleteLesson } from "@/modules/course/application/delete-lesson";
import { CourseNotFoundError } from "@/modules/course/domain/errors/course-not-found";
import { PrismaCourseRepository } from "@/modules/course/infrastructure/persistence/prisma-course-repository";

export const DELETE = routeHandler(
  { name: "delete-lesson", authenticated: true },
  async ({ params }) => {
    const { id: courseId, chapterId, lessonId } = params;

    const service = new DeleteLesson(new PrismaCourseRepository());

    await service.execute(courseId as string, chapterId as string, lessonId as string);
  },
  (error) => {
    if (error instanceof CourseNotFoundError) {
      HttpNextResponse.domainError(error, 404);
    }
    return HttpNextResponse.internalServerError();
  },
);
