import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const role = token?.role as string | undefined;

    // Admin routes - only ADMIN can access
    if (pathname.startsWith("/admin")) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL(role === "KONSULTAN" ? "/consultant/dashboard" : "/dashboard", req.url));
      }
    }

    // Consultant routes - only KONSULTAN and ADMIN can access
    if (pathname.startsWith("/consultant")) {
      if (role !== "KONSULTAN" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Dashboard routes - only UMKM and ADMIN can access (consultants get redirected)
    if (pathname.startsWith("/dashboard")) {
      if (role === "KONSULTAN" && !pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/consultant/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/consultant/:path*",
    "/admin/:path*",
    "/consultations",
    "/profile",
    "/chat",
  ],
};
