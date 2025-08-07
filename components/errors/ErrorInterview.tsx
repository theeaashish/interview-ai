import InterviewBtn from "../interview/InterviewBtn";
import { useRouter } from "next/navigation";

const ErrorInterview = ({ errors, bg }: { errors: any; bg: string }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center h-[80vh] justify-center">
      <div className="p-6 text-center">
        <div
          className={`bg-${bg}-100 text-${bg}-500 px-6 border-2 font-medium border-${bg}-700 py-3 rounded-md mb-4`}
        >
          {errors}
        </div>
        <InterviewBtn
          text="Return to Dashboard"
          onClick={() => router.push("/dashboard")}
        />
      </div>
    </div>
  );
};

export default ErrorInterview;
