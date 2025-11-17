import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Return the next response without passing the request object
  // (NextResponse.next does not accept a `request` option here).
  let response = NextResponse.next();

  // Firebase auth is client-side, so we'll handle auth checks in the pages themselves
  // This middleware is kept for future server-side checks if needed

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
  * - /api (API routes)
  * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
