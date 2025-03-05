import { UserButton } from '@clerk/nextjs'
import React from 'react'

const Dashboard = () => {
  return (
    <div className='text-white'>
     <h1> This is my dashboard </h1>

      <UserButton/>
    </div>
  )
}

export default Dashboard
