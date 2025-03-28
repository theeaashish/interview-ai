"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const UserProfile = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userData, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-profile-dropdown')) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  if (!userData) return null;

  return (
    <div className="relative user-profile-dropdown">
      <div
        onClick={() => setOpen(!open)}
        className="flex bg-zinc-900 cursor-pointer rounded-full px-2 py-2 gap-5 hover:bg-zinc-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 max-sm:w-8 max-sm:h-8 flex items-center justify-center rounded-full bg-zinc-700">
            {userData.avatar ? (
              <Image
                width={40}
                height={40}
                src={userData.avatar}
                alt="user-avatar"
                className="rounded-full"
              />
            ) : (
              <Image
                width={15}
                height={15}
                src="/images/Vector.svg"
                alt="user-img"
              />
            )}
          </div>

          <div className="text-white flex flex-col pr-6 -space-y-1">
            <span className="font-medium max-sm:text-xs">{userData.name}</span>
            <span className="text-xs max-sm:text-[10px] text-zinc-400">{userData.email}</span>
          </div>
        </div>
      </div>
      {open && (
        <div className="text-white absolute mt-2 w-full z-10 bg-zinc-900 rounded-lg shadow-lg border border-zinc-800">
          <ul className="py-1">
            <li
              onClick={() => {
                router.push("/profile");
                setOpen(false);
              }}
              className={`border-b cursor-pointer hover:bg-zinc-800 p-3 rounded-t-lg border-zinc-800 ${
                pathname === "/profile" ? "bg-zinc-800" : ""
              }`}
            >
              My Profile
            </li>
            <li
              onClick={() => {
                router.push("/dashboard");
                setOpen(false);
              }}
              className={`border-b cursor-pointer hover:bg-zinc-800 p-3 border-zinc-800 ${
                pathname === "/dashboard" ? "bg-zinc-800" : ""
              }`}
            >
              Dashboard
            </li>
            <li
              onClick={() => {
                router.push("/settings");
                setOpen(false);
              }}
              className={`border-b cursor-pointer hover:bg-zinc-800 p-3 border-zinc-800 ${
                pathname === "/settings" ? "bg-zinc-800" : ""
              }`}
            >
              Settings
            </li>
            <li
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="p-3 rounded-b-lg cursor-pointer font-semibold text-red-400 hover:bg-zinc-800 transition-colors"
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
