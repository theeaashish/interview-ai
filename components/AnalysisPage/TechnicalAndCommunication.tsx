import React from "react";

interface TechnicalAnalysisProps {
  activeQuestion: any;
  scoreBackground: any;
  scoreColor: any;
  text: string;
  feedback: string;
  score: any;
}

const TechnicalAndCommunication = ({
  activeQuestion,
  scoreBackground,
  scoreColor,
  text,
  feedback,
  score,
}: TechnicalAnalysisProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-gray-300">{text}</h3>
      <div
        className={`p-4 rounded-md ${scoreBackground(
          activeQuestion.analysis[score] || activeQuestion.analysis.score
        )}`}
      >
        <p>{activeQuestion.analysis[feedback]}</p>

        {activeQuestion.analysis[score] && (
          <div className="mt-2 font-medium">
            Score:{" "}
            <span className={scoreColor(activeQuestion.analysis[score])}>
              {activeQuestion.analysis[score]}/100
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicalAndCommunication;
