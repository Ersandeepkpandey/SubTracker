import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    // Redirect /dashboard route when accessing root while logged in
    if (pathname === "/" && req.nextauth.token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;
        // Protect dashboard routes
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/subscriptions") || pathname.startsWith("/calendar") || pathname.startsWith("/insights") || pathname.startsWith("/notifications") || pathname.startsWith("/settings") || pathname.startsWith("/admin")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sw.js|icon).*)"],
};
