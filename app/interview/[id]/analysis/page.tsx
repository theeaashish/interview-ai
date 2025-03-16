"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/Loader";
import ErrorInterview from "@/components/errors/ErrorInterview";
import MainButton from "@/components/AnalysisPage/MainButton";
import QuestionList from "@/components/AnalysisPage/QuestionList";
import QuizAndAnswer from "@/components/AnalysisPage/QuizAndAnswer";

interface AnalysisProps {
  params: {
    id: string;
  };
}

export default function AnalysisPage({ params }: AnalysisProps) {
  // unwrap params using React.use()
  const unwrappedParams = use(params as unknown as Promise<{ id: string }>);
  const interviewId = unwrappedParams.id;

  const router = useRouter();
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    //fetch interview data
    const fetchInterview = async () => {
      // get token from localstorage
      try {
        const token = localStorage.getItem("auth_token");

        if (!token) {
          router.push("/login");
          return;
        }

        // fetch interview
        const response = await fetch(`/api/interview/${interviewId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // add cache: 'no-store' to prevent caching
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch interview data");
        }

        const data = await response.json();

        // allow both completed and in-progress interviews
        if (data.interview.status !== "completed" && data.interview.status !== "in-progress") {
          router.push(`/interview/${interviewId}`);
          return;
        }
        setInterview(data.interview);
        console.log(data.interview);
      } catch (error) {
        console.error('Error fetching interviews: ', error);
        setError('Failed to load interview analysis. Please try again later');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId, router]);

  // logic for marks data
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-900/20';
    if (score >= 60) return 'bg-yellow-900/20';
    return 'bg-red-900/20';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Satisfactory';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorInterview errors={error} bg="red"/>
  }

  if (!interview || !interview.questions || interview.questions.length === 0) {
    return <ErrorInterview bg="yellow" errors={'No questions found for this interview'}/>
  }

  const activeQuestion = interview.questions[activeQuestionIndex];


  return (
    <div className="text-white container mx-auto p-6 max-w-[90%]">

        {/* heading and message */}
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold">Questions Analysis</h1>
                {interview.status === 'in-progress' && (
                    <p className="text-sm text-amber-600 mt-1">
                        This interview is still in progress. Analysis is only available for answered questions.
                    </p>
                )}
            </div>

            {/* buttons */}
            <div className="flex gap-2">
                {interview.status === 'completed' && (
                    <Link href={`/interview/${interviewId}/results`} className="text-gray-800 bg-gray-200 hover:bg-gray-300 py-1 px-3 rounded text-sm">
                        Back to Results
                    </Link>
                )}

                {interview.status === 'in-progress' && (
                  <MainButton text="Continue Interview" color="blue" onClick={() => router.push(`/interview/${interviewId}`)}/>
                )}

                <MainButton text="Dashboard" color="gray" onClick={() => router.push('/dashboard')}/>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        

        {/* question list sidebar */}
        <QuestionList activeQuestionIndex={activeQuestionIndex} interview={interview} onClick={(index) => setActiveQuestionIndex(index)}/>


          {/* question analysis */}
          <div className="md:col-span-3 space-y-6">
            {/* questions and answer */}
            <QuizAndAnswer onClick={() => router.push(`/interview/${interviewId}`)} interview={interview} scoreLabel={getScoreLabel} activeQuestion={activeQuestion} activeQuestionIndex={activeQuestionIndex} />




          </div>


        </div>


    </div>
  )
}
