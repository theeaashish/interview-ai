import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { getUserIdFromToken } from "@/lib/auth";
import { generateInterviewFeedback } from "@/lib/gemini";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // const { id } = params;
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

    // get interview id from params
    const interviewId = params.id;
    console.log(`Completing interview: ${interviewId}`);

    //find the interview
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return NextResponse.json(
        { message: "Interview not found" },
        { status: 404 }
      );
    }

    // verify that the interview belongs to the user
    if (interview.user.toString() !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // check if all questions have answers
    const unansweredQuestions = interview.questions.filter(
      (q: any) => !q.answer || q.answer.trim() === ""
    );
    if (unansweredQuestions.length > 0) {
      return NextResponse.json(
        {
          message:
            "All questions must be answered before completing the interview",
          unansweredCount: unansweredQuestions.length,
        },
        { status: 400 }
      );
    }

    // calculate the overall score based on the individual question scores
    const totalQuestions = interview.questions.length;
    let answeredQuestions = 0;
    let totalScore = 0;

    for (const question of interview.questions) {
      if (question.answer && question.analysis && question.analysis.score) {
        totalScore += question.analysis.score;
        answeredQuestions++;
      }
    }

    // calculate the average score
    const overallScore =
      answeredQuestions > 0 ? Math.round(totalScore / answeredQuestions) : 0;
    console.log(
      `Generating feedback for interview with overall score: ${overallScore}`
    );

    // generate overall feedback using gemini
    const feedback = await generateInterviewFeedback(interview);
    console.log("Feedback generated successfully");

    // update the interview with the overall score and feedback
    interview.overallScore = overallScore;
    interview.feedback = feedback;
    interview.status = "completed";
    interview.completedAt = new Date();

    await interview.save();
    console.log("interview marked as completed");

    // get the updated interview
    const updatedInterview = await Interview.findById(interviewId);
    if (!updatedInterview) {
      return NextResponse.json(
        { message: "Interview not found after completion" },
        { status: 404 }
      );
    }

    // return a simplified response
    return NextResponse.json(
      {
        message: "Interview completed successfully",
        success: true,
        interviewId: updatedInterview._id,
        status: "completed",
        redirectUrl: `/interview/${updatedInterview._id}/results`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
