import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { getUserIdFromToken } from "@/lib/auth";
import { analyzeResponse } from "@/lib/gemini";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log("Received request for interview:", id);

    // connect to MongoDB
    try {
      await connectDB();
      console.log("MongoDB connected successfully");
    } catch (dbError) {
      console.error("MongoDB connection error:", dbError);
      return NextResponse.json(
        {
          message: "Database connection error",
          error: "Failed to connect to database",
        },
        { status: 500 }
      );
    }

    // get and validate token
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    if (!token) {
      console.log("No token provided");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // get user ID from token
    let userId;
    try {
      userId = getUserIdFromToken(token);
      console.log("User ID from token:", userId);
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return NextResponse.json(
        {
          message: "Invalid or expired token",
          error: "Authentication failed",
        },
        { status: 401 }
      );
    }

    // get interview ID from params
    const interviewId = id;
    console.log("Looking for interview:", interviewId);

    // parse request body
    const { questionIndex, answer } = await request.json();
    console.log("Received answer for question index:", questionIndex);

    // validate request body
    if (questionIndex === undefined || !answer) {
      return NextResponse.json(
        {
          message: "Question index and answer are required",
          received: { questionIndex, answer: answer ? "present" : "missing" },
        },
        { status: 400 }
      );
    }

    // find the interview
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      console.log("Interview not found:", interviewId);
      return NextResponse.json(
        { message: "Interview not found" },
        { status: 404 }
      );
    }

    // verify that the interview belongs to the user
    if (interview.user.toString() !== userId) {
      console.log("Unauthorized access attempt:", {
        userId,
        interviewUserId: interview.user,
      });
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // check if the question index is valid
    if (questionIndex < 0 || questionIndex >= interview.questions.length) {
      return NextResponse.json(
        {
          message: "Invalid question index",
          received: questionIndex,
          validRange: `0 to ${interview.questions.length - 1}`,
        },
        { status: 400 }
      );
    }

    // analyze the answer using Gemini
    try {
      console.log(
        `Analyzing answer for question ${questionIndex}: "${answer.substring(
          0,
          50
        )}..."`
      );
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
      console.log(
        `Interview updated successfully for question: ${questionIndex}`
      );

      // return the updated interview data
      return NextResponse.json(
        {
          message: "Answer submitted successfully",
          analysis,
          interview: {
            _id: interview._id,
            jobRole: interview.jobRole,
            techStack: interview.techStack,
            yearsOfExperience: interview.yearsOfExperience,
            questions: interview.questions,
            overallScore: interview.overallScore,
            status: interview.status,
            createdAt: interview.createdAt,
          },
        },
        { status: 200 }
      );
    } catch (analysisError) {
      console.error("Error during answer analysis:", analysisError);
      return NextResponse.json(
        {
          message: "Error analyzing answer",
          error:
            analysisError instanceof Error
              ? analysisError.message
              : "Unknown analysis error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in answer submission route:", error);

    // check for specific error types
    if (error instanceof Error) {
      if (error.message.includes("GEMINI_API_KEY")) {
        return NextResponse.json(
          {
            message: "AI analysis service configuration error",
            error: "Gemini API key is not properly configured",
          },
          { status: 500 }
        );
      }
      if (error.message.includes("MongoDB")) {
        return NextResponse.json(
          {
            message: "Database error",
            error: "Failed to connect to database",
          },
          { status: 500 }
        );
      }
    }

    // default error response
    return NextResponse.json(
      {
        message: "Internal server error",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
