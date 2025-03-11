'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '../Loader';

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        //get token from local storage
        const token = localStorage.getItem('auth_token');

        if (!token) {
          throw new Error('no auth token found');
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
        setInterviews(data.interviews || [])
        
      } catch (error) {
        console.error('error fetching interviews: ', error);
        setError('Failed to load interviews. Please try again Later');
      } finally {
        setLoading(false);
      }
    }

    fetchInterviews();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className='task-status bg-green-100 text-green-800'>Completed</span>;
      case 'in-progress':
        return <span className='task-status bg-blue-100 text-blue-800'>In progress</span>;
      case 'pending':
        return <span className='task-status bg-gray-100 text-gray-800'>Pending</span>
    }
  };


  const handleContinueInterview = (id: string) => {
    router.push(`/interview/${id}`);
  };

  const handleViewResults = (id: string) => {
    router.push(`/interview/${id}/results`);
  };

  const handleViewAnalysis = (id: string) => {
    router.push(`/interview/${id}/analysis`);
  };

  const handleCreateInterview = () => {
    router.push(`/interview/new`);
  };

  //loader

  if (loading) {
    return (
      <Loader />
    )
  }
  
  return (
    <div className="space-y-10 text-white">
      <div className='flex justify-between'>
      <h2 className="text-xl font-bold">Your Interviews</h2>
        <button className='px-4 py-2 transition-all duration-300 cursor-pointer bg-blue-500 text-white rounded-md hover:bg-blue-600' onClick={handleCreateInterview}>Create New Interview</button>
      </div>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          {error}
        </div>
      )}

      {!error && interviews.length === 0 ? (
        <div className='text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg'>
          <p className='text-gray-500 dark:text-gray-400'>No Interviews found! Start a new interview to practice!</p>
          <button className='mt-4 px-4 py-2 bg-blue-500 transition-all duration-300 text-white rounded-md hover:bg-blue-600 cursor-pointer' onClick={handleCreateInterview}>Create your first interview</button>
        </div>
      ) : (
        <div>
          hey
        </div>
      )}
    </div>
  );
}