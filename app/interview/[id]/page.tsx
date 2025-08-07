"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import ErrorInterview from "@/components/errors/ErrorInterview";
import InterviewSession from "@/components/interviewSession/InterviewSession";
import InterviewNav from "@/components/interview/InterviewNav";

interface InterviewPageProps {
  params: {
    id: string;
  };
}

// define interview interfcae

interface Interview {
  _id: string;
  jobRole: string;
  techStack: string[];
  yearsOfExperience: number;
  status: string;
  questions: Array<{
    text: string;
    answer?: string;
    analysis?: {
      score: number;
      technicalFeedback: string;
      communicationFeedback: string;
      improvementSuggestions: string[];
    };
  }>;
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

export default function InterviewPage({ params }: InterviewPageProps) {
  // unwrap params using react.use()
  const unwrappedParams = use(params as unknown as Promise<{ id: string }>);
  const interviewId = unwrappedParams.id;

  const router = useRouter();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        // get token from local storage
        const token = localStorage.getItem("auth_token");

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`/api/interview/${interviewId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch interviews");
        }

        const data = await response.json();
        // console.log(data);
        setInterview(data.interview);

        // if interview is completed, redirect to result page
        if (data.interview.status === "completed") {
          router.push(`/interview/${interviewId}/results`);
          return;
        }
      } catch (error) {
        setError("Failed to load interviews. Please try again later");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId, router]);

  // function to update the interview data when an answer is submitted
  const handleInterviewUpdate = (updatedInterview: Interview) => {
    setInterview(updatedInterview);

    // if the interview is now completed, redirect to result page
    if (updatedInterview.status === "completed") {
      // use direct window location change for more reliable navigation
      window.location.href = `/interview/${interviewId}/results`;
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorInterview bg="red" errors={error} />;
  }

  if (!interview) {
    return <ErrorInterview errors="Interview not found" bg="yellow" />;
  }

  return (
    <>
      <InterviewNav interview={interview} />
      <div className="py-6 text-white max-sm:px-4 px-22">
        <div className="mb-6"></div>

        <InterviewSession
          interview={interview}
          onInterviewUpdate={handleInterviewUpdate}
        />
      </div>
    </>
  );
}
