import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { getUserIdFromToken } from "@/lib/auth";
import { generateInterviewQuestions } from "@/lib/gemini";
import { extractTextFromPDF } from "@/lib/pdfExtractor";

// default questions by category for fallback
const DEFAULT_QUESTIONS = {
  frontend: [
    "Explain the difference between localStorage, sessionStorage, and cookies.",
    "What are React hooks and how do they improve component development?",
    "Describe how you would optimize a web application's performance.",
    "Explain the concept of responsive design and how you implement it.",
    "What is the virtual DOM in React and why is it important?",
    "Describe your experience with state management libraries like Redux or Context API.",
  ],
  backend: [
    "Explain RESTful API design principles and best practices.",
    "How do you handle database transactions and ensure data integrity?",
    "Describe your experience with authentication and authorization mechanisms.",
    "How would you design a scalable microservice architecture?",
    "Explain how you would implement error handling in a backend application.",
    "Describe your approach to API security and preventing common vulnerabilities.",
  ],
  fullstack: [
    "Explain how you would structure a full-stack application from frontend to backend.",
    "Describe your experience with API integration between frontend and backend.",
    "How do you handle state management across the full application stack?",
    "Explain your approach to testing in a full-stack application.",
    "Describe your experience with deployment and CI/CD pipelines.",
    "How would you implement real-time features in a full-stack application?",
  ],
  default: [
    "Describe a challenging technical problem you've solved recently.",
    "How do you stay updated with the latest technologies in your field?",
    "Explain your approach to debugging complex issues.",
    "Describe your experience working in agile development environments.",
    "How do you ensure code quality and maintainability?",
    "Describe your experience with version control and collaborative development.",
  ],
};

const getFallBackQuestions = (
  jobRole: string,
  techStack: string[]
): string[] => {
  const role = jobRole.toLowerCase();
  const stack = techStack.map((tech) => tech.toLowerCase());

  if (
    role.includes("frontend") ||
    stack.some((tech) =>
      [
        "react",
        "vue",
        "angular",
        "javascript",
        "typescript",
        "html",
        "css",
      ].includes(tech)
    )
  ) {
    return DEFAULT_QUESTIONS.frontend;
  }

  if (
    role.includes("backend") ||
    stack.some((tech) =>
      [
        "node",
        "express",
        "django",
        "flask",
        "spring",
        "java",
        "python",
        "c#",
        ".net",
      ].includes(tech)
    )
  ) {
    return DEFAULT_QUESTIONS.backend;
  }

  if (
    role.includes("fullstack") ||
    role.includes("full stack") ||
    (stack.some((tech) => ["react", "vue", "angular"].includes(tech)) &&
      stack.some((tech) => ["node", "express", "django"].includes(tech)))
  ) {
    return DEFAULT_QUESTIONS.fullstack;
  }

  return DEFAULT_QUESTIONS.default;
};

export async function POST(req: Request) {
  try {
    await connectDB();

    // get token from authorization header
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // get user id from token
    const userId = getUserIdFromToken(token);

    // parse form data
    const formData = await req.formData();
    const jobRole = formData.get("jobRole") as string;
    const techStack = JSON.parse(formData.get("techStack") as string);
    const yearsOfExperience = JSON.parse(
      formData.get("yearsOfExperience") as string
    );
    const resumeFile = formData.get("resume") as File | null;

    if (!jobRole || !techStack) {
      return NextResponse.json(
        { message: "All feilds are required" },
        { status: 400 }
      );
    }

    // extract text from resume
    let resumeText = "";
    try {
      if (resumeFile) {
        resumeText = await extractTextFromPDF(resumeFile);
      }
    } catch (error) {
      console.error("error processing resume: ", error);
    }

    // generate questions using gemini
    const context = resumeText
      ? `Job Role: ${jobRole}, Tech Stack: ${techStack.join(
          ", "
        )}, Experience: ${yearsOfExperience} years. Resume: ${resumeText}`
      : `Job Role: ${jobRole}, Tech Stack: ${techStack.join(
          ", "
        )}, Experience: ${yearsOfExperience} years`;

    let questions;
    let usedFallBack = false;

    try {
      questions = await generateInterviewQuestions(context);
    } catch (error: any) {
      console.error(
        "Failed to generate questions with gemini api, using fall back questions: ",
        error
      );

      // check if it's rate limit error
      const isRateLimitError =
        error.message &&
        (error.message.includes("429") ||
          error.message.includes("Too Many Requests") ||
          error.message.includes("RATE_LIMIT_EXCEEDED"));

      questions = getFallBackQuestions(jobRole, techStack);
      usedFallBack = true;
    }

    // create new interview session
    const newInterview = new Interview({
      user: userId,
      jobRole,
      techStack,
      yearsOfExperience,
      resumeText,
      questions: questions.map((question) => ({
        text: question,
        answer: "",
        analysis: null,
      })),
      status: "in-progress",
      usedFallbackQuestions: usedFallBack,
    });

    await newInterview.save();

    return NextResponse.json(
      {
        message: usedFallBack
          ? "interview created with default questions due to AI service limitation. Try again later for personalized questions."
          : "interview created successfully",
        interview: newInterview,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating interview: ", error);

    //provide more specific errors
    let errorMessage = "Internal server error";
    let statusCode = 500;

    if (
      (error.message && error.message.includes("rate limit")) ||
      (error.message && error.message.includes("429")) ||
      (error.message && error.message.includes("Too Many Requests"))
    ) {
      errorMessage =
        "AI service is currently busy. Please try again in few minutes.";
      statusCode = 429;
    } else if (
      error.message &&
      error.message.includes("failed to generate interview questions")
    ) {
      errorMessage =
        "Unable to generate interview questions. Please try again later.";
    }

    return NextResponse.json({ message: errorMessage }, { status: statusCode });
  }
}
