import React from "react";
import Button from "./Button";
import Image from "next/image";
import Link from "next/link";


const Hero = () => {
  return (
    <section className="min-h-[90vh] flex  flex-col items-center px-8 justify-center relative">
      <div className="absolute -top-30 left-0 -z-10">
        <Image width={700} height={700} src="/images/bg-shade.png" alt="" />
      </div>

      <div className="absolute right-0 -z-10">
      <Image className="bottom-0 right-0 -z-10" width={700} height={700} src="/images/bg-shade2.png" alt="" />
      </div>
      <div className="absolute max-sm:hidden w-full -z-10 -top-30">
        {/* <Image
          width={200}
          height={200}
          className="relative top-10 right-0"
          src="/images/ecllipse.png"
          alt="Circular"
        /> */}
        <div className="absolute -rotate-6 top-80 left-32 rounded-3xl overflow-hidden w-33 h-44">
          {/* <Image
            fill
            className="object-cover"
            src="/images/background.jpeg"
            alt="background image"
          /> */}
        </div>
      </div>
      <div className="flex flex-col gap-6 items-center -mt-16 text-[var(--nav-text)]">
        <div className="w-56 relative -top-6 rounded-full border-2 border-[#413239] bg-[#1f1f1f] py-2 text-white -mt-15">
          <h3 className="text-center">AI-Driven SaaS Website</h3>
        </div>
        <h1 className="font-semibold max-sm:text-[40px] text-7xl text-center">
          Master Interviews with AI
        </h1>
        <p className="text-center text-xl">
          AI-powered feedback to help you ace every interview with confidence.
        </p>

        <Link href={'/dashboard'}>
        <Button
          name="Practice Now"
          style={{ marginTop: "20px", fontWeight: "600" }}
        />
       </Link>

       
      </div>

      <div className="arrow-div mt-22 bg-[var(--theme-color)] rounded-full absolute cursor-pointer transition-all duration-300 hover:bg-[var(--theme-hover)] group">
        <Image
          width={45}
          height={45}
          className="invert transition-all duration-300 group-hover:invert-0"
          src="/images/arrow.svg"
          alt="arrow"
        />
      </div>

      <div className="absolute bottom-0 w-full flex justify-center -z-10 overflow-hidden">
         <Image width={1000} height={1000} src="/images/circles.png" alt="circle-bg" />
         <div className="card w-50 max-sm:w-30 h-15 max-sm:h-8 m-auto bg-amber-50 bottom-0 absolute">
         </div>
      </div>
    </section>
  );
};

export default Hero;
