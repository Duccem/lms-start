import { env } from "@/lib/env";
import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
  webhookSecret: env.POLAR_WEBHOOK_SECRET,
  onPayload: async (payload) => {
    console.log("Received webhook payload:", payload);
  },
});

