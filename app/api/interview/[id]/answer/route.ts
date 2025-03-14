import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";  
import Interview from "@/models/Interview";
import { getUserIdFromToken } from "@/lib/auth";
import { analyzeResponse } from "@/lib/gemini";

export async function POST(req: Request, context: { params: { id: string } }) {
    try {

        const { params } = context;

        await connectDB();
        
        //get token from authorization
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // get user id from token 
        const userId = getUserIdFromToken(token);

        // get user id from params
        const interviewId = params.id;

        // parse request body
        const { questionIndex, answer } = await req.json();

        // validate request body
        if (questionIndex === undefined || !answer) {
            return NextResponse.json({ message: 'Question index and answer are requuired'}, { status: 400 });
        }

        // find the interview 
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return NextResponse.json({ message: 'Interview not found' }, { status:404 });
        }

        // verify that the interview belongs to the user
        if (interview.user.toString() !== userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // check if the question index is valid
        if (questionIndex < 0 || questionIndex >= interview.questions.length) {
            return NextResponse.json({ message: 'Invalid question index' }, { status: 400 });
        }

        // analyze the answer using gemini
        console.log(`Analyzing answer for question ${questionIndex}: "${answer.substring(0, 50)}..."`);
        const question = interview.questions[questionIndex].text;
        const analysis = await analyzeResponse(question, answer);
        console.log(`Analysis complete with score: ${analysis.score}`);

        // update the interview with the answer and analysis
        interview.questions[questionIndex].answer = answer;
        interview.questions[questionIndex].analysis = analysis;

        // calculate the current overall score based on answered questions
        let totalScore = 0;
        let answeredQuestions = 0;

        for (const question of interview.questions) {
            if (question.answer && question.analysis && question.analysis.score) {
                totalScore += question.analysis.score;
                answeredQuestions++;
            }
        }

        // update the overall score
        if (answeredQuestions > 0) {
            interview.overallScore = Math.round(totalScore / answeredQuestions);
        }

        // save the updated interview
        await interview.save();
        console.log(`Interview updated successfully for questions: ${questionIndex}`);

        // return the updated interview data
        return NextResponse.json({
            message: 'Answer submitted successfully',
            analysis,
            interview: {
                _id: interview._id,
                jobRole: interview.jobRole,
                techStack: interview.techStack,
                yearsOfExperience: interview.yearsOfExperience,
                questions: interview.questions,
                overallScore: interview.overallScore,
                status: interview.status,
                createdAt: interview.createdAt
            } 
        }, { status: 200 });

    } catch (error) {
        console.error('Error submitting answer: ', error);
        return NextResponse.json({ message: 'internal server error', error: String(error) }, { status: 500 });
    }
}