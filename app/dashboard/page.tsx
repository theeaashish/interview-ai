'use client';

import { useEffect, useState} from 'react'
import { useRouter } from 'next/navigation';
import InterviewList from '@/components/interview/InterviewList';
import Loader from '@/components/Loader';
import InterviewBtn from '@/components/interview/InterviewBtn';
// import Button from '@/components/Button';

const dashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      router.push('/login');
    } else {
      try {
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsLoading(false);
      }
    }
  }, [router]);

  // loader
  if (isLoading) {
    return (
      <Loader/>
    )
  }
  
  const handleCreateInterview = (id: string) => {
    router.push(`/interview/new`);
  }

  return (
    <div className='container mx-auto p-10'>
      <div className='flex items-center mb-8 justify-between'>
      <div className='flex items-center justify-between w-full'>
          <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Your Interviews</h1>
          <p className="text-gray-500">
            Practice your interview skills with AI-powered feedback
          </p>
          </div>

          <div>
            <InterviewBtn onClick={handleCreateInterview} text='Create new Interview' />
          </div>
        </div>

      </div>

      <div className='mt-8'>
        <InterviewList/>
      </div>
    </div>
  )
}

export default dashboard
