import { routeHandler } from "@/lib/api/route-handler";
import { FindCourse } from "@/modules/course/application/find-course";
import { PrismaCourseRepository } from "@/modules/course/infrastructure/persistence/prisma-course-repository";
import { NextResponse } from "next/server";

export const GET = routeHandler(async ({ params }) => {
  const { id } = params;
  const service = new FindCourse(new PrismaCourseRepository());
  const course = await service.execute(id as string);
  return NextResponse.json(
    {
      data: course,
    },
    {
      status: 200,
    },
  );
});
