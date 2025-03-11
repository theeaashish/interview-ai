import { NextResponse } from "next/server"; 
import { connectDB } from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { getUserIdFromToken } from "@/lib/auth";
import { generateInterviewQuestions } from "@/lib/gemini";
import { extractTextFromPDF } from "@/lib/pdfExtractor";

export async function POST(req: Request) {
  
}