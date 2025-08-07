import React from "react";
import FeatureBox from "./FeatureBox";

const FormFeature = () => {
  return (
    <div className="w-[50%] max-sm:hidden h-screen flex flex-col items-center justify-center gap-10">
      <div className="flex items-center justify-center">
        <h1 className="text-4xl font-bold ">Featured Features</h1>
      </div>

      {/* features boxes */}

      <div className="flex flex-col gap-6">
        <div className="relative flex gap-6">
          <FeatureBox
            text="AI-Powered Interviews"
            para="Get real-time AI-driven interview questions tailored to your skills and experience. Prepare like never before!"
            src="/images/image-box.svg"
          />
          <FeatureBox
            text="Instant Feedback & Scoring"
            para="Receive AI-generated feedback on your answers along with a performance score to track your progress"
            src="/images/chat-box.svg"
          />
        </div>

        <div className="flex gap-6">
          <FeatureBox
            text="Speech-to-Text Analysis"
            para="Use voice recognition to answer questions and get AI-powered transcriptions with editing options"
            src="/images/mic.svg"
          />
          <FeatureBox
            text="Personalized Mock Tests"
            para="Customize your interview by selecting a job role, tech stack, or uploading your resume for a fully tailored experience."
            src="/images/psychology.svg"
          />
        </div>
      </div>
    </div>
  );
};

export default FormFeature;
