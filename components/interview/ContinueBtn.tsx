interface ContinueBtn {
  onClick: () => void;
  text: string;
  path_1: string;
  path_2: string;
  color: string;
}

const ContinueBtn = ({onClick, text, path_1, path_2, color}: ContinueBtn) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 cursor-pointer bg-${color}-500 text-white text-sm rounded hover:bg-${color}-600 flex items-center`}
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
