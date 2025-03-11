import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'All fields are required' }, {status: 400});
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists. Please login instead.' }, { status: 400 });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token for automatic login
        const tokenData = { userId: newUser._id.toString(), email: newUser.email };
        
        const token = jwt.sign(
            tokenData,
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        // Return token directly in the response
        return NextResponse.json({
            success: true,
            message: "User created successfully",
            token: token,
            user: {
                id: newUser._id.toString(),
                name: newUser.name,
                email: newUser.email
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ 
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? String(error) : undefined
        }, { status: 500 });
    }
}