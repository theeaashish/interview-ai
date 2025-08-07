import React from "react";

const Button = ({
  name,
  style,
  hidden,
}: {
  name: string;
  style?: React.CSSProperties;
  hidden?: string;
}) => {
  return (
    <button
      style={style}
      className={`btn max-sm:px-6 max-sm:${hidden} px-8 cursor-pointer text-white transition-all duration-500 py-3 rounded-full sm:text-xl font-medium`}
    >
      {name}
    </button>
  );
};

export default Button;
