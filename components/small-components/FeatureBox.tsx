import Image from "next/image";

interface BoxProps {
  text: string;
  para: string;
  src: string;
}

const FeatureBox = ({ text, para, src }: BoxProps) => {
  return (
    <div className="bg-zinc-800 w-[300px] h-[220px] py-2 rounded-3xl flex flex-col gap-6 items-center justify-center px-6">
      <div>
        <Image width={40} height={40} src={src} alt="image-svg" />
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-xl font-bold"> {text} </h2>
        <p className="text-center text-[var(--nav-text)] text-sm">{para}</p>
      </div>
    </div>
  );
};

export default FeatureBox;
