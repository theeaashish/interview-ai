'use client';

import { useEffect, useState} from 'react'
import { useRouter } from 'next/navigation';
import InterviewList from '@/components/interview/InterviewList';
import Image from 'next/image';
import Loader from '@/components/Loader';
// import Button from '@/components/Button';

const dashboard = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (!token) {
      router.push('/login');
    } else {
      try {
        if (userData) {
          setUserData(JSON.parse(userData));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsLoading(false);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    router.push('/login');
  }

  // loader
  if (isLoading) {
    return (
      <Loader/>
    )
  }
  

  return (
    <div className='container mx-auto p-10'>
      <div className='flex items-center mb-8 justify-between'>
      <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Interview Dashboard</h1>
          <p className="text-gray-500">
            Practice your interview skills with AI-powered feedback
          </p>
        </div>

        <div className='flex items-center gap-4'>
          {userData && (
            <div className='flex bg-zinc-800 rounded-md px-2 py-2 gap-5'>
              <div className='flex items-center gap-4 '>
                <div className='w-10 h-10 flex items-center justify-center rounded-full bg-zinc-700'>
                <Image width={15} height={15} src="/images/Vector.svg" alt="user-img" />
                </div>

                <div className='text-white flex flex-col'>
                  <span>{userData.name}</span>
                  <span className='text-xs text-gray-400'>{userData.email}</span>
                </div>
              </div>
              <button className='text-white cursor-pointer bg-red-500 hover:bg-red-700 transition-all duration-400 px-4 py-2.5 rounded-md' onClick={handleLogout}>Logout</button>
            </div>
          )} 
        </div>

      </div>

      <div className='mt-8'>
        <InterviewList/>
      </div>
    </div>
  )
}

export default dashboard
