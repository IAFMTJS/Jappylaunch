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
type PracticeType = 'copy' | 'convert' | 'translate';
type StrokeFeedback = {
  correct: boolean;
  message: string;
  expectedStroke: number;
  currentStroke: number;
};

type StrokeType = 'horizontal' | 'vertical' | 'diagonal' | 'curve';
type StrokeOrder = {
  strokes: number;
  order: StrokeType[];
};

type StrokeOrderData = {
  [key: string]: StrokeOrder;
};

type ModeStrokeData = {
  hiragana: StrokeOrderData;
  katakana: StrokeOrderData;
  kanji: StrokeOrderData;
};

interface WritingPracticeProps {
  mode: WritingMode;
  onComplete?: () => void;
}

interface PracticeState {
  currentWord: QuizWord | Kanji | null;
  userInput: string;
  translationInput: string;
  isCorrect: boolean | null;
  isTranslationCorrect: boolean | null;
  score: number;
  totalAttempts: number;
  timeRemaining: number;
  isDrawing: boolean;
  lastX: number;
  lastY: number;
  currentStroke: number;
  strokeFeedback: StrokeFeedback | null;
  showStrokeGuide: boolean;
  showAnimation: boolean;
  strokePoints?: { x: number; y: number }[];
  displayMode: 'japanese' | 'romaji' | 'english';
}

const WritingPractice: React.FC<WritingPracticeProps> = ({ mode, onComplete }) => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { playSound } = useSound();
  const { updateProgress } = useProgress();
  const { isDarkMode } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [practiceType, setPracticeType] = useState<PracticeType>('copy');
  const [requireTranslation, setRequireTranslation] = useState(false);
  const [state, setState] = useState<PracticeState>({
    currentWord: null,
    userInput: '',
    translationInput: '',
    isCorrect: null,
    isTranslationCorrect: null,
    score: 0,
    totalAttempts: 0,
    timeRemaining: settings.timeLimit,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    currentStroke: 0,
    strokeFeedback: null,
    showStrokeGuide: true,
    showAnimation: false,
    displayMode: 'japanese'
  });

  // Stroke order data for common characters
  const strokeOrderData: ModeStrokeData = {
    hiragana: {
      'あ': { strokes: 3, order: ['horizontal', 'vertical', 'curve'] },
      'い': { strokes: 2, order: ['diagonal', 'diagonal'] },
      'う': { strokes: 2, order: ['curve', 'vertical'] },
      // Add more hiragana stroke orders
    },
    katakana: {
      'ア': { strokes: 2, order: ['horizontal', 'diagonal'] },
      'イ': { strokes: 2, order: ['vertical', 'diagonal'] },
      'ウ': { strokes: 2, order: ['horizontal', 'vertical'] },
      // Add more katakana stroke orders
    },
    kanji: {
      '一': { strokes: 1, order: ['horizontal'] },
      '二': { strokes: 2, order: ['horizontal', 'horizontal'] },
      '三': { strokes: 3, order: ['horizontal', 'horizontal', 'horizontal'] },
      // Add more kanji stroke orders
    }
  };

  const getStrokeOrder = (char: string) => {
    return strokeOrderData[mode][char] || null;
  };

  const analyzeStroke = (points: { x: number; y: number }[]) => {
    if (!state.currentWord) return null;
    
    const char = 'japanese' in state.currentWord 
      ? state.currentWord.japanese 
      : state.currentWord.character;
    
    const strokeOrder = getStrokeOrder(char);
    if (!strokeOrder) return null;

    // Analyze stroke direction and type
    const startPoint = points[0];
    const endPoint = points[points.length - 1];
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    
    // Determine stroke type based on direction
    let strokeType = '';
    if (Math.abs(dx) > Math.abs(dy)) {
      strokeType = 'horizontal';
    } else if (Math.abs(dy) > Math.abs(dx)) {
      strokeType = 'vertical';
    } else {
      strokeType = 'diagonal';
    }

    // Check if stroke matches expected order
    const expectedStroke = strokeOrder.order[state.currentStroke];
    const isCorrect = strokeType === expectedStroke;

    return {
      correct: isCorrect,
      message: isCorrect ? 'Correct stroke!' : `Expected ${expectedStroke} stroke`,
      expectedStroke: state.currentStroke + 1,
      currentStroke: state.currentStroke + 1
    };
  };

  const getFilteredWords = () => {
    // This function would filter words based on the selected mode and difficulty
    // For now, return an empty array as we'll implement this later
    return [];
  };

  const getDisplayMode = (difficulty: Difficulty): 'japanese' | 'romaji' | 'english' => {
    switch (difficulty) {
      case 'easy':
        return 'japanese';
      case 'medium':
        return Math.random() < 0.5 ? 'romaji' : 'japanese';
      case 'hard':
        return 'english';
      default:
        return 'japanese';
    }
  };

  const getExpectedInput = (word: QuizWord | Kanji, displayMode: 'japanese' | 'romaji' | 'english'): string => {
    if ('japanese' in word) {
      switch (displayMode) {
        case 'japanese':
          return word.japanese;
        case 'romaji':
          return word.romaji || '';
        case 'english':
          return word.english;
        default:
          return word.japanese;
      }
    } else {
      return word.character;
    }
  };

  const getDisplayText = (word: QuizWord | Kanji, displayMode: 'japanese' | 'romaji' | 'english'): string => {
    if (!word) return '';
    
    if ('japanese' in word) {
      switch (displayMode) {
        case 'japanese':
          return word.japanese;
        case 'romaji':
          return word.romaji || '';
        case 'english':
          return word.english;
        default:
          return word.japanese;
      }
    } else {
      return word.character;
    }
  };

  const startNewPractice = () => {
    const words = getFilteredWords();
    if (words.length === 0) return;

    const randomWord = words[Math.floor(Math.random() * words.length)];
    const displayMode = getDisplayMode(difficulty);
    
    setState(prev => ({
      ...prev,
      currentWord: randomWord,
      userInput: '',
      translationInput: '',
      isCorrect: null,
      isTranslationCorrect: null,
      timeRemaining: settings.timeLimit,
      displayMode,
      currentStroke: 0,
      strokeFeedback: null
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
      strokePoints: [{ x, y }]
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
    
    setState(prev => ({
      ...prev,
      lastX: x,
      lastY: y,
      strokePoints: [...(prev.strokePoints || []), { x, y }]
    }));

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    if (!state.isDrawing) return;
    
    const feedback = analyzeStroke(state.strokePoints || []);
    setState(prev => ({
      ...prev,
      isDrawing: false,
      strokeFeedback: feedback,
      currentStroke: feedback?.correct ? prev.currentStroke + 1 : prev.currentStroke,
      strokePoints: []
    }));

    if (feedback?.correct) {
      playSound('correct');
    } else {
      playSound('incorrect');
    }
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setState(prev => ({
      ...prev,
      currentStroke: 0,
      strokeFeedback: null
    }));
  };

  const showStrokeGuide = () => {
    if (!state.currentWord || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const char = 'japanese' in state.currentWord 
      ? state.currentWord.japanese 
      : state.currentWord.character;
    
    const strokeOrder = getStrokeOrder(char);
    if (!strokeOrder) return;

    // Draw stroke order guide
    ctx.strokeStyle = isDarkMode ? '#4a5568' : '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // Draw each stroke's guide
    strokeOrder.order.forEach((stroke, index) => {
      if (index >= state.currentStroke) {
        // Draw guide for current and future strokes
        drawStrokeGuide(ctx, stroke, index);
      }
    });
    
    ctx.setLineDash([]);
  };

  const drawStrokeGuide = (ctx: CanvasRenderingContext2D, strokeType: StrokeType, index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) * 0.6;

    ctx.beginPath();
    switch (strokeType) {
      case 'horizontal':
        ctx.moveTo(centerX - size/2, centerY - size/4 + (index * size/4));
        ctx.lineTo(centerX + size/2, centerY - size/4 + (index * size/4));
        break;
      case 'vertical':
        ctx.moveTo(centerX - size/4 + (index * size/4), centerY - size/2);
        ctx.lineTo(centerX - size/4 + (index * size/4), centerY + size/2);
        break;
      case 'diagonal':
        ctx.moveTo(centerX - size/3, centerY - size/3);
        ctx.lineTo(centerX + size/3, centerY + size/3);
        break;
      case 'curve':
        ctx.arc(centerX, centerY, size/3, 0, Math.PI * 2);
        break;
    }
    ctx.stroke();
  };

  useEffect(() => {
    if (state.showStrokeGuide) {
      showStrokeGuide();
    }
  }, [state.showStrokeGuide, state.currentStroke]);

  const handleSubmit = () => {
    if (!state.currentWord) return;

    const expectedInput = getExpectedInput(state.currentWord, state.displayMode);
    const isCorrect = state.userInput === expectedInput;
    let isTranslationCorrect = null;

    if (difficulty === 'medium' || difficulty === 'hard') {
      isTranslationCorrect = state.translationInput.toLowerCase() === 
        ('japanese' in state.currentWord ? state.currentWord.english.toLowerCase() : '');
    }

    const newScore = (isCorrect && (difficulty === 'easy' || isTranslationCorrect)) 
      ? state.score + 1 
      : state.score;
    
    setState(prev => ({
      ...prev,
      isCorrect,
      isTranslationCorrect,
      score: newScore,
      totalAttempts: prev.totalAttempts + 1,
    }));

    if (isCorrect && (difficulty === 'easy' || isTranslationCorrect)) {
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
          onChange={(e) => {
            setDifficulty(e.target.value as Difficulty);
            startNewPractice();
          }}
          className={`px-4 py-2 rounded-lg ${
            isDarkMode 
              ? 'bg-gray-700 text-white border-gray-600' 
              : 'bg-white text-gray-800 border-gray-300'
          } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="easy">Easy (Copy Writing)</option>
          <option value="medium">Medium (Convert & Translate)</option>
          <option value="hard">Hard (Full Translation)</option>
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
          <option value="copy">Writing Only</option>
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

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={state.showStrokeGuide}
            onChange={(e) => setState(prev => ({ ...prev, showStrokeGuide: e.target.checked }))}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className={isDarkMode ? 'text-white' : 'text-gray-800'}>
            Show Stroke Guide
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={state.showAnimation}
            onChange={(e) => setState(prev => ({ ...prev, showAnimation: e.target.checked }))}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className={isDarkMode ? 'text-white' : 'text-gray-800'}>
            Show Animation
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
              {state.currentWord && getDisplayText(state.currentWord, state.displayMode)}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                value={state.userInput}
                onChange={(e) => setState(prev => ({ ...prev, userInput: e.target.value }))}
                placeholder={
                  practiceType === 'copy'
                    ? "Copy the text above..." 
                    : practiceType === 'convert'
                      ? state.displayMode === 'romaji' 
                        ? "Enter the Japanese text..."
                        : "Enter the romaji..."
                      : "Enter the Japanese translation..."
                }
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-white text-gray-800 border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              
              {(practiceType === 'convert' || practiceType === 'translate') && (
                <input
                  type="text"
                  value={state.translationInput}
                  onChange={(e) => setState(prev => ({ ...prev, translationInput: e.target.value }))}
                  placeholder="Enter the English translation..."
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-white text-gray-800 border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              )}
            </div>
          </div>

          <div className="relative">
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
            {state.strokeFeedback && (
              <div className={`absolute top-0 right-0 p-2 rounded-lg ${
                state.strokeFeedback.correct
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {state.strokeFeedback.message}
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center">
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
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Current Stroke: {state.currentStroke}
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
