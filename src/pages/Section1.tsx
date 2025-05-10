import React from 'react';
import { Link } from 'react-router-dom';
import Quiz from '../components/Quiz';

const Section1 = () => {
  return (
    <div className="py-8">
      <div className="flex items-center mb-8">
        <Link to="/" className="text-blue-600 hover:text-blue-800 mr-4">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Hiragana & Katakana Quiz</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-8">
          Test your knowledge of Japanese words written in hiragana and katakana. 
          Choose a difficulty level and category to start the quiz.
        </p>
        <Quiz />
      </div>
    </div>
  );
};

export default Section1; 