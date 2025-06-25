import { buttonVariants } from "@/lib/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ChapterSection } from "../../_components/chapter-section";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4 px-6 py-4 w-full">
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/courses/${id}/edit`}
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-2xl font-medium">Crea un capitulo</h1>
      </div>
      <ChapterSection courseId={id} />
    </div>
  );
}
