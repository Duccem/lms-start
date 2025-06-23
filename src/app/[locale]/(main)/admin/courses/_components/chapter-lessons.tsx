"use client";

import { Primitives } from "@/lib/ddd/types/primitives";
import { Button, buttonVariants } from "@/lib/ui/components/button";
import { Card } from "@/lib/ui/components/card";
import { cn } from "@/lib/ui/lib/utils";
import { Lesson } from "@/modules/course/domain/lesson";
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
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ChapterLessons = ({
  data,
  chapterId,
  courseId,
}: {
  data: Primitives<Lesson>[];
  chapterId: string;
  courseId: string;
}) => {
  const [editing, setEditing] = useState<string | null>(null);
  const initialItems = data.map((lesson) => ({
    id: lesson.id,
    position: lesson.position,
    title: lesson.title,
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

  const setIsOpen = (id: string | boolean) => {
    if (id) {
      setEditing(id as string);
    } else {
      setEditing(null);
    }
  };

  return (
    <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-semibold ">Lecciones</p>
          <Link
            href={`/admin/courses/${courseId}/chapter/${chapterId}/lesson`}
            className={buttonVariants()}
          >
            Agregar lección
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
                      <p className="text-lg font-semibold hover:text-primary cursor-pointer">
                        {item.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant={"ghost"} onClick={() => setIsOpen(item.id)}>
                        <Pencil />
                      </Button>
                      <Button variant={"ghost"}>
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

export default ChapterLessons;

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
