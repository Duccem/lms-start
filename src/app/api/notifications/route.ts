import { verifyEmail } from "@/lib/notifications/workflows/verify-email";
import { serve } from "@novu/framework/next";

export const { GET, POST, OPTIONS } = serve({ workflows: [verifyEmail] });
