'use client';
import { useEffect, useState } from 'react';

interface Interview {
  _id: string;
  jobRole: string;
  techStack: string[];
  yearsOfExperience: number;
  status: string;
  createdAt: string;
}

export default function InterviewList() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];

        const response = await fetch('/api/interview/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setInterviews(data);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {interviews.map((interview) => (
        <div key={interview._id} className="p-4 border rounded-lg">
          <h3 className="text-xl font-semibold">{interview.jobRole}</h3>
          <p>Tech Stack: {interview.techStack.join(', ')}</p>
          <p>Experience: {interview.yearsOfExperience} years</p>
          <p>Status: {interview.status}</p>
          <p>Created: {new Date(interview.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}