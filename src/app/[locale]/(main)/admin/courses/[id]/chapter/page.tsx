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
import { ChapterSection } from "../../_components/chapter-section";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/courses/${id}/edit`}
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-2xl font-medium">Crea un capitulo</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Información básica</CardTitle>
            <CardDescription>
              Aquí puedes ingresar la información básica de tu capítulo, como el título y la
              descripción.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChapterSection courseId={id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
