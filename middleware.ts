import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';

import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (
    req.nextUrl.pathname.startsWith('/admin') &&
    req.nextUrl.pathname !== '/admin/login' &&
    !req.auth
  ) {
    return NextResponse.redirect(
      new URL('/api/auth/signin', req.nextUrl),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'],
};
