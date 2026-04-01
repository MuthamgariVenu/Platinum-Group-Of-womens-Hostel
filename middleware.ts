import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SESSION_TOKEN = 'pt_admin_2024_secure';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin sub-routes except the login page itself
  if (pathname.startsWith('/admin/')) {
    const session = request.cookies.get('admin_session');
    if (!session || session.value !== ADMIN_SESSION_TOKEN) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only run on /admin sub-paths — never on /admin itself (the login page)
  matcher: ['/admin/:path+'],
};
