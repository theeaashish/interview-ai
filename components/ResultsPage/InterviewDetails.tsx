import React from "react";

const InterviewDetails = ({ interview }: { interview: any }) => {
  return (
    <div className="bg-[var(--input-bg)] p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Interview Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-zinc-400">Job Role:</p>
          <p className="font-medium uppercase text-sm">{interview.jobRole}</p>
        </div>
        <div>
          <p className="text-zinc-400">Tech Stack:</p>
          <p className="font-medium uppercase text-sm">
            {interview.techStack.join(", ")}
          </p>
        </div>
        <div>
          <p className="text-zinc-400">Experience:</p>
          <p className="font-medium uppercase text-sm">
            {interview.yearsOfExperience}{" "}
            {interview.yearsOfExperience <= 1 ? "Year" : "Years"}
          </p>
        </div>
        <div>
          <p className="text-zinc-400">Date:</p>
          <p className="font-medium uppercase text-sm">
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
