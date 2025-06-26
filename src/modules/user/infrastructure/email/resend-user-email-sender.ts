import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import { UserEmailSender } from "../../domain/user-email-sender";
import VerifyEmail from "./templates/verification-email";

export class ResendUserEmailSender implements UserEmailSender {
  async sendEmailVerification(email: string, verificationCode: string): Promise<void> {
    await resend.emails.send({
      from: env.EMAIL_FROM || "",
      to: email,
      subject: "Email Verification",
      react: VerifyEmail({ verificationCode }),
    });
  }
  sendPasswordReset(email: string, verificationCode: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  sendWelcomeEmail(email: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  sendAccountDeletionConfirmation(email: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
