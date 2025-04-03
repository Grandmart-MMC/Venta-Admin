import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "az", "ru"],
  defaultLocale: "en",
  localePrefix: "always",
});

const protectedRoutes = ["/inquiries"];

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const { pathname } = request.nextUrl;

  const pathWithoutLocale = pathname.replace(/^\/(en|az|ru)/, "");

  const token = request.cookies.get("auth-token")?.value;
  if (protectedRoutes.some((route) => pathWithoutLocale.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL(`/${request.nextUrl.locale}`, request.url);

      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
