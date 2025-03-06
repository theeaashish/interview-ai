import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    //public routes
    const publicRoutes = ['/login', 'signup', '/api/auth/login', 'api/auth/signup'];
    if (publicRoutes.includes(req.nextUrl.pathname)) {
        return NextResponse.next();
    }

    // protected routes
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET!);
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/interview/:path*', '/api/interview/:path*'],
};