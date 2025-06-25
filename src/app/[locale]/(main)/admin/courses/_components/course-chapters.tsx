"use client";

import { Primitives } from "@/lib/ddd/types/primitives";
import { Button, buttonVariants } from "@/lib/ui/components/button";
import { Card } from "@/lib/ui/components/card";
import { cn } from "@/lib/ui/lib/utils";
import { Course } from "@/modules/course/domain/course";
import { deleteChapter } from "@/modules/course/infrastructure/api/http-course-service";
import {
  DndContext,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const CourseChapters = ({ data }: { data: Primitives<Course> }) => {
  const [editing, setEditing] = useState<string | null>(null);
  const initialItems = data.chapters.map((chapter) => ({
    id: chapter.id,
    position: chapter.position,
    title: chapter.title,
  }));
  const [items, setItems] = useState(initialItems);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over || !active) {
      return;
    }

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const router = useRouter();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (data: { courseId: string; chapterId: string }) => {
      await deleteChapter(data.courseId, data.chapterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      toast.success("Capítulo eliminado correctamente");
      router.refresh();
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.message || "Error al eliminar el capítulo");
    },
  });

  return (
    <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-semibold ">Capítulos</p>
          <Link href={`/admin/courses/${data.id}/chapter`} className={buttonVariants()}>
            Agregar capítulo
          </Link>
        </div>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} data={{ type: "chapter" }}>
              {(listeners) => (
                <Card className="p-0 border-input">
                  <div className="flex items-center justify-between p-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={"ghost"}
                        className="cursor-grab opacity-60 hover:opacity-100"
                        {...listeners}
                      >
                        <GripVertical className="size-4" />
                      </Button>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <p className="text-lg font-semibold hover:text-primary cursor-pointer">
                          {item.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/courses/${data.id}/chapter/${item.id}`}
                        className={buttonVariants({ variant: "ghost" })}
                      >
                        <Pencil />
                      </Link>
                      <Button
                        variant={"ghost"}
                        onClick={() => {
                          mutate({ courseId: data.id, chapterId: item.id });
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </SortableItem>
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default CourseChapters;

type SortableItemProps = {
  id: string;
  children?: (listeners: DraggableSyntheticListeners) => React.ReactNode;
  className?: string;
  data?: {
    type: "lesson" | "chapter";
    id?: string;
  };
};

function SortableItem({ id, children, className, data }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id,
    data: data,
    transition: {
      duration: 150, // milliseconds
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn("touch-none", className, {
        "z-10": isDragging,
      })}
    >
      {children?.(listeners)}
    </div>
  );
}
