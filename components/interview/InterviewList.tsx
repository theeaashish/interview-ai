'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../Loader";
import InterviewBtn from "./InterviewBtn";
import ContinueBtn from "./ContinueBtn";
import AnalysisBtn from "./AnalysisBtn";
import ResultBtn from "./ResultBtn";

interface Interview {
  _id: string;
  jobRole: string;
  techStack: string[];
  yearsOfExperience: number;
  status: string;
  overallScore: number;
  createdAt: string;
}

export default function InterviewList() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {

        // get token from local storage
        const token = localStorage.getItem('auth_token');

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch('/api/interview/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch interviews');
        }

        const data = await response.json();
        console.log(data);
        setInterviews(data.interviews || []);
        
      } catch (error) {
        console.error('error fetching interviews: ', error);
        setError('Failed to load interviews, Please try again later!');
      } finally {
        setLoading(false);
      };
    }

    fetchInterviews();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>;
      case 'in-progress':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">In Progress</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Pending</span>;
    }
  }

  const handleContinueInterview = (id: string) => {
    router.push(`/interview/${id}`);
  };

  const handleViewResults = (id: string) => {
    router.push(`/interview/${id}/results`);
  }

  const handleViewAnalysis = (id: string) => {
    router.push(`/interview/${id}/analysis`);
  }
  
  const handleCreateInterview = (id: string) => {
    router.push(`/interview/new`);
  }

  if (loading) {
    return <Loader/>
  }

  return (
    <div className="text-white space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Interviews</h2>
        <InterviewBtn text="Create New Interview" onClick={handleCreateInterview} />
      </div>

      { error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) }

      { !error && interviews.length === 0 ? (
        <div className="w-full h-[40vh] flex items-center justify-center">
          <div className="text-center py-8 w-[40vw]  bg-[var(--input-bg)] rounded-lg">
            <p className="text-gray-400 mb-4">No interviews found. Start a new interview to practice!</p>
            <InterviewBtn onClick={handleCreateInterview} text="Create Your First Interview" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          { interviews.map((interview) => (
            <div key={interview._id} className="bg-[var(--input-bg)] max-w-[600px] max-sm:w-full rounded-xl shadow-md px-6 py-8">
           
             {/* // job role, status */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-bold uppercase">{interview.jobRole}</h3>
                {getStatusBadge(interview.status)}
            </div>

            {/* // experience, techStack, progress and score */}
              <div className="text-[var(--nav-text)] text-sm mb-4 flex flex-col gap-2 font-semibold">
                <p>Tech Stack: {interview.techStack.join(', ')}</p>
                <p>Experience: {interview.yearsOfExperience} { interview.yearsOfExperience <= 1 ? "Year" : "Years" }</p>
                <p>Date: {new Date(interview.createdAt).toLocaleDateString()}</p>
                {interview.status === 'in-progress' && ( <p>Score: <span>{interview.overallScore}</span></p> )}
                {interview.status === 'completed' && (
                  <p>Score: <span className={interview.overallScore >= 70 ? 'text-green-500' : interview.overallScore >= 50 ? 'text-yellow-500' : 'text-red-500'}>{interview.overallScore}</span></p>
                )}
              </div>

              {/* // buttons for continue, view results, view analysis, and start new interview */}

              <div className="flex gap-4 flex-wrap relative">
                {interview.status === 'in-progress' && (
                  <>
                  <ContinueBtn onClick={() => handleContinueInterview(interview._id)} />
                  <AnalysisBtn onClick={() => handleViewAnalysis(interview._id)} />
                  </>
                )}

                 {interview.status === 'completed' && (
                  <>
                  <ResultBtn onClick={() => handleViewResults(interview._id)} />
                  <AnalysisBtn onClick={() => handleViewAnalysis(interview._id)} />
                  </>
                 )}
              </div>

            </div>
          )) }
        </div>
      ) }
    </div>
  )
}