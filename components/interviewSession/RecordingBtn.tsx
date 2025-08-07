// button for record answer and submit button
import { Mic } from "lucide-react";

interface RecordingBtn {
  onClick: () => void;
  disabled: boolean;
  isRecording: boolean;
  color: string;
  trueText: string;
  falseText: string;
  style: string;
  Icon: React.ElementType;
}

const RecordingBtn = ({
  onClick,
  disabled,
  isRecording,
  color,
  trueText,
  falseText,
  style,
  Icon,
}: RecordingBtn) => {
  return (
    <button
      onClick={onClick}
      className={`mt-4 w-full px-4 flex items-center justify-center gap-3 py-3 text-xl font-bold rounded-md transition-all cursor-pointer duration-300 ${
        isRecording ? `${color} text-white` : `${style}`
      }`}
      disabled={disabled}
    >
      <Icon className="w-6 h-6" />
      {isRecording ? trueText : falseText}
    </button>
  );
};

export default RecordingBtn;

// bg-blue-500 hover:bg-blue-600 text-white
// bg-green-500 hover:bg-green-600
