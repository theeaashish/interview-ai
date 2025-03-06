'use client'
import Link from 'next/link'
import { useState } from 'react';
import Modal from '@/components/Modal';
import NewInterviewForm from '@/components/NewInterviewForm';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white cursor-pointer px-4 py-2 rounded"
      >
        Start New Interview
      </button>

      {/* Modal for New Interview Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NewInterviewForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default Dashboard
