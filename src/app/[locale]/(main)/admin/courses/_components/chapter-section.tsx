"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/components/card";
import { Skeleton } from "@/lib/ui/components/skeleton";
import { fetchCourseById } from "@/modules/course/infrastructure/api/http-course-service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChapterForm } from "./chapter-form";
import ChapterLessons from "./chapter-lessons";

export const ChapterSection = ({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId?: string;
}) => {
  const router = useRouter();
  const { data, isPending, error } = useQuery({
    queryKey: ["course"],
    queryFn: async () => {
      return await fetchCourseById(courseId);
    },
    enabled: !!courseId,
  });
  if (isPending) {
    return (
      <div className="h-full w-full grid-cols-1 md:grid-cols-2 gap-4 p-6">
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold">Error loading course</h1>
        <p className="mt-4 text-gray-600">Please try again later.</p>
      </div>
    );
  }

  const chapter = data.chapters.find((c) => c.id === chapterId);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Información básica</CardTitle>
            <CardDescription>
              Aquí puedes editar la información básica de tu capítulo, como el título y la
              descripción.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChapterForm
              chaptersLength={data.chapters.length}
              courseId={courseId}
              closeSheet={() => router.push(`/admin/courses/${courseId}/edit`)}
              data={chapter || undefined}
            />
          </CardContent>
        </Card>
        {chapterId && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Estructura del curso</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                (Puedes editar la estructura del curso, como módulos y lecciones)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChapterLessons
                data={chapter?.lessons ?? []}
                chapterId={chapterId}
                courseId={courseId}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};
