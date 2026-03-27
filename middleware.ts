import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
    const { pathname } = req.nextUrl;

    if (isMaintenanceMode) {
      // Exclude maintenance, admin, auth APIs, and static assets from redirect
      const isPublicAsset = pathname.includes('.') || pathname.startsWith('/_next') || pathname.startsWith('/images');
      const isAdminRoute = pathname.startsWith('/admin');
      const isAuthApi = pathname.startsWith('/api/auth');
      const isWebhook = pathname.startsWith('/api/checkout/nave/webhook');
      const isMaintenancePage = pathname.startsWith('/maintenance');

      if (!isMaintenancePage && !isAdminRoute && !isAuthApi && !isPublicAsset && !isWebhook) {
        return NextResponse.redirect(new URL('/maintenance', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Only require auth for admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === "ADMIN";
        }
        return true; // Other routes handled by maintenance check
      },
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Match all routes except some internal ones
};
