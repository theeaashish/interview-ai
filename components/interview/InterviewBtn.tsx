import React from 'react'

const InterviewBtn = ({onClick, text} : { onClick: any, text: string }) => {
  return (
    <button onClick={onClick} className='px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-md hover:bg-blue-600'>
        { text }
    </button>
  )
}

export default InterviewBtn
