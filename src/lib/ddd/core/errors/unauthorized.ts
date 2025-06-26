import { DomainError } from "../domain-error";

/**
 * Representation of a domain error that can be thrown when the user is not authorized.
 */
export class Unauthorized extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
