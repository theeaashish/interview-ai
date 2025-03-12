'use client';
import React from "react";

interface InputProps {
    type: string;
    placeholder?: string;
    src: string;
    alt: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id: string;
    autoComplete: string;
}

const Input = ({ type, name, value, placeholder, onChange, src, alt, id, autoComplete }: InputProps) => {
  return (
    <div className="input-div">
      <img src={src} alt={alt} />
      <input
        className="input-field"
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />
    </div>
  );
};

export default Input;