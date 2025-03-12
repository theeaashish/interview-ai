'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SocialBtn from '@/components/auth-components/SocialBtn';
import MainBtn from '@/components/auth-components/MainBtn';
import Input from '@/components/auth-components/Input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Check if already logged in
  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDebug('');
    setLoading(true);
    setLoginSuccess(false);

    try {
      // Log the request
      setDebug(prev => prev + `Sending request to /api/auth/login with email: ${email}\n`);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      // Log the response
      setDebug(prev => prev + `Response status: ${response.status}\n`);
      setDebug(prev => prev + `Response data: ${JSON.stringify(data)}\n`);

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));
      setDebug(prev => prev + `Token stored in localStorage\n`);

      // Mark login as successful
      setLoginSuccess(true);
      setDebug(prev => prev + 'Login successful, redirecting to dashboard...\n');
      
      // Add a small delay before redirecting
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
      setDebug(prev => prev + `Error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen text-white flex flex-col items-center justify-center gap-10 relative">
    <img
      className="w-[269px] h-[299px] absolute left-6 top-4"
      src="/images/circle-shape3.svg"
      alt="circle-shape"
    />
    <img
      className="w-[229px] h-[249px] absolute right-6 top-60"
      src="/images/circle-shape2.svg"
      alt="circle-shape"
    />
    <img
      className="w-[229px] h-[249px] absolute left-6 bottom-0"
      src="/images/circle-shape1.svg"
      alt="circle-shape"
    />

    <div className="flex items-center justify-center gap-6">
      <div className="bg-[var(--theme-color)] rounded-full w-[73px] h-[73px]"></div>
      <h1 className="text-4xl font-bold">
        Welcome to Sign In{" "}
        <span className="text-[var(--theme-color)]"> Buddy! </span>
      </h1>
    </div>

    {loginSuccess ? (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
        Login successful! Redirecting to dashboard...
      </div>
    ) : (

    <form className="flex flex-col w-full items-center gap-6" onSubmit={handleSubmit}>
      <Input src="/images/mail.svg" id='email' alt="mail" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete='email' placeholder="Enter your Email"/>
      <Input src="/images/lock.svg" id='password' alt="password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete='new-password' placeholder="Enter your password"/>

      <div className="flex justify-between w-[50vw]">
        <div className="flex items-center justify-center gap-3">
          <input
            type="checkbox"
            className="w-[24px] h-[24px] cursor-pointer text-blue-800 border-2 rounded-md border-white outline-none bg-transparent appearance-none checked:bg-blue-800 checked:border-white"
            name="remember-me"
          />
          <label className="font-medium text-base" htmlFor="remember-me">
            Remember Me
          </label>
        </div>
        <div>
          <h4 className="text-[var(--secondry-text)] text-base font-semibold cursor-pointer">
            Forgot Password?
          </h4>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <MainBtn type="submit" disabled={loading} name={loading ? 'Signing In...' : 'Sign In'}/>
     

      <div className="flex gap-3 items-center justify-center">
        <h5>Don’t have an account?</h5>
        <Link href={"/signup"}>
          <span className="text-base font-semibold text-[var(--secondry-text)] cursor-pointer">Sign Up</span>
        </Link>
      </div>

      <div className="flex w-[50vw] items-center mt-4">
        <div className="w-full border-t-2 border-zinc-600"></div>
        <span className="text-base whitespace-nowrap px-4 text-[#B9B9B9]">Or continue with</span>
        <div className="w-full border-t-2 border-zinc-600"></div>
      </div>

      <div className="flex w-[50vw] justify-center gap-4">
          <SocialBtn src="/images/google.svg" alt="google" name="Google"/>
          <SocialBtn src="/images/facebook.svg" alt="facebook" name="Facebook"/>
        </div>
    </form>
       )}
  </div>
  );
} 