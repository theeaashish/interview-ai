"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainBtn from "@/components/auth-components/MainBtn";
import Input from "@/components/auth-components/Input";
import OAuthBtn from "@/components/auth-components/OAuthBtn";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setLoginSuccess(false);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      // Use the auth context to handle login
      login(data.token, data.user);

      // Add a small delay before redirecting
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred during login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen gap-10 text-white max-sm:px-8">
      <Image
        width={200}
        height={200}
        className="absolute max-sm:hidden left-6 top-4"
        src="/images/circle-shape3.svg"
        alt="circle-shape"
      />
      <Image
        width={200}
        height={200}
        className="absolute  max-sm:hidden right-6 top-60"
        src="/images/circle-shape2.svg"
        alt="circle-shape"
      />
      <Image
        width={200}
        height={200}
        className="absolute bottom-0 max-sm:hidden left-6"
        src="/images/circle-shape1.svg"
        alt="circle-shape"
      />

      <div className="flex items-center justify-center gap-6">
        <div className="bg-[var(--theme-color)] max-sm:hidden rounded-full w-[73px] h-[73px]"></div>
        <h1 className="text-4xl font-bold max-sm:text-center max-sm:text-2xl">
          Welcome to Sign In{" "}
          <span className="text-[var(--theme-color)]">Buddy!</span>
        </h1>
      </div>

      {loginSuccess ? (
        <div className="px-4 py-3 mb-4 text-center text-green-700 bg-green-100 border border-green-400 rounded">
          Login successful! Redirecting to dashboard...
        </div>
      ) : (
        <form
          className="flex flex-col items-center w-full gap-6"
          onSubmit={handleSubmit}
        >
          <Input
            src="/images/mail.svg"
            id="email"
            alt="mail"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="Enter your Email"
          />
          <Input
            src="/images/lock.svg"
            id="password"
            alt="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Enter your password"
          />

          <div className="flex justify-between max-sm:w-full w-[50vw]">
            <div className="flex items-center justify-center gap-3">
              <input
                type="checkbox"
                className="w-[24px] h-[24px] cursor-pointer text-blue-800 border-2 rounded-md border-white outline-none bg-transparent appearance-none checked:bg-blue-800 checked:border-white"
                name="remember-me"
              />
              <label className="text-base font-medium" htmlFor="remember-me">
                Remember Me
              </label>
            </div>
            <div>
              <h4 className="text-[var(--secondry-text)] text-base font-semibold cursor-pointer">
                Forgot Password?
              </h4>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <MainBtn
            type="submit"
            disabled={loading}
            name={loading ? "Signing In..." : "Sign In"}
          />

          <OAuthBtn
            path="/signup"
            text="Sign Up"
            account="Don't have an account?"
          />
        </form>
      )}
    </div>
  );
}
