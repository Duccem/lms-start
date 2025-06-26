export interface UserEmailSender {
  sendEmailVerification(email: string, verificationCode: string): Promise<void>;
  sendPasswordReset(email: string, verificationCode: string): Promise<void>;
  sendWelcomeEmail(email: string): Promise<void>;
  sendAccountDeletionConfirmation(email: string): Promise<void>;
}
