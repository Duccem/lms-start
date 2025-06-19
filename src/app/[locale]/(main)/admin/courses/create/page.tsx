import { buttonVariants } from "@/lib/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/ui/components/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CreateCourseForm } from "../_components/create-course-form";

export default function CreateCoursePage() {
  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      <div className="flex items-center gap-4">
        <Link
          href={"/admin/courses"}
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-2xl font-medium">Crea un curso</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Información básica</CardTitle>
            <CardDescription>
              Aquí puedes ingresar la información básica de tu curso, como el
              título, la descripción y la imagen del curso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateCourseForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

