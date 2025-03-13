import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { connectDB } from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        await connectDB();

        const { email, password } = await req.json();

        console.log(`Login attempt for email: ${email}`);

        if (!email || !password) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User not found: ${email}`);
            return NextResponse.json({ message: 'User not found. Please check your email or sign up.' }, { status: 401 });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log(`Invalid password for user: ${email}`);
            return NextResponse.json({ message: 'Invalid password. Please try again.' }, { status: 401 });
        }

        // Generate JWT token
        const tokenData = { userId: user._id.toString(), email: user.email };
        console.log(`Creating token for user: ${JSON.stringify(tokenData)}`);
        
        const token = jwt.sign(
            tokenData,
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        console.log(`Token created successfully: ${token.substring(0, 20)}...`);

        // Return token directly in the response
        return NextResponse.json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ 
            success: false,
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? String(error) : undefined
        }, { status: 500 });
    }
}