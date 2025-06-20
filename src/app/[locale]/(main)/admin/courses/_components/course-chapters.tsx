"use client";

import { Primitives } from "@/lib/ddd/types/primitives";
import { Button, buttonVariants } from "@/lib/ui/components/button";
import { Card } from "@/lib/ui/components/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/lib/ui/components/collapsible";
import { cn } from "@/lib/ui/lib/utils";
import { Course } from "@/modules/course/domain/course";
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
import { ChevronDown, ChevronUpIcon, FileText, GripVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CourseChapters = ({ data }: { data: Primitives<Course> }) => {
  const initialItems = data.chapters.map((chapter) => ({
    id: chapter.id,
    position: chapter.position,
    title: chapter.title,
    isOpen: true,
    lessons: chapter.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      position: lesson.position,
    })),
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

  function toggleChapterOpen(id: string) {
    setItems((items) =>
      items.map((item) => (item.id === id ? { ...item, isOpen: !item.isOpen } : item)),
    );
  }

  return (
    <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-semibold ">Capítulos</p>
          <Button>
            <Link
              href={`/admin/courses/${data.id}/create-chapter`}
              className="flex items-center gap-2"
            >
              <span>Nuevo Capítulo</span>
            </Link>
          </Button>
        </div>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} data={{ type: "chapter" }}>
              {(listeners) => (
                <Card className="p-0 border-input">
                  <Collapsible open={item.isOpen} onOpenChange={() => toggleChapterOpen(item.id)}>
                    <div className="flex items-center justify-between p-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Button
                          variant={"ghost"}
                          className="cursor-grab opacity-60 hover:opacity-100"
                          {...listeners}
                        >
                          <GripVertical className="size-4" />
                        </Button>
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center gap-2 cursor-pointer">
                            {item.isOpen ? (
                              <ChevronUpIcon className="size-4" />
                            ) : (
                              <ChevronDown className="size-4" />
                            )}
                            <p className="text-lg font-semibold hover:text-primary cursor-pointer">
                              {item.title}
                            </p>
                          </div>
                        </CollapsibleTrigger>
                      </div>
                      <Button variant={"ghost"}>
                        <Trash2 />
                      </Button>
                    </div>
                    <CollapsibleContent>
                      <div className="">
                        <SortableContext
                          items={item.lessons.map((lesson) => lesson.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {item.lessons.map((lesson) => (
                            <SortableItem id={lesson.id} key={lesson.id} data={{ type: "lesson" }}>
                              {(listeners) => (
                                <div className="flex items-center justify-between p-3 border-b border-border">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant={"ghost"}
                                      {...listeners}
                                      className="cursor-grab"
                                    >
                                      <GripVertical className="size-4 opacity-60 hover:opacity-100 " />
                                    </Button>
                                    <FileText className="size-4" />
                                    <Link
                                      href={`/admin/courses/${data.id}/${lesson.id}`}
                                      className="text-sm font-medium"
                                    >
                                      {lesson.title}
                                    </Link>
                                  </div>

                                  <Button variant={"ghost"}>
                                    <Trash2 />
                                  </Button>
                                </div>
                              )}
                            </SortableItem>
                          ))}
                        </SortableContext>
                        <div className="w-full p-3">
                          <Link
                            href={`/admin/courses/${data.id}/chapter`}
                            className={buttonVariants() + " w-full"}
                          >
                            Agrega un nueva lección
                          </Link>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
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
