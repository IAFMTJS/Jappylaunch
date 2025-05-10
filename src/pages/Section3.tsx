import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Settings from '../components/Settings';

const Section3 = () => {
  const { settings, updateProgress } = useApp();
  const [selectedExercise, setSelectedExercise] = useState<string>('sentence');
  const [prompt, setPrompt] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [completedExercises, setCompletedExercises] = useState<number>(0);
  const [totalExercises, setTotalExercises] = useState<number>(0);

  const exercises = [
    { id: 'sentence', name: 'Sentence Construction' },
    { id: 'paragraph', name: 'Paragraph Writing' },
    { id: 'diary', name: 'Diary Entry' },
    { id: 'email', name: 'Email Writing' },
    { id: 'story', name: 'Story Writing' }
  ];

  const getPrompt = (type: string) => {
    const prompts = {
      sentence: 'Write a sentence about your daily routine using the following words: 毎日、学校、行きます',
      paragraph: 'Write a short paragraph about your favorite season. Include what you like to do during that season.',
      diary: 'Write a diary entry about your day. Include what you did, what you ate, and how you felt.',
      email: 'Write an email to a Japanese friend inviting them to a party. Include the date, time, and location.',
      story: 'Write a short story about a magical day. Use your imagination!'
    };
    return prompts[type as keyof typeof prompts] || '';
  };

  const handleExerciseChange = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setPrompt(getPrompt(exerciseId));
    setUserInput('');
  };

  const handleSave = () => {
    if (userInput.trim().length > 0) {
      setCompletedExercises(prev => prev + 1);
      setUserInput('');
      setPrompt(getPrompt(selectedExercise));
    }
  };

  useEffect(() => {
    setTotalExercises(exercises.length);
  }, []);

  useEffect(() => {
    updateProgress('section3', completedExercises, totalExercises);
  }, [completedExercises, totalExercises, updateProgress]);

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 mr-4">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Writing Practice</h1>
        </div>
        <div className="text-sm text-gray-600">
          Progress: {completedExercises}/{totalExercises} exercises completed
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Choose an Exercise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => handleExerciseChange(exercise.id)}
                    className={`p-4 rounded-lg border ${
                      selectedExercise === exercise.id
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {exercise.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedExercise && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Prompt:</h3>
                  <p className="text-gray-700">{prompt}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Your Writing:</h3>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your response here..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setUserInput('')}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default Section3; 