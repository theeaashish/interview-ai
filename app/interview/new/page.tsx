'use client';
import { useState } from 'react';
import NewInterviewForm from '@/components/interview/NewInterviewForm';
import InterviewSession from '@/components/interview/InterviewSession';

export default function InterviewPage() {
  const [interviewData, setInterviewData] = useState<any>(null);

  const handleStartInterview = (data: any) => {
    setInterviewData(data); // Set the interview data to start the session
  };

  return (
    <div className="text-white max-h-screen">
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