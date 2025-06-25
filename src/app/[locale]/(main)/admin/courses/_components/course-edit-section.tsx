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
import CourseChapters from "./course-chapters";
import { CreateCourseForm } from "./create-course-form";

const CourseEditSection = ({ id }: { id: string }) => {
  const {
    data: course,
    isPending,
    error,
  } = useQuery({
    queryKey: ["course"],
    queryFn: async () => {
      return await fetchCourseById(id);
    },
    enabled: () => !!id,
    refetchOnWindowFocus: false,
  });
  if (isPending) {
    return (
      <div className="h-full w-full p-6 flex flex-col gap-3">
        <div className="mb-8 h-16 w-1/3 flex">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-10">
          <Skeleton className="" />
          <Skeleton className="" />
        </div>
      </div>
    );
  }
  if (error || !course) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold">Error loading course</h1>
        <p className="mt-4 text-gray-600">Please try again later.</p>
      </div>
    );
  }
  return (
    <div className="h-full w-full p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">
        Editando el curso: <span className="text-primary">{course.title}</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Información del curso</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              (Puedes editar los detalles básicos del curso aquí)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateCourseForm data={course} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Estructura del curso</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              (Puedes editar la estructura del curso, como módulos y lecciones)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CourseChapters data={course} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseEditSection;
