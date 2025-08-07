// types of speech
export interface ISpeechRecognition {
  start(): void;
  stop(): void;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
}

export interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: {
    isFinal: boolean;
    [key: number]: { transcript: string };
  }[];
}

export interface ISpeechRecognitionErrorEvent {
  error: string;
}

// add the declaration for speech recognition
declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

export interface Question {
  text: string;
  answer?: string;
  analysis?: {
    score: number;
    technicalFeedback: string;
    communicationFeedback: string;
    improvementSuggestions: string[];
  };
}

export interface Interview {
  _id: string;
  jobRole: string;
  techStack: string[];
  yearsOfExperience: number;
  status: string;
  questions: Question[];
  overallScore?: number;
  feedback?: {
    overallFeedback: string;
    strengths: string[];
    areasForImprovement: string[];
    nextSteps: string[];
  };
  createdAt: string;
  completedAt?: string;
}

export interface InterviewSessionProps {
  interview: Interview;
  onInterviewUpdate?: (updatedInterview: Interview) => void;
}
