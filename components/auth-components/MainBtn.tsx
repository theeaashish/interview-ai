import React from 'react'

interface BtnProps {
    type: any;
    name: string;
    disabled: boolean;
}

const MainBtn = ({type, name, disabled}: BtnProps) => {
  return (
    <button type={type} disabled={disabled} className="w-[50vw] max-sm:w-full h-[64px] rounded-[8px] font-bold btn duration-400 cursor-pointer transition-all">
          {name}
    </button>
  )
}

export default MainBtn