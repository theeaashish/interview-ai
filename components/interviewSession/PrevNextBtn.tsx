import React from "react";

interface NextPrevBtn {
  onClick: any;
  disabled: any;
  classes: any;
  label: string;
}

const PrevNextBtn = ({ onClick, disabled, classes, label }: NextPrevBtn) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 cursor-pointer transition-all rounded text-sm ${
        classes
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
      }`}
    >
      {label}
    </button>
  );
};

export default PrevNextBtn;
