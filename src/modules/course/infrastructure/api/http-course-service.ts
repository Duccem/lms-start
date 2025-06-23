import { Primitives } from "@/lib/ddd/types/primitives";
import { Chapter } from "../../domain/chapter";
import { Course } from "../../domain/course";
import { Lesson } from "../../domain/lesson";

export async function createCourse(data: Partial<Primitives<Course>>): Promise<void> {
  const response = await fetch("/api/course", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create course");
  }
}

export async function fetchCourses(): Promise<Primitives<Course>[]> {
  const response = await fetch("/api/course");
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  const data = await response.json();
  return data.data as Primitives<Course>[];
}

export async function fetchCourseById(id: string): Promise<Primitives<Course>> {
  const response = await fetch(`/api/course/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }
  const data = await response.json();
  return data.data as Primitives<Course>;
}

export async function saveChapter(
  courseId: string,
  chapterData: Partial<Primitives<Chapter>>,
): Promise<void> {
  const response = await fetch(`/api/course/${courseId}/chapter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chapterData),
  });
  if (!response.ok) {
    throw new Error("Failed to save chapter");
  }
}

export async function saveLesson(
  courseId: string,
  chapterId: string,
  lessonData: Partial<Primitives<Lesson>>,
): Promise<void> {
  const response = await fetch(`/api/course/${courseId}/chapter/${chapterId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lessonData),
  });
  if (!response.ok) {
    throw new Error("Failed to save lesson");
  }
}
