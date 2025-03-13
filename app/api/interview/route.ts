import { NextResponse } from "next/server"; 
import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { getUserIdFromToken } from "@/lib/auth";
import { generateInterviewQuestions } from "@/lib/gemini";
import { extractTextFromPDF } from "@/lib/pdfExtractor";

export async function POST(req: Request) {
  try {
    await connectDB();

    // get token from authorization header
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // get user id from token
    const userId = getUserIdFromToken(token);

    // parse form data
    const formData = await req.formData();
    const jobRole = formData.get('jobRole') as string;
    const techStack = JSON.parse(formData.get('techStack') as string);
    const yearsOfExperience = JSON.parse(formData.get('yearsOfExperience') as string);
    const resumeFile = formData.get('resume') as File | null;

    if (!jobRole || !techStack) {
        return NextResponse.json({ message: 'All feilds are required' }, { status: 400 });
    }

    // extract text from resume
    let resumeText = '';
    try {

        if (resumeFile) {
            resumeText = await extractTextFromPDF(resumeFile);
        }

    } catch (error) {
        console.error('error processing resume: ', error);
    }

    // generate questions using gemini
    const context = resumeText ? `Job Role: ${jobRole}, Tech Stack: ${techStack.join(', ')}, Experience: ${yearsOfExperience} years. Resume: ${resumeText}`
    : `Job Role: ${jobRole}, Tech Stack: ${techStack.join(', ')}, Experience: ${yearsOfExperience} years`

    const questions = await generateInterviewQuestions(context);

    // create new interview session 
    const newInterview = new Interview({
        user: userId,
        jobRole,
        techStack,
        yearsOfExperience,
        resumeText,
        questions: questions.map((question) => ({
            text: question,
            answer: '',
            analysis: null,
        })),
        status: 'in-progress',
    });

    await newInterview.save();

    return NextResponse.json({ message: 'Interview created successfully', interview: newInterview }, { status: 201 });


  } catch (error) {
    console.error('Error creating interview: ', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}