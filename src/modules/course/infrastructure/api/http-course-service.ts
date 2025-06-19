import { Primitives } from "@/lib/ddd/types/primitives";
import { Course } from "../../domain/course";

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
