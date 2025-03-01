import React from 'react'
import Image from 'next/image'

const NavBar = () => {
  return (
    <nav className='min-h-[100px] items-center flex px-20 justify-between'>
      <div className='flex items-center gap-3'>
        <Image width={35} height={35} className='invert' src="/images/logo.svg" alt="Logo" />
        <h2 className='text-3xl font-medium'>interwise</h2>
      </div>
      <div className=''>
        <ul className='flex font-[500] text-xl gap-18 items-center'>
            {
                ["Home", "About", "Projects", "Services", "Contacts"].map((item, index) => (
                    <li key={index}>
                        {item}
                    </li>
                ))
            }
        </ul>
      </div>
      <div className='flex items-center gap-6'>
        <Image width={46} height={46} className='cursor-pointer' src="/images/download.svg" alt="" />
        <button className='px-8 cursor-pointer hover:bg-[#111111] hover:text-white transition-all duration-500 py-3 rounded-full bg-[#E5E9EB] text-2xl font-medium'>Let's Talk
        </button>
      </div>
    </nav>
  )
}

export default NavBar
