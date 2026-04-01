import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const ADMIN_SESSION_TOKEN = 'pt_admin_2024_secure';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin/') || pathname === '/admin/dashboard') {
    const session = request.cookies.get('admin_session');
    if (!session || session.value !== ADMIN_SESSION_TOKEN) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path+'],
};
