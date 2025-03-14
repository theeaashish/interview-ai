import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { getUserIdFromToken } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
    try {
        await connectDB();

        // extract and await id
        const id = context.params.id;


        const { questionIndex, answer, analysis } = await req.json();

        // fetch the interview session
        const interview = await Interview.findById(id);
        if (!interview) {
            return NextResponse.json({ message: 'Interview not found' }, { status: 404 });
        }

        // update the questions with the user's answers and analysis
        interview.questions[questionIndex].answer = answer;
        interview.questions[questionIndex].analysis = analysis;

        // calculate the overall score
        const totalScore = interview.questions.reduce((sum: number, q: any) => sum + (q.analysis?.score || 0), 0);
        interview.overallScore = totalScore / interview.questions.length;

        await interview.save();

        return NextResponse.json({ message: 'Answer saved successfully' });
    } catch (error) {
        console.error('Error saving the answer: ', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
};

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    try {
        await connectDB();

        //extract id
        const id = context.params.id;

        // get token from authorization header
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized, token not found' }, { status: 401 });
        }

        // get user id from token
        const userId = getUserIdFromToken(token);

        // get interview id from params
        // const interviewId = id;

        // find the interviews
        const interview = await Interview.findById(id);
        if (!interview) {
            return NextResponse.json({ message: 'Interview not found' }, { status: 404 });
        }

        // verify the interview belongs to user
        if (interview.user.toString() !== userId) {
            return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
        }

        return NextResponse.json({ message: 'Interview retrieved successfully', interview }, { status: 200 });

    } catch (error) {
        console.error('Error retrieving interview', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}