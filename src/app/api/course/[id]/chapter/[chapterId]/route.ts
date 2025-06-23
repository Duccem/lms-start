import { routeHandler } from "@/lib/api/route-handler";
import { SaveLesson } from "@/modules/course/application/save-lesson";
import { DrizzleCourseRepository } from "@/modules/course/infrastructure/persistence/drizzle-course-repository";
import { NextResponse } from "next/server";
import { z } from "zod";

const saveLessonSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string(),
  videoUrl: z.string().url(),
  thumbnail: z.string().url(),
  position: z.number().int().nonnegative(),
});

export const POST = routeHandler(async ({ req, params }) => {
  const { id: courseId, chapterId } = params;
  const parsedInput = saveLessonSchema.parse(await req.json());
  const service = new SaveLesson(new DrizzleCourseRepository());
  await service.execute(
    {
      ...parsedInput,
      chapterId, // Allow id to be optional
    },
    courseId,
  );
  return NextResponse.json({ message: "Lesson saved successfully" }, { status: 201 });
});
