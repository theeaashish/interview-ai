import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

export function middleware(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Verify the token
        const secret = process.env.JWT_SECRET as string;
        const decoded = verify(token, secret);

        if (!decoded) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware Error:", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*",],
};
