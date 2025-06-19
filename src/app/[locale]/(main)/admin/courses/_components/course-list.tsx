"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/components/card";
import { fetchCourses } from "@/modules/course/infrastructure/api/http-course-service";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const CourseList = () => {
  const {
    data: courses,
    isPending,
    error,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      return await fetchCourses();
    },
    refetchOnWindowFocus: false,
  });
  if (isPending) {
    return (
      <div className="flex justify-center items-center w-full">
        <Loader2 className="size-16 animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-red-500 text-center">
        <p>Error cargando cursos: {error.message}</p>
      </div>
    );
  }
  if (!courses || courses.length === 0) {
    return (
      <div className="text-gray-500 text-center">
        <p>No hay cursos disponibles.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {courses.map((course) => (
        <Card key={course.id} className="flex flex-col p-0 overflow-hidden">
          <img src={course.thumbnail} alt="" className="" />
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-gray-300">{course.summary}</p>
            <p className="text-xs text-gray-400 mt-2">Categoría: {course.category}</p>
            <p className="text-xs text-gray-400">Nivel: {course.level}</p>
            <p className="text-xs text-gray-400">Precio: ${course.price.toFixed(2)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CourseList;
