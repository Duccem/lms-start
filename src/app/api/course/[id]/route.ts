import { HttpNextResponse } from "@/lib/api/http-next-response";
import { routeHandler } from "@/lib/api/route-handler";
import { FindCourse } from "@/modules/course/application/find-course";
import { CourseNotFoundError } from "@/modules/course/domain/errors/course-not-found";
import { PrismaCourseRepository } from "@/modules/course/infrastructure/persistence/prisma-course-repository";

export const GET = routeHandler(
  { name: "get-course" },
  async ({ params }) => {
    const { id } = params;
    const service = new FindCourse(new PrismaCourseRepository());
    const course = await service.execute(id as string);
    return { data: course };
  },
  (error) => {
    if (error instanceof CourseNotFoundError) {
      HttpNextResponse.domainError(error, 404);
    }
    return HttpNextResponse.internalServerError();
  },
);
