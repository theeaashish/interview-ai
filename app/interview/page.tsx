"use client";
import { useState } from "react";
import NewInterviewForm from "@/components/interview/NewInterviewForm";
import InterviewSession from "@/components/interviewSession/InterviewSession";
export default function InterviewPage() {
  const [interviewData, setInterviewData] = useState<any>(null);

  const handleStartInterview = (data: any) => {
    setInterviewData(data); // Set the interview data to start the session
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Mock Interview</h1>

      {interviewData ? (
        <InterviewSession interview={interviewData} />
      ) : (
        <NewInterviewForm
          onClose={() => setInterviewData(null)}
          onStartInterview={handleStartInterview}
        />
      )}
    </div>
  );
}
