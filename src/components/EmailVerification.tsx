import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function EmailVerification() {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, sendVerificationEmail, isEmailVerified } = useAuth();

  const handleResendVerification = async () => {
    try {
      setError('');
      setMessage('');
      setLoading(true);
      await sendVerificationEmail();
      setMessage('Verification email sent. Please check your inbox.');
    } catch (err: any) {
      setError('Failed to send verification email. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || isEmailVerified) {
    return null;
  }

  return (
    <div className="rounded-md bg-yellow-50 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Email verification required
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Please verify your email address to access all features.
              {message && <span className="block mt-1 text-green-700">{message}</span>}
              {error && <span className="block mt-1 text-red-700">{error}</span>}
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Resend verification email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 