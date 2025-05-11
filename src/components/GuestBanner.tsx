import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GuestBanner: React.FC = () => {
  const { currentUser } = useAuth();
  if (currentUser) return null;
  return (
    <div className="w-full bg-gradient-to-r from-indigo-400 to-pink-400 text-white py-2 px-4 flex items-center justify-center shadow-md z-50">
      <span className="text-sm sm:text-base font-medium">
        <span className="mr-2">Sign up or log in to save your progress and access it from any device!</span>
        <Link to="/signup" className="underline font-semibold hover:text-pink-100 transition-colors">Sign up</Link>
        <span className="mx-1">or</span>
        <Link to="/login" className="underline font-semibold hover:text-indigo-100 transition-colors">Log in</Link>
      </span>
    </div>
  );
};

export default GuestBanner; 