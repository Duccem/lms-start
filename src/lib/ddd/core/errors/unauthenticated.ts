import { DomainError } from "../domain-error";

/**
 * Unauthenticated error class that extends the DomainError class.
 * This error is thrown when a user is not authenticated.
 * @class Unauthenticated
 * @extends DomainError
 */
export class Unauthenticated extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
