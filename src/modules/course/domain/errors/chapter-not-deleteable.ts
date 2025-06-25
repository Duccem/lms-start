import { DomainError } from "@/lib/ddd/core/domain-error";

export class ChapterNotDeleteableError extends DomainError {
  constructor(chapterId: string) {
    super(`No se puede eliminar el capítulo porque tiene lecciones asociadas`);
  }
}
