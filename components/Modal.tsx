"use client";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  // Close modal on pressing Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl p-6 bg-white rounded-lg">
        <button
          onClick={onClose}
          className="absolute text-gray-500 top-4 right-4 hover:text-gray-700"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
