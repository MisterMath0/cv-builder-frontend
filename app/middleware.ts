// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = ['/cv', '/auth-test', '/cv/create'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Check if the user is trying to access a protected route
  if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      // Redirect to login if the user is not authenticated
      const loginUrl = new URL('/auth/login', request.url);
      // Optionally, store the intended path for redirection after login
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent logged-in users from accessing login or register pages
  if (request.nextUrl.pathname.startsWith('/auth/login') || request.nextUrl.pathname.startsWith('/auth/register')) {
    if (token) {
      // Redirect to /cv or another authenticated page if logged in
      return NextResponse.redirect(new URL('/cv', request.url));
    }
  }

  // Continue the request
  return NextResponse.next();
}

// Define the routes where the middleware will run
export const config = {
  matcher: ['/cv/:path*', '/auth-test', '/auth/login', '/auth/register'],
};
