import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value; 

  const isLoginPage = request.nextUrl.pathname === '/';

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'], 
};
