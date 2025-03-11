import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Test from "@/models/Test";
import type { JWTPayload } from "jose";

export async function GET(req: Request) {
    try {
        await connectDB();
        const token = req.headers.get("Authorization")?.split(" ")[1];

        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = await verifyToken(token);

        if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
            return NextResponse.json({ message: "Invalid token"}, { status: 401 });
        }

        const tests = await Test.find({ userId: decoded.userId });

        return NextResponse.json(tests, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: "Error fetching tests", error }, { status: 500 });
    }
}


export async function POST(req: Request) {
    try {
        await connectDB();
        const { title } = await req.json();

        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = await verifyToken(token) as JWTPayload & { userId: string };

        const newTest = new Test({
            userId: decoded.userId,
            title,
            status: "pending",
            questions: [],
            responses: [],
            score: 0,
        });

        await newTest.save();
        return NextResponse.json({ message: "Test created successfully", test: newTest}, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: "Error creating test", error }, { status: 500 });
    }
} 