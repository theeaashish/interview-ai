import React from "react";
import MainButton from "./MainButton";

interface QuizAndAnswerProps {
  activeQuestionIndex: number;
  activeQuestion: any;
  scoreLabel: any;
  interview: any;
  onClick: () => void;
}

const QuizAndAnswer = ({
  activeQuestionIndex,
  activeQuestion,
  scoreLabel,
  interview,
  onClick,
}: QuizAndAnswerProps) => {
  return (
    <div className="bg-[var(--input-bg)] rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">
          Question {activeQuestionIndex + 1}
        </h2>

        {activeQuestion.analysis && activeQuestion.answer && (
          <div className="flex items-end flex-col">
            <div
              className={`px-3 py-1 text-sm rounded-full font-medium ${
                activeQuestion.analysis.score >= 80
                  ? "bg-green-900/30 text-green-300"
                  : activeQuestion.analysis.score >= 60
                  ? "bg-yellow-900/30 text-yellow-300"
                  : "bg-red-900/30 text-red-300"
              }`}
            >
              Score: {activeQuestion.analysis.score}/100
            </div>
            <span className="text-sm mt-1">
              {scoreLabel(activeQuestion.analysis.score)}
            </span>
          </div>
        )}
      </div>

      {/* question and answer */}

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Question:</h3>
        <p className="p-3 bg-[var(--theme-color)] rounded-md">
          {activeQuestion.text}
        </p>
      </div>

      {/* answer */}
      <div>
        <h3 className="text-lg font-medium mb-2">Your Answer:</h3>

        <div className="p-3 bg-[var(--theme-color)] rounded-md">
          {activeQuestion.answer ? (
            <p>{activeQuestion.answer}</p>
          ) : (
            <div className="text-center py-4">
              <p className="text-zinc-300 italic mb-2">
                No answer provided yet
              </p>
              {interview.status === "in-progress" && (
                <MainButton
                  onClick={onClick}
                  color="blue"
                  text="Continue Interview to Answer"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizAndAnswer;