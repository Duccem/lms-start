import { HttpNextResponse } from "@/lib/api/http-next-response";
import { routeHandler } from "@/lib/api/route-handler";
import { DeleteChapter, DeleteChapterErrors } from "@/modules/course/application/delete-chapter";
import { ChapterNotDeleteableError } from "@/modules/course/domain/errors/chapter-not-deleteable";
import { CourseNotFoundError } from "@/modules/course/domain/errors/course-not-found";
import { PrismaCourseRepository } from "@/modules/course/infrastructure/persistence/prisma-course-repository";
import { NextResponse } from "next/server";

export const DELETE = routeHandler(
  async ({ params }) => {
    const { id: courseId, chapterId } = params;

    const service = new DeleteChapter(new PrismaCourseRepository());

    await service.execute(courseId as string, chapterId as string);
    return NextResponse.json({
      message: "Chapter deleted successfully",
    });
  },
  (error: DeleteChapterErrors) => {
    switch (true) {
      case error instanceof CourseNotFoundError:
      case error instanceof ChapterNotDeleteableError:
        return HttpNextResponse.domainError(error, 400);
      default:
        console.error("Unexpected error:", error);
        return HttpNextResponse.internalServerError();
    }
  },
);
