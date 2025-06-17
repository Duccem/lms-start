import { env } from "@/lib/env";
import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: env.POLAR_SECRET_KEY,
  successUrl: env.POLAR_SUCCESS_URL,
  server: "sandbox", // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
});

