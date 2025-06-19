import { DomainError } from "@/lib/ddd/core/domain-error";

export class CourseNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Course with id ${id} not found`);
  }
}
