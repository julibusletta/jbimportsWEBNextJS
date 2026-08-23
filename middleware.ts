import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    
    const isApi = pathname.startsWith('/api');
    const isAdmin = pathname.startsWith('/admin');
    const isMaintenance = pathname === '/maintenance';
    const isNextStatic = pathname.startsWith('/_next') || pathname.startsWith('/images') || pathname === '/favicon.ico';
    
    // REDIRECT TO MAINTENANCE for normal users
    if (!isApi && !isAdmin && !isMaintenance && !isNextStatic) {
      return NextResponse.redirect(new URL('/maintenance', req.url));
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
    pages: {
      signIn: '/login',
    }
  }
);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'], 
};
