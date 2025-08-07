import React from "react";

const InterviewDetails = ({ interview }: { interview: any }) => {
  return (
    <div className="bg-gradient-to-r from-[#b87a9c]/20 to-[#d8a1bc]/10 rounded-xl backdrop-blur-sm border border-[#b87a9c]/30 shadow-lg overflow-hidden p-6 mb-6">
      <h2 className="mb-4 text-xl font-bold">Interview Details</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="text-zinc-400">Job Role:</p>
          <p className="text-sm font-medium uppercase">{interview.jobRole}</p>
        </div>
        <div>
          <p className="text-zinc-400">Tech Stack:</p>
          <p className="text-sm font-medium uppercase">
            {interview.techStack.join(", ")}
          </p>
        </div>
        <div>
          <p className="text-zinc-400">Experience:</p>
          <p className="text-sm font-medium uppercase">
            {interview.yearsOfExperience}{" "}
            {interview.yearsOfExperience <= 1 ? "Year" : "Years"}
          </p>
        </div>
        <div>
          <p className="text-zinc-400">Date:</p>
          <p className="text-sm font-medium uppercase">
            {new Date(
              interview.completedAt || interview.createdAt
            ).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;
