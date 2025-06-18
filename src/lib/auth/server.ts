import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { database } from "../database";
import { env } from "../env";
import { nextCookies } from "better-auth/next-js";
import { bearer, emailOTP } from "better-auth/plugins";
import { headers } from "next/headers";
import { cache } from "react";
import { novu } from "../notifications";

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
        await novu.trigger({
          workflowId: type,
          to: {
            subscriberId: email,
            email,
          },
          payload: {
            code: otp,
          },
        });
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

