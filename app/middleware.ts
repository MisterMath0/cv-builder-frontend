import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = ['/cv/create', '/cv/list', '/cv/preview'];

export function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const accessToken = request.cookies.get('access_token')?.value; // Get token from cookies
  const refreshToken = request.cookies.get('refresh_token')?.value; // Optionally check refresh token

  console.log(`[Middleware] Current Path: ${currentPath}`);
  console.log(`[Middleware] Access Token: ${accessToken ? 'Present' : 'Missing'}`);
  console.log(`[Middleware] Refresh Token: ${refreshToken ? 'Present' : 'Missing'}`);

  // Redirect to login if trying to access protected routes without tokens
  if (protectedRoutes.some(route => currentPath.startsWith(route))) {
    console.log('[Middleware] Protected route detected.');

    if (!accessToken && !refreshToken) {
      console.log('[Middleware] No valid tokens. Redirecting to /login.');
      
      // Redirect to login with the return URL
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('returnUrl', currentPath); // Add return URL for navigation after login
      return NextResponse.redirect(redirectUrl);
    }

    console.log('[Middleware] Valid tokens detected. Proceeding.');
  }

  // Redirect authenticated users away from auth pages (e.g., login or register pages)
  if (currentPath.startsWith('/auth') || currentPath === '/register' || currentPath === '/login') {
    console.log('[Middleware] Auth page detected.');

    if (accessToken || refreshToken) {
      console.log('[Middleware] User already logged in. Redirecting to /cv/create.');
      return NextResponse.redirect(new URL('/cv/create', request.url)); // Redirect logged-in users
    }

    console.log('[Middleware] No tokens. Proceeding to auth page.');
  }

  // Allow all other requests
  console.log('[Middleware] No conditions matched. Allowing request to proceed.');
  return NextResponse.next();
}

// Middleware configuration
export const config = {
  matcher: [
    '/cv/:path*', // Protect all `/cv` routes
    '/auth/:path*', // Protect all `/auth` routes
    '/register', // Protect register route
    '/login', // Protect login route
  ],
};
