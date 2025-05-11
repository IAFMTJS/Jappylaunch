import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useSound } from '../context/SoundContext';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { QuizWord } from '../data/quizData';
import { Kanji } from '../data/kanjiData';

type WritingMode = 'hiragana' | 'katakana' | 'kanji';
type Difficulty = 'easy' | 'medium' | 'hard';
type PracticeType = 'writing' | 'translation' | 'both';

interface WritingPracticeProps {
  mode: WritingMode;
  onComplete?: () => void;
}

interface PracticeState {
  currentWord: QuizWord | Kanji | null;
  userInput: string;
  isCorrect: boolean | null;
  score: number;
  totalAttempts: number;
  timeRemaining: number;
  isDrawing: boolean;
  lastX: number;
  lastY: number;
}

const WritingPractice: React.FC<WritingPracticeProps> = ({ mode, onComplete }) => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { playSound } = useSound();
  const { updateProgress } = useProgress();
  const { isDarkMode } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [practiceType, setPracticeType] = useState<PracticeType>('writing');
  const [requireTranslation, setRequireTranslation] = useState(false);
  const [state, setState] = useState<PracticeState>({
    currentWord: null,
    userInput: '',
    isCorrect: null,
    score: 0,
    totalAttempts: 0,
    timeRemaining: settings.timeLimit,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
  });

  const getFilteredWords = () => {
    // This function would filter words based on the selected mode and difficulty
    // For now, return an empty array as we'll implement this later
    return [];
  };

  const startNewPractice = () => {
    const words = getFilteredWords();
    if (words.length === 0) return;

    const randomWord = words[Math.floor(Math.random() * words.length)];
    setState(prev => ({
      ...prev,
      currentWord: randomWord,
      userInput: '',
      isCorrect: null,
      timeRemaining: settings.timeLimit,
    }));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setState(prev => ({
      ...prev,
      isDrawing: true,
      lastX: x,
      lastY: y,
    }));

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = isDarkMode ? '#ffffff' : '#000000';
      ctx.lineWidth = 2;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!state.isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    setState(prev => ({
      ...prev,
      lastX: x,
      lastY: y,
    }));
  };

  const handleMouseUp = () => {
    setState(prev => ({ ...prev, isDrawing: false }));
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleSubmit = () => {
    if (!state.currentWord) return;

    const isCorrect = 'japanese' in state.currentWord 
      ? state.userInput === state.currentWord.japanese
      : state.userInput === state.currentWord.character;
    const newScore = isCorrect ? state.score + 1 : state.score;
    
    setState(prev => ({
      ...prev,
      isCorrect,
      score: newScore,
      totalAttempts: prev.totalAttempts + 1,
    }));

    if (isCorrect) {
      playSound('correct');
      updateProgress(mode, {
        totalQuestions: 1,
        correctAnswers: 1,
        bestStreak: state.score + 1,
        highScore: state.score + 1,
        lastAttempt: new Date().toISOString()
      });
    } else {
      playSound('incorrect');
      updateProgress(mode, {
        totalQuestions: 1,
        correctAnswers: 0,
        lastAttempt: new Date().toISOString()
      });
    }

    if (newScore >= 10) {
      playSound('complete');
      if (onComplete) onComplete();
      else navigate('/');
    }
  };

  const handleNext = () => {
    clearCanvas();
    startNewPractice();
  };

  useEffect(() => {
    if (settings.useTimer && state.timeRemaining > 0) {
      const timer = setInterval(() => {
        setState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [settings.useTimer, state.timeRemaining]);

  useEffect(() => {
    if (state.timeRemaining === 0) {
      playSound('incorrect');
      handleNext();
    }
  }, [state.timeRemaining]);

  useEffect(() => {
    startNewPractice();
  }, [mode, difficulty, practiceType]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          className={`px-4 py-2 rounded-lg ${
            isDarkMode 
              ? 'bg-gray-700 text-white border-gray-600' 
              : 'bg-white text-gray-800 border-gray-300'
          } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          value={practiceType}
          onChange={(e) => setPracticeType(e.target.value as PracticeType)}
          className={`px-4 py-2 rounded-lg ${
            isDarkMode 
              ? 'bg-gray-700 text-white border-gray-600' 
              : 'bg-white text-gray-800 border-gray-300'
          } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="writing">Writing Only</option>
          <option value="translation">Translation Only</option>
          <option value="both">Both</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={requireTranslation}
            onChange={(e) => setRequireTranslation(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className={isDarkMode ? 'text-white' : 'text-gray-800'}>
            Require Translation
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-md`}>
            <h2 className={`text-xl font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {state.currentWord?.english}
            </h2>
            {practiceType !== 'writing' && (
              <input
                type="text"
                value={state.userInput}
                onChange={(e) => setState(prev => ({ ...prev, userInput: e.target.value }))}
                placeholder="Enter your answer..."
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-white text-gray-800 border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            )}
          </div>

          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className={`border-2 rounded-lg ${
              isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          <div className="flex justify-between items-center">
            <button
              onClick={clearCanvas}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Clear
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit
            </button>
            <button
              onClick={handleNext}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Next
            </button>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-md`}>
          <div className="space-y-4">
            <div>
              <h3 className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Progress
              </h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Score: {state.score} / 10
              </p>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Attempts: {state.totalAttempts}
              </p>
            </div>

            {settings.useTimer && (
              <div>
                <h3 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Time Remaining
                </h3>
                <p className={`text-2xl font-bold ${
                  state.timeRemaining <= 10 
                    ? 'text-red-500' 
                    : isDarkMode 
                      ? 'text-white' 
                      : 'text-gray-800'
                }`}>
                  {state.timeRemaining}s
                </p>
              </div>
            )}

            {state.isCorrect !== null && (
              <div className={`p-4 rounded-lg ${
                state.isCorrect 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <p className="font-semibold">
                  {state.isCorrect ? 'Correct!' : 'Incorrect. Try again!'}
                </p>
                {!state.isCorrect && state.currentWord && (
                  <p className="mt-2">
                    Correct answer: {'japanese' in state.currentWord 
                      ? state.currentWord.japanese 
                      : state.currentWord.character}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingPractice;
