import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored login attempts and lockout time
    const storedAttempts = localStorage.getItem('loginAttempts');
    const storedLockoutTime = localStorage.getItem('lockoutEndTime');
    
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts, 10));
    }
    if (storedLockoutTime) {
      const lockoutTime = parseInt(storedLockoutTime, 10);
      if (lockoutTime > Date.now()) {
        setLockoutEndTime(lockoutTime);
      } else {
        // Clear expired lockout
        localStorage.removeItem('lockoutEndTime');
        localStorage.removeItem('loginAttempts');
      }
    }
  }, []);

  const updateLoginAttempts = (attempts: number) => {
    setLoginAttempts(attempts);
    localStorage.setItem('loginAttempts', attempts.toString());
    
    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      const lockoutTime = Date.now() + LOCKOUT_DURATION;
      setLockoutEndTime(lockoutTime);
      localStorage.setItem('lockoutEndTime', lockoutTime.toString());
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (lockoutEndTime && Date.now() < lockoutEndTime) {
      const remainingMinutes = Math.ceil((lockoutEndTime - Date.now()) / 60000);
      setError(`Too many failed attempts. Please try again in ${remainingMinutes} minutes.`);
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      // Reset login attempts on successful login
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lockoutEndTime');
      setLoginAttempts(0);
      setLockoutEndTime(null);
      navigate('/');
    } catch (err: any) {
      const newAttempts = loginAttempts + 1;
      updateLoginAttempts(newAttempts);

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        setError(`Too many failed attempts. Please try again in ${LOCKOUT_DURATION / 60000} minutes.`);
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError(`Invalid email or password. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempts remaining.`);
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many login attempts. Please try again later.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const remainingLockoutTime = lockoutEndTime ? Math.ceil((lockoutEndTime - Date.now()) / 60000) : 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={!!lockoutEndTime}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={!!lockoutEndTime}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {lockoutEndTime && (
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="text-sm text-yellow-700">
                Account temporarily locked. Please try again in {remainingLockoutTime} minutes.
              </div>
            </div>
          )}

          <div className="text-sm text-center">
            <Link
              to="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500 mr-4"
            >
              Create an account
            </Link>
            <Link
              to="/reset-password"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !!lockoutEndTime}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 