// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes more specifically
const protectedRoutes = ['/cv/create', '/cv/list', '/cv/preview'];

export function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const token = request.cookies.get('access_token')?.value; // Match localStorage key name

  // For protected routes
  if (protectedRoutes.some(route => currentPath.startsWith(route))) {
    if (!token) {
      // Redirect to login with return URL
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('returnUrl', currentPath);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // For auth pages
  if (currentPath.includes('/')) {
    if (token) {
      return NextResponse.redirect(new URL('/cv/create', request.url));
    }
  }

  return NextResponse.next();
}

// Update matcher to be more specific
export const config = {
  matcher: [
    '/cv/:path*',
    '/auth/:path*'
  ]
};