import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: 'All feilds are required' }, {status: 400});
        }

        // check if the user already exists

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ message: 'user already exists' }, { status: 400 });
        }

        // hash the password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        return NextResponse.json({ message: "user created successfully" }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}