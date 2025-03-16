interface ContinueBtn {
  onClick: () => void;
  text: string;
  path_1: string;
  path_2: string;
  color: string;
}

const colorClasses: Record<string, string> = {
  indigo: "bg-indigo-500 hover:bg-indigo-600",
  blue: "bg-blue-500 hover:bg-blue-600",
  green: "bg-green-500 hover:bg-green-600",
};

const ContinueBtn = ({onClick, text, path_1, path_2, color}: ContinueBtn) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 transition-all cursor-pointer text-white text-sm rounded ${colorClasses[color]} flex items-center`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path_1} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path_2} />
      </svg>
      {text}
    </button>
  );
};

export default ContinueBtn;
