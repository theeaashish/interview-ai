'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../Loader";
import ContinueBtn from "./ContinueBtn";

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
        // console.log(data);
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
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-900/30 text-green-500">Completed</span>;
      case 'in-progress':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-900/30 text-blue-500">In Progress</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-gray-900/30 text-gray-500">Pending</span>;
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
  


  if (loading) {
    return <Loader/>
  }

  return (
    <div className="text-white space-y-6">


      { error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) }

      { !error && interviews.length === 0 ? (
        <div className="w-full h-[40vh] flex items-center justify-center">
          <div className="text-center py-8 w-[40vw]  bg-[var(--input-bg)] rounded-lg">
            <p className="text-gray-400 mb-4">No interviews found. Start a new interview to practice!</p>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
          { interviews.map((interview) => (
            <div key={interview._id} className="bg-[var(--input-bg)] border border-[#352a31] max-w-[600px] max-sm:w-full rounded-xl shadow-md px-6 py-8">
           
             {/* // job role, status */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold uppercase">{interview.jobRole}</h3>
                {getStatusBadge(interview.status)}
            </div>

            {/* // experience, techStack, progress and score */}
              <div className="text-gray-400 text-md mb-4 flex flex-col gap-0 font-medium">
                <p>Tech Stack</p>
                <p className="text-gray-200">{interview.techStack.join(', ')}</p>
               <div className="flex gap-20 mt-5">
               <div className="">
               <p>Experience</p>
               <p className="text-gray-200">{interview.yearsOfExperience} { interview.yearsOfExperience <= 1 ? "Year" : "Years" }</p>
               </div>
               <div>
               <p>Date</p>
               <p className="text-gray-200">{new Date(interview.createdAt).toLocaleDateString()}</p>
               </div>
               <div>

               {interview.status === 'in-progress' && (
                  <div>

                      <p>Score</p>
                     <p className="text-2xl font-bold"> <span className={interview.overallScore >= 70 ? 'text-green-500' : interview.overallScore >= 50 ? 'text-yellow-500' : 'text-red-500'}>{interview.overallScore}</span> </p>

                  </div> )}

                {interview.status === 'completed' && (
                  <div>
                    
                      <p>Score</p>
                      <p className="text-2xl font-bold"> <span className={interview.overallScore >= 70 ? 'text-green-500' : interview.overallScore >= 50 ? 'text-yellow-500' : 'text-red-500'}>{interview.overallScore}</span> </p>

                  </div> )}
               </div>
                
               </div>
              </div>

              {/* // buttons for continue, view results, view analysis, and start new interview */}

              <div className="flex mt-4 gap-4 flex-wrap relative">
                {interview.status === 'in-progress' && (
                  <>
                  {/* continue btn */}
                  <ContinueBtn color="blue" text="Continue" path_1="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                  path_2="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" onClick={() => handleContinueInterview(interview._id)} />
                  {/* analysis btn */}
                  <ContinueBtn color="indigo" path_2="" text="Analysis" path_1="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" onClick={() => handleViewAnalysis(interview._id)} />
                  </>
                )}

                 {interview.status === 'completed' && (
                  <>
                  {/* result btn */}
                  <ContinueBtn color="green" text="Results" path_1="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" path_2="" onClick={() => handleViewResults(interview._id)} />
                  {/* analysis btn */}
                  <ContinueBtn color="indigo" path_2="" text="Analysis" path_1="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" onClick={() => handleViewAnalysis(interview._id)} />
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