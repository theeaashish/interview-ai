'use client';
import { useState } from "react";
import FormFeature from "../small-components/FormFeature";
import InterviwFormInputs from "../small-components/InterviwFormInputs";

interface NewInterviewFormProps {
  onClose: () => void;
  onStartInterview: (interviewData: any) => void;

}

const NewInterviewForm = ({ onClose, onStartInterview }: NewInterviewFormProps) => {

  const [jobRole, setJobRole] = useState('');
  const [techStack, setTechStack] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFileError('');

    // file size and file validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5mb

    if (resumeFile && resumeFile.size > MAX_FILE_SIZE) {
      setFileError('Resume file size must be less than 5Mb');
      return;
    }
    if (resumeFile && resumeFile.type !== 'application/pdf') {
      setFileError('Please upload a valid PDF file');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('jobRole', jobRole);
    formData.append('techStack', JSON.stringify(techStack.split(',').map(item => item.trim())));
    formData.append('yearsOfExperience', yearsOfExperience.toString());

    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    try {

      //get token from local storage
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Authenticaton token not found');
      }

      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start interview');
      }

      const data = await response.json();
      onStartInterview(data.interview);
      
    } catch (error: any) {
      console.error('Error starting interview: ', error);
      setError(error.message || 'An error occurred while starting interview');
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <section className="flex w-[100%] h-screen">
      <form onSubmit={handleSubmit} className="w-[50%] flex flex-col items-center justify-center">

        <div className="flex flex-col items-center justify-center mt-10">
          <h1 className="text-4xl font-semibold">Welcome Buddy!</h1>
          <p>Create your interview to start your journey!</p>
        </div>

        <div className="flex items-center rounded-xl flex-col gap-4 w-[55%] p-4 min-h-[70%] mt-6">

          {/* job role input */}
          <InterviwFormInputs label="Job Role" type="text" placeholder="e.g Frontend Develeoper" value={jobRole} onChange={(e) => setJobRole(e.target.value)}/>

          {/* tech stack */}
          <InterviwFormInputs label="Tech-Stack (comma-seperated)" type="text" placeholder="e.g. React, NodeJs, TypeScript" value={techStack} onChange={(e) => setTechStack(e.target.value)} />

          {/* years of experience */}
          <InterviwFormInputs label="Years of Experience" type="number" min={0} max={50} value={yearsOfExperience} onChange={(e) => setYearsOfExperience(Number(e.target.value))} />

          {/* resume upload */}
          <div className="flex flex-col w-[100%]">
            <label className="text-sm mb-2">Upload Resume (Optional) </label>
            <input className="border py-2 cursor-pointer rounded-lg px-4 border-zinc-700 w-[100%]" type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files?.[0] || null)}/>
          
          {fileError && (
            <div className="text-red-500 text-sm mt-2">{fileError}</div>
          )}
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {/* submit button */}
          <div className="w-full flex gap-2 mt-4">
            <button type="submit" disabled={isSubmitting} className={`px-4 w-full py-2 rounded-md shadow-sm text-sm font-medium cursor-pointer transition-all duration-300 text-white ${
             isSubmitting ? 'bg-[#984CFF]' : 'bg-[#984CFF] hover:bg-[#974cffba]'}`}>
              {isSubmitting ? 'Creating...' : 'Start Interview'}
           </button>

            <button type="button" onClick={onClose} className="px-4 w-full py-2 border border-gray-300 rounded-md shadow-sm transition-all duration-300 text-sm font-medium cursor-pointer text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600">Cancel</button>

          </div>

        </div>

      </form>


      {/* other section */}

      <FormFeature/>
    </section>
  )
}

export default NewInterviewForm
