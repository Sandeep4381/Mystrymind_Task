
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get('taskzen_session')?.value;
  const session = sessionCookie ? JSON.parse(sessionCookie) : null;
  
  const isAuthPage = pathname.startsWith('/login');
  
  if (isAuthPage) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return null;
  }

  if (!session) {
    let from = pathname;
    if (request.nextUrl.search) {
      from += request.nextUrl.search;
    }
    
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, request.url));
  }
  
  if (pathname.startsWith('/dashboard/users') && session.role !== 'Super Admin' && session.role !== 'Admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
