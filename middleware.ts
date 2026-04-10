import auth, { type NextRequestWithAuth }  from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequestWithAuth) {
  const url = req.nextUrl.clone();
  if (url.pathname === '/api/auth/callback/github' && url.searchParams.has('iss')) {
    url.searchParams.delete('iss');
    return NextResponse.redirect(url);
  }
  return auth(req);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/invoices/:path*',
    '/clients/:path*',
    '/timer/:path*',
    '/api/auth/callback/github',
  ],
};
