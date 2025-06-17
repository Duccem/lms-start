import { env } from "@/lib/env";
import { Polar } from "@polar-sh/sdk";

const client = new Polar({
  accessToken: env.POLAR_SECRET_KEY,
  server: env.NODE_ENV === "production" ? "production" : "sandbox",
});

export default client;
