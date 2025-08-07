"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType<T = User> {
  isAuthenticated: boolean;
  userData: T | null;
  login: (token: string, userData: T) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing auth state on mount
    const token = localStorage.getItem("auth_token");
    const storedUserData = localStorage.getItem("user_data");

    if (token && storedUserData) {
      setIsAuthenticated(true);
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_data", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUserData(userData);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setIsAuthenticated(false);
    setUserData(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
