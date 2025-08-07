import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { getUserIdFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    // get token from autborization header
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer")
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    // get user id from token
    const userId = getUserIdFromToken(token);

    // find all interviews for the user
    const interviews = await Interview.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("-questions.answer");

    return NextResponse.json(
      { message: "Intervies retrieved successfully!", interviews },
      { status: 200 }
    );
  } catch (error) {
    console.error("error retrieving interviews", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
