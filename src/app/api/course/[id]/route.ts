import { routeHandler } from "@/lib/api/route-handler";
import { FindCourse } from "@/modules/course/application/find-course";
import { DrizzleCourseRepository } from "@/modules/course/infrastructure/persistence/drizzle-course-repository";
import { NextResponse } from "next/server";

export const GET = routeHandler(async ({ params }) => {
  const { id } = params;
  const service = new FindCourse(new DrizzleCourseRepository());
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
