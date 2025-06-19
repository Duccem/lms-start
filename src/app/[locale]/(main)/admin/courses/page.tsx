import { buttonVariants } from "@/lib/ui/components/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tus cursos</h1>
        <Link href={"/admin/courses/create"} className={buttonVariants()}>
          Agregar
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"></div>
    </div>
  );
}

