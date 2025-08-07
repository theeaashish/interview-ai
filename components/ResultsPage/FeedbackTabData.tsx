import React from "react";

const FeedbackTabData = ({ interview }: { interview: any }) => {
  return (
    <div className="p-6 bg-gradient-to-r from-[#b87a9c]/20 to-[#d8a1bc]/10 rounded-xl backdrop-blur-sm border border-[#b87a9c]/30 shadow-lg overflow-hidden">
      <h2 className="mb-4 text-xl font-bold">Detailed Feedback</h2>

      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">Overall Assasement</h3>
        <p className="text-gray-300">{interview.feedback.overallFeedback}</p>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold text-blue-400">
          Improvement Goals
        </h3>
        <ul className="pl-5 space-y-2 list-disc">
          {interview.feedback.nextSteps.map((step: string, index: number) => (
            <li key={index} className="text-gray-300">
              {step}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 mt-8 rounded-lg bg-pink-900/10">
        <h3 className="mb-2 font-semibold text-red-400">
          Question-by-Question Feedback
        </h3>

        <div className="space-y-4">
          {interview.questions.map((question: any, index: number) => (
            <div
              key={index}
              className="pb-4 border-b border-pink-800/40 last:border-b-0"
            >
              <h4 className="font-medium">
                {" "}
                Question {index + 1}: {question.text.substring(0, 100)}...{" "}
              </h4>
              <div className="grid grid-cols-1 gap-10 mt-2 md:grid-cols-2">
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
