// button for record answer and submit button

interface RecordingBtn {
    onClick: () => void;
    disabled: boolean;
    isRecording: boolean;
    color: string;
    trueText: string;
    falseText: string;
    style: string;
}

const RecordingBtn = ({onClick, disabled, isRecording, color, trueText, falseText, style}: RecordingBtn ) => {
  return (
    <button
            onClick={onClick}
            className={`mt-4 w-full px-4 py-3 rounded-md transition-all cursor-pointer font-medium duration-300 ${
              isRecording 
                ? `${color} text-white`
                : `${style}`
            }`}
            disabled={disabled}
          >
            {isRecording ? trueText : falseText}
          </button>
  )
}

export default RecordingBtn


// bg-blue-500 hover:bg-blue-600 text-white
// bg-green-500 hover:bg-green-600