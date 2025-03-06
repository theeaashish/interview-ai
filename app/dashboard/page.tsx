import InterviewForm  from '@/components/InterViewForm'
import InterviewList from '@/components/InterviewList'
import React from 'react'

const Dashboard = () => {
  return (
    <div className='text-white'>
     <h1> This is my dashboard </h1>
     <InterviewForm />
     <InterviewList/>
    </div>
  )
}

export default Dashboard
