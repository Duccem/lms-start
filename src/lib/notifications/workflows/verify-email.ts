import { workflow } from "@novu/framework";
import { render } from "@react-email/components";
import { z } from "zod";
import VerifyEmail from "../templates/otp-code";

export const verifyEmail = workflow(
  "email-verification",
  async ({ payload, step }) => {
    await step.email("email-verification-email", async () => {
      return {
        subject: "Verifica tu correo electrónico",
        body: await render(VerifyEmail({ verificationCode: payload.code })),
      };
    });
  },
  {
    payloadSchema: z.object({
      code: z.string().min(6, "Code must be at least 6 characters long"),
    }),
  }
);

