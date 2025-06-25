import { routeHandler } from "@/lib/api/route-handler";
import { DeleteLesson } from "@/modules/course/application/delete-lesson";
import { PrismaCourseRepository } from "@/modules/course/infrastructure/persistence/prisma-course-repository";
import { NextResponse } from "next/server";

export const DELETE = routeHandler(async ({ params }) => {
  const { id: courseId, chapterId, lessonId } = params;

  const service = new DeleteLesson(new PrismaCourseRepository());

  await service.execute(courseId as string, chapterId as string, lessonId as string);
  return NextResponse.json({
    message: "Chapter deleted successfully",
  });
});
