import { routeHandler } from "@/lib/api/route-handler";
import { SaveLesson } from "@/modules/course/application/save-lesson";
import { PrismaCourseRepository } from "@/modules/course/infrastructure/persistence/prisma-course-repository";
import { NextResponse } from "next/server";
import { z } from "zod";

const saveLessonSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string(),
  position: z.number().int().nonnegative(),
  thumbnail: z.string().url(),
  type: z.enum(["video", "quiz", "article"]),
  quiz: z
    .object({
      timeLimit: z.coerce.number().min(0, "Time limit must be a non-negative number").optional(),
      passingScore: z.coerce
        .number()
        .min(0, "Passing score must be a non-negative number")
        .optional(),
      maxAttempts: z.coerce.number().int().min(1, "Max attempts must be at least 1").optional(),
      weight: z.coerce.number().min(0, "Weight must be a non-negative number").optional(),
      questions: z.array(
        z.object({
          question: z.string().min(1, "Question is required"),
          options: z.array(
            z.object({
              option: z.string().min(1, "Option is required"),
              isCorrect: z.boolean().optional().default(false),
            }),
          ),
        }),
      ),
    })
    .optional(),
  video: z
    .object({
      video: z.string().url("Video URL must be a valid URL"),
      duration: z.coerce.number().min(0, "Duration must be a non-negative number").optional(),
    })
    .optional(),
  article: z
    .object({
      content: z.string().min(1, "Article content is required"),
    })
    .optional(),
});

export const POST = routeHandler(async ({ req, params }) => {
  const { id: courseId, chapterId } = params;
  const parsedInput = saveLessonSchema.parse(await req.json());
  const service = new SaveLesson(new PrismaCourseRepository());
  await service.execute(
    {
      ...parsedInput,
      chapterId, // Allow id to be optional
    } as any,
    courseId,
  );
  return NextResponse.json({ message: "Lesson saved successfully" }, { status: 201 });
});
