import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Test from "@/models/Test";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { userId, title, questions} = await req.json();

        if (!userId || !title) {
            return NextResponse.json({ message: "Missing feilds" }, { status: 400 });
        }

        const newTest = new Test({ userId, title, questions });
        await newTest.save();

        return NextResponse.json({ message: "test created successfully", test: newTest }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}