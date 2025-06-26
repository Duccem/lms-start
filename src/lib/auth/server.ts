import { SendVerificationEmail } from "@/modules/user/application/send-verification-email";
import { ResendUserEmailSender } from "@/modules/user/infrastructure/email/resend-user-email-sender";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { bearer, emailOTP } from "better-auth/plugins";
import { headers } from "next/headers";
import { cache } from "react";
import { database } from "../database";
import { env } from "../env";

export const auth = betterAuth({
  database: prismaAdapter(database, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    microsoft: {
      clientId: env.MICROSOFT_CLIENT_ID,
      clientSecret: env.MICROSOFT_CLIENT_SECRET,
      tenantId: "common",
    },
  },
  plugins: [
    nextCookies(),
    bearer(),
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {
        const sender = new ResendUserEmailSender();
        if (type === "email-verification") {
          const service = new SendVerificationEmail(sender);
          await service.execute(email, otp);
        }
      },
      sendVerificationOnSignUp: true,
      otpLength: 6,
    }),
  ],
  advanced: {
    database: {
      generateId: false,
    },
    cookiePrefix: "",
    cookies: {
      session_token: {
        name: "scholar_session",
      },
    },
  },
});
export type BetterSession = typeof auth.$Infer.Session;
export type BetterUser = typeof auth.$Infer.Session.user;

export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});
