import React from "react";
import TechnicalAndCommunication from "./TechnicalAndCommunication";

interface AnswerAnalysisProps {
  activeQuestion: any;
  scoreBackground: any;
  scoreColor: any;
}

const AnswerAnalysis = ({
  activeQuestion,
  scoreBackground,
  scoreColor,
}: AnswerAnalysisProps) => {
  return (
    <div className="bg-gradient-to-r from-[#b87a9c]/20 to-[#d8a1bc]/10 rounded-xl backdrop-blur-sm border border-[#b87a9c]/30 shadow-lg overflow-hidden p-6">
      <h2 className="text-xl font-bold mb-4">Analysis</h2>

      {/* technical and communication assasement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TechnicalAndCommunication
          score={"technicalScore"}
          feedback="technicalFeedback"
          text="Technical Assessment"
          scoreColor={scoreColor}
          activeQuestion={activeQuestion}
          scoreBackground={scoreBackground}
        />
        <TechnicalAndCommunication
          score={"communicationScore"}
          feedback="communicationFeedback"
          text="Communication Assessment"
          scoreColor={scoreColor}
          activeQuestion={activeQuestion}
          scoreBackground={scoreBackground}
        />
      </div>

      {/* key points */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-300 mb-2">Key Points</h3>
        <div className="bg-pink-300/10 p-4 rounded-md">
          <ul className="list-disc pl-5 space-y-1">
            {activeQuestion.analysis.keyPoints ? (
              activeQuestion.analysis.keyPoints.map(
                (point: string, index: number) => <li key={index}>{point}</li>
              )
            ) : (
              <li>No key points provide</li>
            )}
          </ul>
        </div>
      </div>

      {/* improvement suggestion */}
      <div>
        <h3 className="font-medium text-gray-300 mb-2">
          Improvement Suggestions
        </h3>
        <div className="bg-pink-300/10 p-4 rounded-md">
          <ul className="list-disc pl-5 space-y-1">
            {activeQuestion.analysis.improvementSuggestions ? (
              activeQuestion.analysis.improvementSuggestions.map(
                (suggestion: string, index: number) => (
                  <li key={index}>{suggestion}</li>
                )
              )
            ) : (
              <li>No improvement suggestions provided</li>
            )}
          </ul>
        </div>
      </div>

      {/* sample ideal answer */}
      {activeQuestion.analysis.idealAnswer && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-300 mb-2">
            Sample Ideal Answer
          </h3>
          <div className="bg-green-900/20 p-4 rounded-md border border-green-800">
            <p className="italic">{activeQuestion.analysis.idealAnswer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerAnalysis;
