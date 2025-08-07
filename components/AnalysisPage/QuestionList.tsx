import React from "react";

interface QuestionListProps {
  interview: any;
  onClick: (index: number) => void;
  activeQuestionIndex: number;
}

const QuestionList = ({
  interview,
  onClick,
  activeQuestionIndex,
}: QuestionListProps) => {
  return (
    <div className="md:col-span-1 bg-gradient-to-r from-[#b87a9c]/20 to-[#d8a1bc]/10 rounded-xl backdrop-blur-sm border border-[#b87a9c]/30 shadow-lg overflow-hidden p-4 h-fit">
      <h2 className="mb-3 text-lg font-semibold">Questions</h2>
      <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
        {interview.questions.map((question: any, index: number) => (
          <button
            key={index}
            onClick={() => onClick(index)}
            className={`w-full text-left p-3 rounded-md transition-colors ${
              !question.answer
                ? "opacity-50 cursor-not-allowed bg-pink-300/10"
                : activeQuestionIndex === index
                ? "bg-[var(--theme-color)]/30 text-zinc-300"
                : "hover:bg-pink-300/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">Q{index + 1}</span>

              {question.analysis && question.answer && (
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    question.analysis.score >= 80
                      ? "bg-green-900/30 text-green-300"
                      : question.analysis.score >= 60
                      ? "bg-yellow-900/30 text-yellow-300"
                      : "bg-red-900/30 text-red-300"
                  }`}
                >
                  {question.analysis.score}
                </span>
              )}

              {!question.answer && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-pink-300/10 text-gray-400">
                  Not Answered
                </span>
              )}
            </div>

            <p className="mt-1 text-sm truncate text-zinc-300">
              {question.text.length > 50
                ? `${question.text.substring(0, 50)}...`
                : question.text}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;
