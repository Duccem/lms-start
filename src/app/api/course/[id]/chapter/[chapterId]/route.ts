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
        return NextResponse.json({ message: error.message }, { status: 400 });
      default:
        console.error("Unexpected error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  },
);
