import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
    const { pathname } = req.nextUrl;

    // 1. Always allow API routes, admin, and static assets
    const isPublicAsset = pathname.includes('.') || pathname.startsWith('/_next') || pathname.startsWith('/images') || pathname.startsWith('/favicon.ico');
    const isAdminRoute = pathname.startsWith('/admin');
    const isAuthApi = pathname.startsWith('/api/auth');
    const isApiRoute = pathname.startsWith('/api/');
    const isMaintenancePage = pathname.startsWith('/maintenance');

    if (isMaintenanceMode) {
      if (!isMaintenancePage && !isAdminRoute && !isAuthApi && !isPublicAsset && !isApiRoute) {
        return NextResponse.redirect(new URL('/maintenance', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === "ADMIN";
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'], 
};
