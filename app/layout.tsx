// import { ThemeProvider } from "next-themes";
import "./globals.css";
import localfont from "next/font/local";
import { Metadata } from "next";
import Image from "next/image";
import NavBarWrapper from "@/components/NavBarWrapper";
import { AuthProvider } from "@/context/AuthContext";
import InterviewNav from "@/components/interview/InterviewNav";

const mazzard = localfont({
  src: [
    {
      path: "../public/fonts/MazzardM-Light.otf",
      weight: "400",
      style: "normal",
    },

    {
      path: "../public/fonts/MazzardM-Medium.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/MazzardM-Regular.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/MazzardM-SemiBold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-mazzard",
});

const radis = localfont({
  src: "../public/fonts/Radis-Sans.otf",
  variable: "--font-radis",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[var(--background)]">
      <body className={`${mazzard.variable} ${radis.variable} font-sans`}>
        <AuthProvider>
          <div className="absolute -top-30 left-0 -z-10">
            <Image width={700} height={700} src="/images/bg-shade.png" alt="" />
          </div>
          <div className="absolute right-0 -z-10">
            <Image
              className="bottom-0 right-0 -z-10"
              width={700}
              height={700}
              src="/images/bg-shade2.png"
              alt=""
            />
          </div>
          <NavBarWrapper />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
} 