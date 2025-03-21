import React from "react";

interface OverviewTabDataProps {
  interview: any;
  scoreLabel: any;
  scoreColor: any;
}

const OverviewTabData = ({
  interview,
  scoreColor,
  scoreLabel,
}: OverviewTabDataProps) => {
  return (
    <div className="bg-gradient-to-r from-[#b87a9c]/20 to-[#d8a1bc]/10 rounded-xl backdrop-blur-sm border border-[#b87a9c]/30 shadow-lg overflow-hidden p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Overall Performance</h2>

      <div className="flex flex-col items-center justify-center mb-6">
        <div>image here</div>

        <div
          className={`text-2xl mt-4 font-bold ${scoreColor(
            interview.overallScore
          )}`}
        >
          {scoreLabel(interview.overallScore)}
        </div>
      </div>

      {interview.feedback && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Overall Feedback</h3>
            <p className="text-gray-300 mt-2">
              {interview.feedback.overallFeedback}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* strengths */}
            <div className="bg-green-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-green-400 mb-2">
                Strengths
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {interview.feedback.strengths.map(
                  (strength: string, index: number) => (
                    <li className="text-gray-300" key={index}>
                      {strength}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* areas of improvemnt */}
            <div className="bg-red-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-red-400 mb-2">
                Areas for Improvement
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {interview.feedback.areasForImprovement.map(
                  (strength: string, index: number) => (
                    <li className="text-gray-300" key={index}>
                      {strength}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTabData;
