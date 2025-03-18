import React from "react";

interface PreviousNextBtnProps {
  onClick: () => void;
  disabled: boolean;
  text: string;
  path: string;
  position: string;
}

const PreviousNextBtn = ({
  onClick,
  text,
  disabled,
  path,
  position,
}: PreviousNextBtnProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md flex items-center ${
        disabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
      }`}
    >
      {position === "mr-1" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d={path} clipRule="evenodd" />
        </svg>
      )}
      {text}
      {position === "ml-1" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${position}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d={path} clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
};

export default PreviousNextBtn;
