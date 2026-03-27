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
    
    // Check for preview parameter or existing bypass cookie
    const isPreviewParam = req.nextUrl.searchParams.get('preview') === 'true';
    const hasBypassCookie = req.cookies.has('maintenance_bypass');
    const isPreview = isPreviewParam || hasBypassCookie;

    if (isMaintenanceMode && !isPreview) {
      if (!isMaintenancePage && !isAdminRoute && !isAuthApi && !isPublicAsset && !isApiRoute) {
        return NextResponse.redirect(new URL('/maintenance', req.url));
      }
    }

    const response = NextResponse.next();

    // If entering via preview handle, set the bypass cookie
    if (isPreviewParam) {
      response.cookies.set('maintenance_bypass', 'true', { maxAge: 60 * 60 * 24 }); // 24 hours
    }

    return response;
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
