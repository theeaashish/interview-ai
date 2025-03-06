'use client';
import { useState } from 'react';

interface NewInterviewFormProps {
  onClose: () => void;
}

export default function NewInterviewForm({ onClose }: NewInterviewFormProps) {
  const [jobRole, setJobRole] = useState('');
  const [techStack, setTechStack] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('jobRole', jobRole);
    formData.append('techStack', JSON.stringify(techStack.split(',')));
    formData.append('yearsOfExperience', yearsOfExperience.toString());

    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onClose(); // Close the modal after submission
        window.location.href = `/interview/${data.interview._id}`; // Redirect to interview session
      } else {
        alert('Failed to start interview');
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('An error occurred while starting the interview');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Job Role Input */}
      <div>
        <label className="block mb-2">Job Role</label>
        <input
          type="text"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Tech Stack Input */}
      <div>
        <label className="block mb-2">Tech Stack (comma-separated)</label>
        <input
          type="text"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Years of Experience Input */}
      <div>
        <label className="block mb-2">Years of Experience</label>
        <input
          type="number"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(Number(e.target.value))}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Resume Upload */}
      <div>
        <label className="block mb-2">Upload Resume (Optional)</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Start Interview
      </button>
    </form>
  );
}