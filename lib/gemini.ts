import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Configure for Flash model
const generationConfig = {
  temperature: 0.7,
  topP: 1,
  topK: 32,
  maxOutputTokens: 2000,
};

interface GeneratedQuestions {
  questions: string[];
}

interface AnalysisResult {
  score: number;
  technicalFeedback: string;
  communicationFeedback: string;
  improvementSuggestions: string[];
}

export const generateInterviewQuestions = async (
  context: string
): Promise<string[]> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig,
    });

    const prompt = `Generate 8 technical interview questions in valid JSON format based on:
      ${context}
      
      Required format: { "questions": ["question1", "question2", ...] }`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    // Clean response and parse
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed: GeneratedQuestions = JSON.parse(cleaned);

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Invalid question format from API");
    }

    return parsed.questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate interview questions");
  }
};

export const analyzeResponse = async (
  question: string,
  answer: string
): Promise<AnalysisResult> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig,
    });

    const prompt = `Analyze this interview response (1-100 score) considering:
      - Technical accuracy (40%)
      - Communication clarity (30%)
      - Problem-solving (20%)
      - Best practices (10%)
      
      Question: ${question}
      Answer: ${answer}
      
      Return valid JSON format:
      {
        "score": number,
        "technicalFeedback": string,
        "communicationFeedback": string,
        "improvementSuggestions": string[]
      }`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    // Clean and validate response
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed: AnalysisResult = JSON.parse(cleaned);

    // Validate response structure
    if (
      typeof parsed.score !== "number" ||
      typeof parsed.technicalFeedback !== "string" ||
      typeof parsed.communicationFeedback !== "string" ||
      !Array.isArray(parsed.improvementSuggestions)
    ) {
      throw new Error("Invalid analysis format from API");
    }

    return parsed;
  } catch (error) {
    console.error("Error analyzing response:", error);
    throw new Error("Failed to analyze interview response");
  }
};
