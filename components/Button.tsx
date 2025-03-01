import React from 'react'

const Button = ({name, style, hidden}: {name: string, style?: React.CSSProperties, hidden?: string}) => {
  return (
    <button style={style} className={`max-sm:px-6 max-sm:${hidden} px-8 cursor-pointer hover:bg-[#111111] hover:text-white transition-all duration-500 py-3 rounded-full bg-[#E5E9EB] sm:text-xl font-medium`}>{name}
        </button>
  )
}

export default Button
