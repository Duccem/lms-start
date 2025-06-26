import { HttpNextResponse } from "@/lib/api/http-next-response";
import { routeHandler } from "@/lib/api/route-handler";
import { Primitives } from "@/lib/ddd/types/primitives";
import { SaveCourse } from "@/modules/course/application/save-course";
import { SearchCourses } from "@/modules/course/application/search-courses";
import { Course } from "@/modules/course/domain/course";
import { PrismaCourseRepository } from "@/modules/course/infrastructure/persistence/prisma-course-repository";
import { z } from "zod";

const createCourseSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(20, "Description must be at least 20 characters long"),
  summary: z.string().min(10, "Summary must be at least 10 characters long"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be a valid slug format"),
  category: z.string().min(3, "Category must be at least 3 characters long"),
  level: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Level is required",
    invalid_type_error: "Level must be one of beginner, intermediate, or advanced",
  }),
  price: z.number().min(0, "Price must be a non-negative number"),
  duration: z.number().min(0, "Duration must be a non-negative integer").default(0), // Duration in minutes
  status: z.enum(["draft", "published"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be either draft or published",
  }),
});

export const POST = routeHandler(
  {
    schema: createCourseSchema,
    name: "create-course",
  },
  async ({ user, body }) => {
    const service = new SaveCourse(new PrismaCourseRepository());

    await service.execute({
      ...body,
      authorId: user.id,
    } as Primitives<Course>);
  },
);

export const GET = routeHandler(
  {
    name: "search-courses",
    cache: {
      tags: (params) => {
        return ["courses", `user:${params.user.id}`];
      },
      ttl: 60,
    },
  },
  async ({}) => {
    const service = new SearchCourses(new PrismaCourseRepository());
    const courses = await service.execute();

    return { data: courses };
  },
  (error) => {
    return HttpNextResponse.internalServerError();
  },
);
