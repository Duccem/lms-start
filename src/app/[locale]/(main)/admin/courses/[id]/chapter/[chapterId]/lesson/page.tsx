import { buttonVariants } from "@/lib/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LessonSection } from "../../../../_components/lesson-section";

export default async function Page({ params }: { params: { id: string; chapterId: string } }) {
  const { id, chapterId } = await params;

  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/courses/${id}/edit`}
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-2xl font-medium">Edita la lección</h1>
      </div>
      <LessonSection courseId={id} chapterId={chapterId} />
    </div>
  );
}
