
const ContinueBtn = ({onClick}: {onClick: any}) => {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 cursor-pointer bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Continue
    </button>
  );
};

export default ContinueBtn;
