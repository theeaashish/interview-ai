import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { connectDB } from '@/lib/mongodb';

export async function POST(req: Request) {
    try {
        await connectDB();

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'all feilds are required' }, { status: 400 });
        }

        // check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: 'user not found'}, { status: 401 });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // generate jwt token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

        return NextResponse.json({ message: 'Login successful', token }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}