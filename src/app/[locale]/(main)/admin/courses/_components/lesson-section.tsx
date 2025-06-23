"use client";

import { Skeleton } from "@/lib/ui/components/skeleton";
import { fetchCourseById } from "@/modules/course/infrastructure/api/http-course-service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LessonForm } from "./lesson-form";

export const LessonSection = ({
  courseId,
  chapterId,
  lessonId,
}: {
  courseId: string;
  chapterId: string;
  lessonId?: string;
}) => {
  const router = useRouter();
  const { data, isPending, error } = useQuery({
    queryKey: ["course"],
    queryFn: async () => {
      return await fetchCourseById(courseId);
    },
    enabled: !!courseId,
    refetchOnWindowFocus: false,
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
  const lesson = chapter?.lessons.find((l) => l.id === lessonId);

  return (
    <>
      <LessonForm
        lessonsLength={chapter?.lessons.length ?? 0}
        courseId={courseId}
        chapterId={chapterId}
        closeSheet={() => router.push(`/admin/courses/${courseId}/chapter/${chapterId}`)}
        data={lesson}
      />
    </>
  );
};
