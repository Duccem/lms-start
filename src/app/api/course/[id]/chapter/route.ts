import { HttpNextResponse } from "@/lib/api/http-next-response";
import { routeHandler } from "@/lib/api/route-handler";
import { Primitives } from "@/lib/ddd/types/primitives";
import { SaveChapter } from "@/modules/course/application/save-chapter";
import { Chapter } from "@/modules/course/domain/chapter";
import { CourseNotFoundError } from "@/modules/course/domain/errors/course-not-found";
import { PrismaCourseRepository } from "@/modules/course/infrastructure/persistence/prisma-course-repository";
import { z } from "zod";

const saveChapterSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  position: z.number().int().min(0, "Position must be a non-negative integer"),
});

export const POST = routeHandler(
  { schema: saveChapterSchema, name: "save-chapter" },
  async ({ req, params }) => {
    const parsedInput = saveChapterSchema.parse(await req.json());
    const { id } = params;
    const service = new SaveChapter(new PrismaCourseRepository());

    await service.execute({
      id: parsedInput.id,
      title: parsedInput.title,
      description: parsedInput.description,
      position: parsedInput.position,
      courseId: id,
    } as Primitives<Chapter>);
  },
  (error) => {
    if (error instanceof CourseNotFoundError) {
      return HttpNextResponse.domainError(error, 404);
    }
    return HttpNextResponse.internalServerError();
  },
);
