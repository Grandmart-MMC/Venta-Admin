import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import Negotiator from "negotiator";

const locales = ["en", "ru", "az"];
const defaultLocale = "en";
const protectedRoutes = ["/statistics", "/inquiries"];
const publicRoutes = ["/"];

function getLocale(request: NextRequest): string {
  const headers = {
    "accept-language": request.headers.get("accept-language") || "",
  };
  const languages = new Negotiator({ headers }).languages();
  return locales.find((lang) => languages.includes(lang)) || defaultLocale;
}


async function checkAuth(request: NextRequest): Promise<boolean> {
  console.log("Checking auth...", request);
  const token = cookies().get("auth-token")?.value;
  return !!token; 
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  const isAuthenticated = await checkAuth(request);
  const currentPath = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      currentPath.startsWith(`/${route}`) ||
      locales.some((locale) => currentPath.startsWith(`/${locale}${route}`))
  );

  const isPublicRoute = publicRoutes.some(
    (route) =>
      currentPath === `/${route}` ||
      locales.some((locale) => currentPath === `/${locale}/${route}`)
  );

  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL(`/${getLocale(request)}/`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isPublicRoute) {
    const dashboardUrl = new URL(
      `/${getLocale(request)}/statistics`,
      request.url
    );
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico).*)", // Tüm routeları kapsa
    "/statistics/:path*",
    "/inquiries/:path*",
  ],
};
