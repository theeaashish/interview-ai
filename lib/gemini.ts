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
const INITIAL_RETRY_DELAY = 2000;

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
    if (retries > 0 && error?.status === 429) {
      console.log(
        `Rate limit exceeded. Retrying in ${delay}ms... (${retries} retries left)`
      );

      // Wait for the specified delay
      await new Promise((resolve) => setTimeout(resolve, delay));

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

    const prompt = `You are an expert technical interviewer.
    - Generate exactly 15 interview questions from ${context}.
    - Goal:
    - The first 3 questions MUST be soft-skill questions commonly asked across companies.
    - Exactly 5 questions in total MUST be soft-skill; the remaining 10 MUST be technical.
    - Place the remaining two soft-skill questions at positions 8 and 13.
    - Keep the tone professional and concise, suitable for a formal interview loop.

    Output rules (strict):
    - Return ONLY valid JSON; no prose, markdown, or comments.
    - JSON shape must be exactly:
    { "questions": ["question1", "question2", ...] }
    - The "questions" array length MUST be 15.
    - Each element MUST be a single-string question ending with "?" (no numbering, no labels, no multi-part).
    - Use standard JSON quoting (double quotes) with proper escaping; no trailing commas.

    Soft-skill guidance:
    - For the first 3 questions, choose from these common themes:
    1) Ownership/accountability under setbacks.
    2) Handling conflict or disagreement with a teammate/stakeholder.
    3) Prioritization/time management amid ambiguity.
    - The additional soft-skill questions at positions 8 and 13 should focus on:
    4) Receiving/giving feedback and adapting.
    5) Cross-functional communication or influencing without authority.
    - Keep each soft-skill question scenario-based, neutral, and ≤ 28 words.

    Technical guidance:
    - Derive topics directly from ${context}. If ${context} lacks detail, assume modern full-stack web development (Node.js/TypeScript/React/Next.js, REST/GraphQL, SQL/NoSQL, testing, security, performance, cloud, CI/CD).
    - Mix fundamentals and applied problem-solving: API design, data modeling, authentication/authorization, caching/performance, debugging, testing strategy, scalability, reliability, system design at the appropriate scope.
    - Avoid trivia and brainteasers; prefer “How would you…”, “What trade-offs…”, “Given X, how would you…”.
    - Keep each technical question ≤ 28 words, specific, and unambiguous.

    Language:
    - Use the language implied by ${context}; default to English.

    Validation checklist BEFORE responding (internal):
    1) Count = 15.
    2) Q1–Q3 are soft-skill; exactly 5 soft-skill in total; additional soft-skill at Q8 and Q13.
    3) All items end with "?" and are single sentences.
    4) JSON is syntactically valid and matches the exact shape.
    5) No explanations or extra keys.

    Now generate the JSON for ${context}.
`;

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
    const questionsAndAnswers = interview.questions
      .map((q: any, index: number) => {
        return `
      Question ${index + 1}: ${q.text}
      Answer: ${q.answer || "No answer provided"}
      Score: ${q.analysis?.score || "N/A"}
      Technical Feedback: ${q.analysis?.technicalFeedback || "N/A"}
      Communication Feedback: ${q.analysis?.communicationFeedback || "N/A"}
      `;
      })
      .join("\n");

    const prompt = `Generate comprehensive interview feedback based on the following interview for a ${
      interview.jobRole
    } position with ${
      interview.yearsOfExperience
    } years of experience in ${interview.techStack.join(", ")}.
    
    ${questionsAndAnswers}
    
    Provide an overall assessment of the candidate's performance, highlighting strengths, areas for improvement, and specific next steps for growth.
    
    Return valid JSON format:
    {
      "overallFeedback": string,
      "strengths": string[],
      "areasForImprovement": string[],
      "nextSteps": string[]
    }`;

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
