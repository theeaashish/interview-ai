"use client";

import { ArrowLeft, Clock, Lock, Timer } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const InterviewNav = ({ interview }: { interview: any }) => {
  return (
    <>
      <div className="p-4 text-white md:py-6 md:px-10 flex justify-between items-center border-b border-slate-800/80 bg-black/30 backdrop-blur-md sticky top-0 z-10 shadow-lg">
        <div className="flex gap-4">
          <Image width={40} height={40} className="max-sm:hidden" src="/images/logo.svg" alt="Logo Image" />
          <div className="leading-2 text-sm max-sm:text-xs">
            <h1 className="text-3xl max-sm:text-base font-bold tracking-tighter">
              {interview.jobRole} interview
            </h1>
            <p className="font-light tracking-tight text-slate-400">
              Secure your future with the right answers
            </p>
          </div>
        </div>
        <div className="text-white flex items-center gap-6">
          <button className="p-3 max-sm:hidden rounded-full border border-slate-700 bg-slate-800/50 hover:bg-[#b87a9c]/20 hover:border-[#b87a9c]/50 cursor-pointer transition-all duration-300">
            <Timer className="h-4 w-4 text-[#d8a1bc]" />
          </button>
          <Link
            href={"/dashboard"}
            className="flex hover:bg-slate-800/50 px-4 py-2 rounded-lg items-center -space-x-1.5 hover:text-white transition-colors duration-400 group"
          >
            <ArrowLeft className="w-4 text-slate-400 group-hover:text-white transition-all duration-300" />
            <span className="ml-4 max-sm:text-xs text-sm font-medium text-slate-400 group-hover:text-white transition-all duration-300">
              Back to Dashboard
            </span>
          </Link>
        </div>
      </div>
      <div className="bg-slate-900/30 py-3 px-10 max-sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800/50">
        <div className="flex items-center gap-2 max-sm:text-[10px] text-sm text-slate-300">
          <span className="font-medium text-[rgb(184,122,156)] bg-[#b87a9c]/10 px-2 py-1 rounded-md flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Tech Stack:
          </span>
          <div className="flex gap-2">
            {interview.techStack.map((tech: string, index: number) => (
              <span
                key={index}
                className="bg-slate-800/70 px-2 py-1 max-sm:text-[8px] rounded-md text-xs border border-slate-700/50 hover:border-[#b87a9c]/30 transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 max-sm:text-xs text-sm bg-slate-800/70 px-3 py-1 rounded-md border border-slate-700/50">
          <Clock className="h-4 w-4 text-[#b87a9c]" />

          <p className="text-slate-300">
            Experience:{" "}
            <span className="text-white font-medium">
              {interview.yearsOfExperience}{" "}
              {interview.yearsOfExperience <= 1 ? "Year" : "Years"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default InterviewNav;
