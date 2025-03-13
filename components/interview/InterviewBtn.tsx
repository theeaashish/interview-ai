import React from 'react'

const InterviewBtn = ({onClick, text} : { onClick: any, text: string }) => {
  return (
    <button onClick={onClick} className='px-4 py-2 cursor-pointer btn text-white font-semibold rounded-md transition-all duration-300'>
        { text }
    </button>
  )
}

export default InterviewBtn
