import React from "react";

interface MainBtnProps {
  onClick: () => void;
  color: string;
  text: string;
}

const colorClasses: Record<string, string> = {
  gray: "bg-gray-500 hover:bg-gray-600",
  blue: "bg-blue-500 hover:bg-blue-600",
};

const MainButton = ({ onClick, color, text }: MainBtnProps) => {
  return (
    <button
      onClick={onClick}
      className={`${colorClasses[color]} cursor-pointer transition-all duration-300 text-white px-3 py-1 rounded text-sm`}
    >
      {text}
    </button>
  );
};

export default MainButton;
