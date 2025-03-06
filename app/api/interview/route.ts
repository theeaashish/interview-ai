import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { getUserIdFromToken } from "@/lib/auth";
import { generateInterviewQuestions } from '@/lib/gemini';
import { extractTextFromPDF } from '@/lib/pdfExtractor';

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
        // const { jobRole, techStack, yearsOfExperience } = await req.json();

        const formData = await req.formData();
        const jobRole = formData.get('jobRole') as string;
        const techStack = JSON.parse(formData.get('techStack') as string);
        const yearsOfExperience = parseInt(formData.get('yearsOfExperience') as string);
        const resumeFile = formData.get('resume') as File | null;

        if (!jobRole || !techStack || !yearsOfExperience) {
            return NextResponse.json(
              { message: 'All fields are required' },
              { status: 400 }
            );
        }

        // Extract text from resume (if provided)
        let resumeText = '';
         if (resumeFile) {
            resumeText = await extractTextFromPDF(resumeFile);
        }  

        // generate questions using gemini
        const context = resumeText || `Job Role: ${jobRole}, Tech Stack: ${techStack.join(', ')}, Experience: ${yearsOfExperience} years`;
        const questions = await generateInterviewQuestions(context);
      

        const newInterview = new Interview({
            user: userId,
            jobRole,
            techStack,
            yearsOfExperience,
            questions: questions.map((question) => ({
              text: question,
              answer: '',
              analysis: null,
            })),
            status: 'in-progress',
          });
        
        await newInterview.save();

        return NextResponse.json( { message: 'Interview created successfully', interview: newInterview }, { status: 201 });


    } catch (error) {
        console.error('Error creating interview:', error);
         return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}