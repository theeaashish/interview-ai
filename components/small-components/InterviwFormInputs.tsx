"use client";
import React from "react";

interface InputProps {
  label: string;
  type: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  accept?: string;
}

const InterviwFormInputs = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  min,
  max,
  accept,
}: InputProps) => {
  return (
    <div className="flex flex-col w-[100%]">
      <label className="mb-2 text-sm">{label}</label>
      <input
        className="border py-2 rounded-lg px-4 border-zinc-700 w-[100%]"
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        accept={accept}
      />
    </div>
  );
};

export default InterviwFormInputs;
