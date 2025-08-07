"use client";
import { useState } from "react";
import FormFeature from "../small-components/FormFeature";
import InterviwFormInputs from "../small-components/InterviwFormInputs";

interface NewInterviewFormProps {
  onClose: () => void;
  onStartInterview: (interviewData: any) => void;
}

const NewInterviewForm = ({
  onClose,
  onStartInterview,
}: NewInterviewFormProps) => {
  const [jobRole, setJobRole] = useState("");
  const [techStack, setTechStack] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [apiWarning, setApiWarning] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFileError("");
    setApiWarning("");

    // file size and file validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5mb

    if (resumeFile && resumeFile.size > MAX_FILE_SIZE) {
      setFileError("Resume file size must be less than 5Mb");
      return;
    }
    if (resumeFile && resumeFile.type !== "application/pdf") {
      setFileError("Please upload a valid PDF file");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("jobRole", jobRole);
    formData.append(
      "techStack",
      JSON.stringify(techStack.split(",").map((item) => item.trim()))
    );
    formData.append("yearsOfExperience", yearsOfExperience.toString());

    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    try {
      //get token from local storage
      const token = localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Authenticaton token not found");
      }

      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status == 429) {
          throw new Error(
            "AI services is currently busy, Please try again later"
          );
        } else {
          throw new Error(data.message || "Failed to start interview");
        }
      }

      // check if we are using fallback questions
      if (data.message && data.message.includes("default questions")) {
        setApiWarning(data.message);
      }

      onStartInterview(data.interview);
    } catch (error: any) {
      console.error("Error starting interview: ", error);
      setError(error.message || "An error occurred while starting interview");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex w-[100%] h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-[50%] max-sm:w-full flex flex-col items-center justify-center"
      >
        <div className="flex flex-col items-center justify-center mt-10">
          <h1 className="text-4xl font-semibold">Welcome Buddy!</h1>
          <p>Create your interview to start your journey!</p>
        </div>

        <div className="flex items-center rounded-xl flex-col gap-4 w-[55%] max-sm:w-full max-sm:px-8 p-4 min-h-[70%] mt-6">
          {/* job role input */}
          <InterviwFormInputs
            label="Job Role"
            type="text"
            placeholder="e.g Frontend Develeoper"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
          />

          {/* tech stack */}
          <InterviwFormInputs
            label="Tech-Stack (comma-seperated)"
            type="text"
            placeholder="e.g. React, NodeJs, TypeScript"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
          />

          {/* years of experience */}
          <InterviwFormInputs
            label="Years of Experience"
            type="text"
            min={0}
            max={50}
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(Number(e.target.value))}
          />

          {/* resume upload */}
          <div className="flex flex-col w-[100%]">
            <label className="mb-2 text-sm">Upload Resume (Optional) </label>
            <input
              className="border py-2 cursor-pointer rounded-lg px-4 border-zinc-700 w-[100%]"
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            />

            {fileError && (
              <div className="mt-2 text-sm text-red-500">{fileError}</div>
            )}
          </div>

          {apiWarning && (
            <div className="p-4 border-l-4 border-yellow-600 bg-yellow-900/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-200">{apiWarning}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 border-l-4 border-red-600 bg-red-900/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* submit button */}
          <div className="flex w-full gap-2 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 w-full py-2 rounded-md shadow-sm text-sm font-medium cursor-pointer transition-all duration-300 text-white ${
                isSubmitting
                  ? "bg-[#984CFF]"
                  : "bg-[#984CFF] hover:bg-[#974cffba]"
              }`}
            >
              {isSubmitting ? "Creating..." : "Start Interview"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>

      {/* other section */}

      <FormFeature />
    </section>
  );
};

export default NewInterviewForm;
