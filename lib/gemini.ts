import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Configure for Flash model
const generationConfig = {
  temperature: 0.7,
  topP: 1,
  topK: 32,
  maxOutputTokens: 2000,
};

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000; // 2 seconds

/**
 * Helper function to implement exponential backoff for API calls
 */
const retryWithExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    // Check if it's a rate limit error (429)
    if (
      retries > 0 &&
      error?.status === 429
    ) {
      console.log(`Rate limit exceeded. Retrying in ${delay}ms... (${retries} retries left)`);
      
      // Wait for the specified delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry with increased delay (exponential backoff)
      return retryWithExponentialBackoff(fn, retries - 1, delay * 2);
    }
    
    // If it's not a rate limit error or we've exhausted retries, throw the error
    throw error;
  }
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

interface FeedbackResult {
  overallFeedback: string;
  strengths: string[];
  areasForImprovement: string[];
  nextSteps: string[];
}

export const generateInterviewQuestions = async (
  context: string
): Promise<string[]> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig,
    });

    const prompt = `Generate 6 technical interview questions in valid JSON format based on:
      ${context}
      
      Required format: { "questions": ["question1", "question2", ...] }`;

    // Use retry mechanism for API call
    const result = await retryWithExponentialBackoff(() => 
      model.generateContent(prompt)
    );
    
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

    // Use retry mechanism for API call
    const result = await retryWithExponentialBackoff(() => 
      model.generateContent(prompt)
    );
    
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

export const generateInterviewFeedback = async (
  interview: any
): Promise<FeedbackResult> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig,
    });

    // Prepare the interview data for the prompt
    const questionsAndAnswers = interview.questions.map((q: any, index: number) => {
      return `
      Question ${index + 1}: ${q.text}
      Answer: ${q.answer || "No answer provided"}
      Score: ${q.analysis?.score || "N/A"}
      Technical Feedback: ${q.analysis?.technicalFeedback || "N/A"}
      Communication Feedback: ${q.analysis?.communicationFeedback || "N/A"}
      `;
    }).join("\n");

    const prompt = `Generate comprehensive interview feedback based on the following interview for a ${interview.jobRole} position with ${interview.yearsOfExperience} years of experience in ${interview.techStack.join(", ")}.
    
    ${questionsAndAnswers}
    
    Provide an overall assessment of the candidate's performance, highlighting strengths, areas for improvement, and specific next steps for growth.
    
    Return valid JSON format:
    {
      "overallFeedback": string,
      "strengths": string[],
      "areasForImprovement": string[],
      "nextSteps": string[]
    }`;

    // Use retry mechanism for API call
    const result = await retryWithExponentialBackoff(() => 
      model.generateContent(prompt)
    );
    
    const text = await result.response.text();

    // Clean and validate response
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed: FeedbackResult = JSON.parse(cleaned);

    // Validate response structure
    if (
      typeof parsed.overallFeedback !== "string" ||
      !Array.isArray(parsed.strengths) ||
      !Array.isArray(parsed.areasForImprovement) ||
      !Array.isArray(parsed.nextSteps)
    ) {
      throw new Error("Invalid feedback format from API");
    }

    return parsed;
  } catch (error) {
    console.error("Error generating interview feedback:", error);
    throw new Error("Failed to generate interview feedback");
  }
};
