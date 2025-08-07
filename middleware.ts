import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// Debug function to log middleware activity
const debug = (message: string, req: NextRequest) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Middleware] ${message} - Path: ${req.nextUrl.pathname}`);
  }
};

export function middleware(req: NextRequest) {
  // TEMPORARILY DISABLED - Allow all requests to pass through
  debug("Middleware disabled, allowing all requests", req);
  return NextResponse.next();

  /* Original middleware code - commented out for debugging
    // Skip middleware for static files and images
    if (
        req.nextUrl.pathname.startsWith('/_next') ||
        req.nextUrl.pathname.startsWith('/images') ||
        req.nextUrl.pathname.startsWith('/favicon.ico') ||
        req.nextUrl.pathname.includes('.') // Skip files with extensions
    ) {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;
    
    // Debug token presence
    debug(`Token: ${token ? 'Present' : 'Not present'}`, req);

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/signup', '/api/auth/login', '/api/auth/signup', '/api/auth/check'];
    
    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(route => 
        req.nextUrl.pathname === route || 
        req.nextUrl.pathname.startsWith(route + '/')
    );
    
    if (isPublicRoute) {
        debug('Public route, allowing access', req);
        return NextResponse.next();
    }

    // API routes that require authentication
    if (req.nextUrl.pathname.startsWith('/api/')) {
        if (!token) {
            debug('API route without token, returning 401', req);
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            debug(`API route with valid token for user: ${JSON.stringify(decoded)}`, req);
            return NextResponse.next();
        } catch (error) {
            debug(`API route with invalid token: ${error}`, req);
            return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
        }
    }

    // Protected page routes
    if (!token) {
        debug('Protected route without token, redirecting to login', req);
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        debug(`Protected route with valid token for user: ${JSON.stringify(decoded)}`, req);
        return NextResponse.next();
    } catch (error) {
        // Clear the invalid token
        debug(`Protected route with invalid token: ${error}`, req);
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.delete("token");
        return response;
    }
    */
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
