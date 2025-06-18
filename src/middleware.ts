import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest, NextResponse } from "next/server";
import { betterAuthMiddleware } from "./lib/auth/middleware";

const publicRoutes = ["/sign-in", "/sign-up", "/recovery-password", "/"];

const I18nMiddleware = createI18nMiddleware({
  locales: ["es", "en"],
  defaultLocale: "es",
  urlMappingStrategy: "rewrite",
});
export default async function middleware(req: NextRequest) {
  const response = I18nMiddleware(req);

  return betterAuthMiddleware(req, response, publicRoutes);
}
export const config = {
  matcher: ["/((?!api|_next|[\\w-]+\\.\\w+).*)"],
};

