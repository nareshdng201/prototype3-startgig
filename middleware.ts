import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  // Debug logging for production
  if (process.env.NODE_ENV === 'production') {
    console.log('Middleware - Path:', request.nextUrl.pathname);
    console.log('Middleware - Token present:', !!token);
    console.log('Middleware - All cookies:', request.cookies.getAll());
  }

  // If no token is present, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  try {
    // Ensure JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in middleware');
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Get the user's role and path
    const userRole = payload.role as string;
    const path = request.nextUrl.pathname;

    // Check if user is trying to access a role-specific route
    if (path.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    if (path.startsWith('/employer') && userRole !== 'employer') {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    if (path.startsWith('/student') && userRole !== 'student') {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // Check if user is approved (except for admin routes)
    if (path.startsWith('/admin')) {
      return NextResponse.next();
    }

    // For employer and student routes, check approval status
    if (path.startsWith('/employer')) {
      const isApproved = payload.isApproved as string;
      if (isApproved !== 'approved') {
        return NextResponse.redirect(new URL('/auth/pending', request.url));
      }
    }

    // Token is valid and user has proper role and approval status
    return NextResponse.next();
  } catch (error) {
    // Token is invalid or expired, redirect to login
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin/:path*',
    '/employer/:path*',
    '/student/:path*',
    '/jobs/:path*',
    '/profile/:path*',
  ],
}; 