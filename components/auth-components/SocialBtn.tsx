import React from "react";
import Image from "next/image";

interface SocialBtnProps {
    src: string;
    alt: string;
    name: string;
}

const SocialBtn = ({src, alt, name}: SocialBtnProps) => {
  return (
    <div className="w-full">
      <button className="btn-primary">
        <Image width={20} height={20}
          src={src}
          alt={alt}
        />
        {name}
      </button>
    </div>
  );
};

export default SocialBtn;