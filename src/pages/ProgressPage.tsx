import React from 'react';
import { Link } from 'react-router-dom';
import Progress from '../components/Progress';

const ProgressPage: React.FC = () => {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 mr-4">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Learning Progress</h1>
        </div>
      </div>
      
      <Progress detailed={true} />
    </div>
  );
};

export default ProgressPage; 