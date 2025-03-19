import React from "react";

const FeedbackTabData = ({ interview }: { interview: any }) => {
  return (
    <div className="rounded-lg shadow-md p-6 bg-[var(--input-bg)]">
      <h2 className="text-xl font-bold mb-4">Detailed Feedback</h2>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Overall Assasement</h3>
        <p className="text-gray-300">{interview.feedback.overallFeedback}</p>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-blue-400 mb-2">
          Improvement Goals
        </h3>
        <ul className="list-disc pl-5 space-y-2">
          {interview.feedback.nextSteps.map((step: string, index: number) => (
            <li key={index} className="text-gray-300">
              {step}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-pink-900/10 mt-8 rounded-lg p-4">
        <h3 className="text-red-400 font-semibold mb-2">
          Question-by-Question Feedback
        </h3>

        <div className="space-y-4">
          {interview.questions.map((question: any, index: number) => (
            <div
              key={index}
              className="border-b border-pink-800/40 pb-4 last:border-b-0"
            >
              <h4 className="font-medium">
                {" "}
                Question {index + 1}: {question.text.substring(0, 100)}...{" "}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-2">
                <div>
                  <h5 className="text-gray-400">Technical Feedback:</h5>
                  <p className="text-sm">
                    {question.analysis.technicalFeedback}
                  </p>
                </div>
                <div>
                  <h5 className="text-gray-400">Communication Feedback:</h5>
                  <p className="text-sm">
                    {question.analysis.communicationFeedback}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackTabData;
