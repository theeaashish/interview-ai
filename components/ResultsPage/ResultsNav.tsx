import React from "react";
import ContinueBtn from "../interview/ContinueBtn";
import { useRouter } from "next/navigation";
import MainButton from "../AnalysisPage/MainButton";

interface ResultsNavProps {
  handlePrint: () => void;
  handleShare: () => void;
  interviewId: string;
}

const ResultsNav = ({
  handlePrint,
  handleShare,
  interviewId,
}: ResultsNavProps) => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-6 max-sm:flex-col max-sm:gap-4">
      <h1 className="text-3xl font-bold">Interview Results</h1>

      <div className="flex gap-2">
        {/* print btn */}
        <ContinueBtn
          onClick={handlePrint}
          color="zinc"
          text="Print"
          path_1="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
          path_2=""
        />
        {/* share btn */}
        <ContinueBtn
          onClick={handleShare}
          color="zinc"
          text="Share"
          path_1="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          path_2=""
        />
        {/* detailed analysis btn */}
        <ContinueBtn
          onClick={() => router.push(`/interview/${interviewId}/analysis`)}
          color="indigo"
          text="Detailed Analysis"
          path_1="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          path_2=""
        />
        {/* back to dashboard */}
        <MainButton
          color="blue"
          text="Back to Dashbaord"
          onClick={() => router.push(`/dashboard`)}
        />
      </div>
    </div>
  );
};

export default ResultsNav;
