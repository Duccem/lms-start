import { Primitives } from "@/lib/ddd/types/primitives";
import { Course } from "../../domain/course";

export async function createCourse(data: Partial<Primitives<Course>>) {
  const response = await fetch("/api/courses", {
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

