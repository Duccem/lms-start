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
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }
  const response = I18nMiddleware(req);

  return betterAuthMiddleware(req, response, publicRoutes);
}
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(!api|trpc)(.*)"],
};

