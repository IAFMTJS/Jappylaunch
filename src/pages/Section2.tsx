import React from 'react';
import { Link } from 'react-router-dom';
import Dictionary from '../components/Dictionary';
import Settings from '../components/Settings';

const Section2 = () => {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 mr-4">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Japanese Dictionary</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-8">
              Search and learn Japanese vocabulary. Filter by category and difficulty level.
            </p>
            <Dictionary />
          </div>
        </div>
        <div>
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default Section2; 