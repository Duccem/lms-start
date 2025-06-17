import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { database } from "../database";
import { env } from "../env";
import { nextCookies } from "better-auth/next-js";
import { bearer, emailOTP } from "better-auth/plugins";
import { headers } from "next/headers";
import { cache } from "react";

export const auth = betterAuth({
  database: drizzleAdapter(database, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    nextCookies(),
    bearer(),
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {
        // Implement your email sending logic here
        console.log(`Sending OTP ${otp} to ${email} for ${type} verification.`);
        // For example, you could use a service like SendGrid or Nodemailer
      },
      sendVerificationOnSignUp: true,
      otpLength: 4,
    }),
  ],
  advanced: {
    generateId: false,
    cookiePrefix: "",
    cookies: {
      session_token: {
        name: "recipe_session",
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

