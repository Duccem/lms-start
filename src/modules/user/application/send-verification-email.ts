import { UserEmailSender } from "../domain/user-email-sender";

export class SendVerificationEmail {
  constructor(private userEmailSender: UserEmailSender) {}

  async execute(email: string, verificationCode: string): Promise<void> {
    await this.userEmailSender.sendEmailVerification(email, verificationCode);
  }
}
