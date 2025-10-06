import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Protect all /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    // If not logged in → redirect
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // If support_agent → allow (district filtering happens in API layer)
    if (pathname.startsWith("/dashboard/district-agent")) {
      if (token.role !== "support_agent") {
        return NextResponse.redirect(new URL("/403", req.url));
      }
    }

    // Example: if you want admins to access /dashboard/admin
    if (pathname.startsWith("/dashboard/admin")) {
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/403", req.url));
      }
    }
  }

  return NextResponse.next();
}
