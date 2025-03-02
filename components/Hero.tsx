import React from "react";
import Button from "./Button";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="min-h-[80vh] flex overflow-hidden flex-col items-center px-8 justify-center relative">
      <div className="absolute max-sm:hidden w-full -z-10 -top-30">
        <Image
          width={200}
          height={200}
          className="relative top-10 right-0"
          src="/images/ecllipse.png"
          alt="Circular"
        />
        <div className="absolute -rotate-6 top-80 left-32 rounded-3xl overflow-hidden w-33 h-44">
          <Image
            fill
            className="object-cover"
            src="/images/background.jpeg"
            alt="background image"
          />
        </div>
      </div>
      <div className="flex flex-col gap-6 items-center -mt-14 max-sm:-mt-80">
        <h1 className="font-semibold max-sm:text-[40px] text-7xl text-center">
          Master Interviews with AI
        </h1>
        <p className="text-center text-xl">
          AI-powered feedback to help you ace every interview with confidence.
        </p>
        <Button
          name="Practice Now"
          style={{ marginTop: "20px", fontWeight: "600" }}
        />
      </div>

      <div className="arrow-div mt-22 bg-black rounded-full absolute top-[360px] cursor-pointer transition-all duration-300 hover:bg-[var(--main-bg)] group">
        <Image
          width={45}
          height={45}
          className="invert transition-all duration-300 group-hover:invert-0"
          src="/images/arrow.svg"
          alt="arrow"
        />
      </div>
    </section>
  );
};

export default Hero;
