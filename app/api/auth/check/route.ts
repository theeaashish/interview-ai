import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    try {
        // Get token from cookies
        const token = cookies().get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        
        return NextResponse.json({ 
            authenticated: true,
            user: decoded
        });
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
} 