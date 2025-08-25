
import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // This is a workaround to get session on the server in middleware
  const sessionCookie = request.cookies.get('taskzen_session')?.value;
  const session = sessionCookie ? JSON.parse(sessionCookie) : null;
  
  const isAuthPage = pathname.startsWith('/login');
  
  if (isAuthPage) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return null;
  }

  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!session) {
    let from = pathname;
    if (request.nextUrl.search) {
      from += request.nextUrl.search;
    }
    
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
