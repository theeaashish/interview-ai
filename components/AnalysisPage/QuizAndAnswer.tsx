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
    <div className="bg-gradient-to-r from-[#b87a9c]/20 to-[#d8a1bc]/10 rounded-xl backdrop-blur-sm border border-[#b87a9c]/30 shadow-lg overflow-hidden p-6">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-bold">
          Question {activeQuestionIndex + 1}
        </h2>

        {activeQuestion.analysis && activeQuestion.answer && (
          <div className="flex flex-col items-end">
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
            <span className="mt-1 text-sm">
              {scoreLabel(activeQuestion.analysis.score)}
            </span>
          </div>
        )}
      </div>

      {/* question and answer */}

      <div className="mb-6">
        <h3 className="mb-2 text-lg font-medium">Question:</h3>
        <p className="p-3 bg-[var(--theme-color)]/10 rounded-md">
          {activeQuestion.text}
        </p>
      </div>

      {/* answer */}
      <div>
        <h3 className="mb-2 text-lg font-medium">Your Answer:</h3>

        <div className="p-3 bg-[var(--theme-color)]/10 rounded-md">
          {activeQuestion.answer ? (
            <p>{activeQuestion.answer}</p>
          ) : (
            <div className="py-4 text-center">
              <p className="mb-2 italic text-zinc-300">
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
