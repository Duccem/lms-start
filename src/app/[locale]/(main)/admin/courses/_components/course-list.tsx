"use client";

import { Button, buttonVariants } from "@/lib/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/lib/ui/components/dropdown-menu";
import { fetchCourses } from "@/modules/course/infrastructure/api/http-course-service";
import { useQuery } from "@tanstack/react-query";
import {
  Archive,
  Eye,
  List,
  Loader2,
  MoreVertical,
  Pencil,
  School,
  Timer,
  Trash2,
} from "lucide-react";
import Link from "next/link";

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
        <Card key={course.id} className="flex flex-col p-0 overflow-hidden relative">
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"secondary"} size={"icon"}>
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/courses/${course.id}/edit`}>
                    <Pencil />
                    Editar curso
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/course/${course.slug}`}>
                    <Eye />
                    Previsualización
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/course/${course.slug}`}>
                    <Trash2 />
                    Eliminar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/course/${course.slug}`}>
                    <Archive />
                    Archivar
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <img src={course.thumbnail} alt="" className="" />
          <CardHeader>
            <CardTitle>
              <Link
                href={`/courses/${course.slug}`}
                className="hover:underline text-primary text-lg"
              >
                {course.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4 space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-tight">
              {course.summary}
            </p>
            <div className="mt-4 flex items-center gap-x-5">
              <div className="flex items-center gap-x-1 text-sm text-muted-foreground">
                <Timer className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                {course.duration} horas
              </div>
              <div className="flex items-center gap-x-1 text-sm text-muted-foreground">
                <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                {course.level}
              </div>
              <div className="flex items-center gap-x-1 text-sm text-muted-foreground">
                <List className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                {course.category}
              </div>
            </div>
            <Link
              href={`/admin/courses/${course.id}/edit`}
              className={buttonVariants({ size: "lg" }) + " w-full"}
            >
              <Pencil />
              Editar curso
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CourseList;
