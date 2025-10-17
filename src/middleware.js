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

    // If district_admin → allow (district filtering happens in API layer)
    if (pathname.startsWith("/dashboard/district-agent")) {
      if (token.role !== "district_admin") {
        return NextResponse.redirect(new URL("/404", req.url)); {/* will be 403 */}
      }
    }

    // Example: if you want admins to access /dashboard/admin
    if (pathname.startsWith("/dashboard/admin")) {
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/404", req.url)); {/* will be 403 */}
      }
    }
    // Example: if you want rider to access /dashboard/rider
    if (pathname.startsWith("/dashboard/rider")) {
      if (token.role !== "rider") {
        return NextResponse.redirect(new URL("/404", req.url)); {/* will be 403 */}
      }
    }

        if (pathname.startsWith("/dashboard/user")) {
      if (token.role !== "user") {
        return NextResponse.redirect(new URL("/404", req.url)); {/* will be 403 */}
      }
    }

  
  }

  return NextResponse.next();
}
