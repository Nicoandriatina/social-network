
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");

  // if (isProtectedRoute && !token) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next(); // ne vérifie pas le JWT ici
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
