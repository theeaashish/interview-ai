import React from "react";

const InterviewBtn = ({ onClick, text }: { onClick: any; text: string }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 font-semibold text-white transition-all duration-300 rounded-md cursor-pointer btn"
    >
      {text}
    </button>
  );
};

export default InterviewBtn;
