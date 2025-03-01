import React from 'react'
import Button from './Button'
import Image from 'next/image'

const Hero = () => {
  return (
    <section className='min-h-[70vh] flex flex-col items-center px-8 justify-center relative'>
        <div className='absolute max-sm:hidden w-full -z-10'>
            <Image width={200} height={200} className='relative top-10 right-0' src="/images/ecllipse.png" alt="Circular" />
            <div className='absolute -rotate-6 top-80 left-32 rounded-3xl overflow-hidden w-33 h-44'>
                <Image fill className='object-cover' src="/images/background.jpeg" alt="background image" />
            </div>
        </div>
      <div className='flex flex-col gap-6 items-center'>
        <h1 className='font-semibold max-sm:text-[40px] text-7xl text-center'>Master Interviews with AI</h1>
        <p className='text-center text-xl'>AI-powered feedback to help you ace every interview with confidence.</p>
        <Button name="Practice Now" style={{marginTop: '20px', fontWeight: '600'}} />
      </div>
    </section>
  )
}

export default Hero
