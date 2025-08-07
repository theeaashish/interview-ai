interface ResultTabBtnProps {
  onClick: () => void;
  activeTab: string;
  text: string;
  tabText: string;
}

const ResultTabBtn = ({
  onClick,
  activeTab,
  text,
  tabText,
}: ResultTabBtnProps) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 cursor-pointer px-4 text-sm font-medium ${
        activeTab === tabText
          ? "bg-[var(--theme-color)] transition-all duration-300 rounded-full"
          : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      {text}
    </button>
  );
};

export default ResultTabBtn;
