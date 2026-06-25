import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

const publicRoutes = ['/auth/login', '/auth/register'];

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;

  if (!session) {
    if (publicRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/auth/login', nextUrl));
  }

  if (!publicRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/', nextUrl));
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
