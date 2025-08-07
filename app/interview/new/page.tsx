"use client";
import { useRouter } from "next/navigation";
import NewInterviewForm from "@/components/interview/NewInterviewForm";

export default function NewInterviewPage() {
  const router = useRouter();

  const handleStartInterview = (interviewData: any) => {
    router.push(`/interview/${interviewData._id}`);
  };

  return (
    <div className="text-white">
      <div>
        <NewInterviewForm
          onClose={() => router.push("/dashboard")}
          onStartInterview={handleStartInterview}
        />
      </div>

      <div className="mt-2 text-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-blue-500 cursor-pointer hover:text-blue-600"
        >
          Cancel and return to dashboard
        </button>
      </div>
    </div>
  );
}
