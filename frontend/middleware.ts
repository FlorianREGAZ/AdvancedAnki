import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh the session if it exists
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there's no session and the user is trying to access a protected route
  console.log('Middleware session', session);

  // Skip auth checks for auth callback
  if (req.nextUrl.pathname === '/auth/callback') {
    return res;
  }

  if (!session && (req.nextUrl.pathname.startsWith('/project') || req.nextUrl.pathname === '/')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If there's a session and the user is trying to access auth pages
  if (session && (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup') || req.nextUrl.pathname === '/confirm-email')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/project';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/', '/project/:path*', '/login', '/signup', '/confirm-email', '/auth/callback'],
}; 