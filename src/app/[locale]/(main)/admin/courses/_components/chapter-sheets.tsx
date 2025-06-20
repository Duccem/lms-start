import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/lib/ui/components/sheet";

import { Primitives } from "@/lib/ddd/types/primitives";
import { Button } from "@/lib/ui/components/button";
import { Chapter } from "@/modules/course/domain/chapter";
import { useState } from "react";
import { ChapterForm } from "./chapter-form";

export const CreateChapterSheet = ({
  courseId,
  chaptersLength,
}: {
  courseId: string;
  chaptersLength: number;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Agregar Capitulo</Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="sm:w-1/3 sm:max-w-full p-4 bg-transparent border-none focus-visible:outline-none "
      >
        <div className="bg-background p-6 border border-sidebar h-full flex flex-col overflow-y-auto no-scroll gap-y-5 rounded-xl">
          <SheetHeader className="py-2 px-0">
            <SheetTitle>Nuevo Capitulo</SheetTitle>
            <SheetDescription>
              Completa el formulario para agregar un nuevo capitulo al curso.
            </SheetDescription>
          </SheetHeader>

          <ChapterForm
            courseId={courseId}
            chaptersLength={chaptersLength}
            closeSheet={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const EditChapterSheet = ({
  data,
  courseId,
  chaptersLength,
  open,
  onOpenChange,
}: {
  data?: Primitives<Chapter>;
  courseId: string;
  chaptersLength: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:w-1/3 sm:max-w-full p-4 bg-transparent border-none focus-visible:outline-none "
      >
        <div className="bg-background p-6 border border-sidebar h-full flex flex-col overflow-y-auto no-scroll gap-y-5 rounded-xl">
          <SheetHeader className="py-2 px-0">
            <SheetTitle>Editar Capitulo</SheetTitle>
            <SheetDescription>Modifica los detalles del capitulo.</SheetDescription>
          </SheetHeader>

          <ChapterForm
            data={data}
            courseId={courseId}
            chaptersLength={chaptersLength}
            closeSheet={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
