"use client";
import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
// import Link from "next/link";
import Loader from "@/components/Loader";
import ErrorInterview from "@/components/errors/ErrorInterview";
import ResultsNav from "@/components/ResultsPage/ResultsNav";
import ResultTabBtn from "@/components/ResultsPage/ResultTabBtn";
import InterviewDetails from "@/components/ResultsPage/InterviewDetails";
import OverviewTabData from "@/components/ResultsPage/OverviewTabData";
import FeedbackTabData from "@/components/ResultsPage/FeedbackTabData";
import InterviewNav from "@/components/interview/InterviewNav";

interface ResultsPageProps {
  params: {
    id: string;
  };
}

export default function ResultsPage({ params }: ResultsPageProps) {
  // unwrap params using react.use()
  const unwrappedParams = use(params as unknown as Promise<{ id: string }>);
  const interviewId = unwrappedParams.id;

  const router = useRouter();
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);

        // get token from local storage
        const token = localStorage.getItem("auth_token");

        if (!token) {
          router.push("/login");
          return;
        }

        console.log(`Fetching results for interview: ${interviewId}`);
        const response = await fetch(`/api/interview/${interviewId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // add cache: no-store to prevent chaching issue
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch interview results");
        }

        const data = await response.json();

        // verify that the interview is completed
        if (data.interview.status != "completed") {
          console.log(
            "Interview is not completed, redirecting to interview page"
          );
          router.push(`/interview/${interviewId}`);
          return;
        }

        console.log(
          "Results loaded successfully for interview: ",
          data.interview._id
        );
        console.log(data.interview);
        setInterview(data.interview);
      } catch (error) {
        console.error("Error fetching interview: ", error);
        setError("Failed to load interview results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId, router]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Satisfactory";
    if (score >= 50) return "Needs Improvement";
    return "Poor";
  };

  const handlePrint = () => {
    const printContents = resultsRef.current?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = `
        <html>
          <head>
            <title>Interview Results - ${interview.jobRole}</title>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              h1, h2, h3 { margin-top: 20px; }
              .score { font-size: 24px; font-weight: bold; }
              .section { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
              .question { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
              ul { padding-left: 20px; }
            </style>
          </head>
          <body>
            <h1>Interview Results - ${interview.jobRole}</h1>
            ${printContents}
          </body>
        </html>
        `;

      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  const handleShare = () => {
    // create a sharable link
    const shareUrl = window.location.href;

    // copy to clipboard
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        alert("Link copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorInterview errors={error} bg="red" />;
  }

  if (!interview) {
    return <ErrorInterview errors={"interview not found"} bg="yellow" />;
  }

  return (
    <>
      <InterviewNav interview={interview} />
      <div className="text-white container mx-auto py-6 px-1 max-w-[90%]">
        {/* // results nav */}
        <ResultsNav
          interviewId={interviewId}
          handlePrint={handlePrint}
          handleShare={handleShare}
        />

        {/* tabs */}
        <div className="mb-6 border-b border-zinc-600">
          <nav className="flex mb-4">
            <ResultTabBtn
              tabText="overview"
              onClick={() => setActiveTab("overview")}
              activeTab={activeTab}
              text="Overview"
            />
            <ResultTabBtn
              tabText="feedback"
              onClick={() => setActiveTab("feedback")}
              activeTab={activeTab}
              text="Detailed Feedback"
            />
          </nav>
        </div>

        <div ref={resultsRef}>
          {/* interview details */}
          <InterviewDetails interview={interview} />

          {/* overview tab */}
          {activeTab === "overview" && (
            <OverviewTabData
              interview={interview}
              scoreLabel={getScoreLabel}
              scoreColor={getScoreColor}
            />
          )}

          {/* Feedback tab */}
          {activeTab === "feedback" && (
            <FeedbackTabData interview={interview} />
          )}
        </div>
      </div>
    </>
  );
}
