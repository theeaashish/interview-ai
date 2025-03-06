import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { getUserIdFromToken } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        await connectDB();

        // get tokens from cookies
        const token = req.headers.get('Authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // get user id from token
        const userId = getUserIdFromToken(token);

        const { jobRole, techStack, yearsOfExperience } = await req.json();

        if (!jobRole || !techStack || !yearsOfExperience) {
            return NextResponse.json(
              { message: 'All fields are required' },
              { status: 400 }
            );
        }

        const newInterview = new Interview({
            user: userId,
            jobRole,
            techStack,
            yearsOfExperience,
        });
        
        await newInterview.save();

        return NextResponse.json( { message: 'Interview created successfully', interview: newInterview }, { status: 201 });


    } catch (error) {
        console.error('Error creating interview:', error);
         return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}