import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { quizWords, Category } from '../data/quizData';
import { useProgress } from '../context/ProgressContext';
import { kuroshiroInstance } from '../utils/kuroshiro';
import { CSSTransition } from 'react-transition-group';

type Difficulty = 'easy' | 'medium' | 'hard';
type QuizType = 'multiple-choice' | 'writing';
type AnswerType = 'hiragana' | 'katakana' | 'romaji';

interface QuizSettings {
  category: Category;
  difficulty: Difficulty;
  questionCount: number;
  quizType: QuizType;
  answerType?: AnswerType; // Only used for hard difficulty
}

interface QuizState {
  currentQuestion: number;
  selectedAnswer: number | null;
  showFeedback: boolean;
  isCorrect: boolean | null;
  showCorrect: boolean;
  mode: 'setup' | 'quiz' | 'result';
}

const categories = [
  { id: 'colors', name: 'Colors' },
  { id: 'animals', name: 'Animals' },
  { id: 'food', name: 'Food & Drinks' },
  { id: 'numbers', name: 'Numbers' },
  { id: 'family', name: 'Family' },
  { id: 'weather', name: 'Weather' },
  { id: 'time', name: 'Time & Dates' },
  { id: 'transportation', name: 'Transportation' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'body', name: 'Body Parts' },
  { id: 'emotions', name: 'Emotions' },
  { id: 'school', name: 'School' },
  { id: 'hobbies', name: 'Hobbies' },
  { id: 'nature', name: 'Nature' },
  { id: 'house', name: 'House' },
  { id: 'city', name: 'City' },
  { id: 'technology', name: 'Technology' },
  { id: 'health', name: 'Health' },
  { id: 'all', name: 'All Categories' }
] as const;

const motivationalMessages = {
  positive: [
    "Great job!",
    "You're on fire!",
    "Amazing streak!",
    "Keep it up!",
    "Impressive!",
    "You're crushing it!",
    "Fantastic!",
    "Superb!"
  ],
  encouragement: [
    "Keep going!",
    "You can do it!",
    "Don't give up!",
    "Stay focused!",
    "Almost there!",
    "Try again!",
    "Believe in yourself!"
  ]
};

const Quiz: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const { updateProgress } = useApp();
  const { updateProgress: updateProgressProgress, progress, updateScoreboard } = useProgress();
  const { settings: appSettings } = useApp();
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswer: null,
    showFeedback: false,
    isCorrect: null,
    showCorrect: false,
    mode: 'setup'
  });
  const [settings, setSettings] = useState<QuizSettings>({
    category: 'all',
    difficulty: 'easy',
    questionCount: 10,
    quizType: 'multiple-choice',
    answerType: 'romaji'
  });
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [questions, setQuestions] = useState<typeof quizWords>([]);
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [timeEnded, setTimeEnded] = useState<Date | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const { progress: progressData } = useProgress();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [romajiCache, setRomajiCache] = useState<Record<string, string>>({});
  const [selectedGame, setSelectedGame] = useState<string>('matching');
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    timeLeft: 60,
    level: 1,
    mistakes: 0
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [motivation, setMotivation] = useState<string | null>(null);
  const motivationTimeout = useRef<NodeJS.Timeout | null>(null);

  const getThemeClasses = () => {
    if (isDarkMode) {
      return {
        container: 'bg-dark-card',
        text: 'text-dark-text',
        input: 'bg-dark-bg border-dark-border text-dark-text',
        button: {
          primary: 'bg-primary hover:bg-primary-dark text-white',
          secondary: 'bg-secondary hover:bg-secondary-dark text-white',
        },
      };
    }

    switch (theme) {
      case 'blue':
        return {
          container: 'bg-blue-card',
          text: 'text-blue-text',
          input: 'bg-white border-blue-border text-blue-text',
          button: {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'bg-blue-100 hover:bg-blue-200 text-blue-800',
          },
        };
      case 'green':
        return {
          container: 'bg-green-card',
          text: 'text-green-text',
          input: 'bg-white border-green-border text-green-text',
          button: {
            primary: 'bg-green-600 hover:bg-green-700 text-white',
            secondary: 'bg-green-100 hover:bg-green-200 text-green-800',
          },
        };
      default:
        return {
          container: 'bg-white',
          text: 'text-gray-800',
          input: 'bg-white border-gray-200 text-gray-800',
          button: {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
          },
        };
    }
  };

  const themeClasses = useMemo(() => getThemeClasses(), [theme, isDarkMode]);

  const generateOptions = useCallback((correctWord: typeof quizWords[0], allWords: typeof quizWords) => {
    // Get other words from the same category and difficulty
    const otherWords = allWords.filter(word => 
      word.category === correctWord.category && 
      word.difficulty === correctWord.difficulty &&
      word.english !== correctWord.english
    );
    
    // Shuffle and take 3 random options
    const shuffled = [...otherWords]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(word => word.english);
    
    // Add the correct answer and shuffle all options
    const allOptions = [...shuffled, correctWord.english]
      .sort(() => Math.random() - 0.5);
    
    return allOptions;
  }, []);

  const generateQuiz = useCallback(() => {
    let filteredWords = quizWords.filter(word => {
      const matchesCategory = settings.category === 'all' || word.category === settings.category;
      return matchesCategory;
    });

    const shuffled = [...filteredWords]
      .sort(() => Math.random() - 0.5)
      .slice(0, settings.questionCount);
    
    setQuestions(shuffled);
    setQuizState(prev => ({
      ...prev,
      currentQuestion: 0,
      score: 0,
      showFeedback: false,
      isCorrect: null,
      showCorrect: false,
      mode: 'quiz'
    }));
    setTimeStarted(new Date());
    setTimeEnded(null);
    setCurrentStreak(0);
    setBestStreak(0);
    setShowFeedback(false);
    setFeedback(false);

    // Generate options for multiple choice
    if (settings.quizType === 'multiple-choice' && shuffled.length > 0) {
      setOptions(generateOptions(shuffled[0], quizWords));
    }
  }, [settings, generateOptions]);

  const handleStartQuiz = () => {
    if (settings.difficulty === 'hard' && !settings.answerType) {
      alert('Please select an answer type for hard difficulty');
      return;
    }
    generateQuiz();
  };

  const showMotivation = useCallback((type: 'positive' | 'encouragement') => {
    // 30% chance to show a popup
    if (Math.random() < 0.3) {
      const messages = motivationalMessages[type];
      const message = messages[Math.floor(Math.random() * messages.length)];
      setMotivation(message);
      if (motivationTimeout.current) clearTimeout(motivationTimeout.current);
      motivationTimeout.current = setTimeout(() => setMotivation(null), 2000);
    }
  }, []);

  const checkAnswer = (answer: string) => {
    const isCorrect = questions[quizState.currentQuestion].english.toLowerCase() === answer.toLowerCase();
    const newScore = isCorrect ? score + 1 : score;
    const newStreak = isCorrect ? currentStreak + 1 : 0;
    const newBestStreak = Math.max(bestStreak, newStreak);
    
    setScore(newScore);
    setCurrentStreak(newStreak);
    setBestStreak(newBestStreak);
    setQuizState(prev => ({
      ...prev,
      showFeedback: true,
      isCorrect,
      showCorrect: !isCorrect
    }));
    
    // Show motivational popup occasionally
    if (isCorrect && newStreak > 0 && newStreak % 3 === 0) {
      showMotivation('positive');
    } else if (!isCorrect && Math.random() < 0.33) {
      showMotivation('encouragement');
    }

    // Update progress based on category
    if (settings.category === 'hiragana' || settings.category === 'katakana') {
      const section = settings.category as 'hiragana' | 'katakana';
      updateScoreboard(section, {
        bestStreak: newBestStreak,
        highScore: Math.max(progress[section].highScore, newScore),
        averageTime: 0 // TODO: Implement time tracking
      });
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (quizState.currentQuestion < questions.length - 1) {
        setQuizState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          currentStreak: newStreak
        }));
      } else {
        const finalScore = Math.round((newScore / questions.length) * 100);
        setQuizState(prev => ({
          ...prev,
          showResult: true,
          timeEnded: new Date()
        }));
        
        // Update quiz stats in AppContext with complete QuizData
        const timeTaken = timeStarted && new Date() ? (new Date().getTime() - timeStarted.getTime()) / 1000 : 0;
        updateProgress('section8', questions.length, newScore, {
          score: finalScore,
          date: new Date().toISOString(),
          category: settings.category,
          difficulty: settings.difficulty,
          quizType: 'multiple-choice',
          timeTaken,
          totalQuestions: questions.length,
          correctAnswers: newScore
        });
      }
    }, 1000);
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;
    checkAnswer(userAnswer.trim());
  }, [userAnswer, checkAnswer]);

  const handleNextQuestion = useCallback(() => {
    if (quizState.currentQuestion < questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        showFeedback: false,
        isCorrect: null,
        showCorrect: false
      }));
    } else {
      // Quiz is complete, calculate final score
      const finalScore = Math.round((score / questions.length) * 100);
      const timeEnded = new Date();
      const timeTaken = timeStarted ? Math.round((timeEnded.getTime() - timeStarted.getTime()) / 1000) : 0;

      // Update progress with quiz results
      updateProgress(
        'section1',
        score,
        questions.length,
        {
          score: finalScore,
          category: settings.category,
          difficulty: settings.difficulty,
          quizType: settings.quizType,
          timeTaken,
          date: timeEnded.toISOString(),
          totalQuestions: questions.length,
          correctAnswers: score
        }
      );

      setQuizState(prev => ({
        ...prev,
        showResult: true,
        timeEnded: timeEnded
      }));
    }
  }, [quizState.currentQuestion, questions.length, score, settings, timeStarted, updateProgress]);

  const restartQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      selectedAnswer: null,
      showFeedback: false,
      isCorrect: null,
      showCorrect: false,
      mode: 'setup'
    });
  };

  // Memoize filtered questions to prevent recalculation
  const filteredQuestions = useMemo(() => {
    let filtered = quizWords.filter(word => {
      const matchesCategory = settings.category === 'all' || word.category === settings.category;
      return matchesCategory;
    });
    return [...filtered].sort(() => Math.random() - 0.5).slice(0, settings.questionCount);
  }, [settings.category, settings.questionCount]);

  // Memoize options generation
  const currentOptions = useMemo(() => {
    if (settings.quizType === 'multiple-choice' && questions.length > 0) {
      return generateOptions(questions[quizState.currentQuestion], quizWords);
    }
    return [];
  }, [quizState.currentQuestion, questions, settings.quizType, generateOptions]);

  // Optimize romaji conversion with batch processing
  const updateRomajiBatch = useCallback(async (words: typeof quizWords) => {
    const newWords = words.filter(word => !romajiCache[word.japanese]);
    if (newWords.length === 0) return;

    const batchSize = 5; // Process in small batches to prevent UI blocking
    for (let i = 0; i < newWords.length; i += batchSize) {
      const batch = newWords.slice(i, i + batchSize);
      const newRomajiMap = { ...romajiCache };
      
      await Promise.all(batch.map(async (word) => {
        if (!newRomajiMap[word.japanese]) {
          try {
            newRomajiMap[word.japanese] = await kuroshiroInstance.convert(word.japanese);
          } catch (error) {
            console.error('Error converting to romaji:', error);
            newRomajiMap[word.japanese] = word.japanese;
          }
        }
      }));
      
      setRomajiCache(newRomajiMap);
    }
  }, [romajiCache]);

  // Update romaji only when questions change
  useEffect(() => {
    if (appSettings.showRomajiGames && questions.length > 0) {
      updateRomajiBatch(questions);
    }
  }, [questions, appSettings.showRomajiGames, updateRomajiBatch]);

  // Memoize the current word to prevent unnecessary re-renders
  const currentWord = useMemo(() => questions[quizState.currentQuestion], [questions, quizState.currentQuestion]);

  const renderQuizContent = () => {
    if (quizState.mode === 'setup') {
      return (
        <div className="space-y-6">
          <div>
            <label className={`block mb-2 ${themeClasses.text}`}>Select Category:</label>
            <select
              value={settings.category}
              onChange={(e) => setSettings(prev => ({ ...prev, category: e.target.value as Category }))}
              className={`w-full p-3 rounded-lg border ${themeClasses.input}`}
            >
              <option value="hiragana">Hiragana</option>
              <option value="katakana">Katakana</option>
              <option value="numbers">Numbers</option>
              <option value="colors">Colors</option>
              <option value="animals">Animals</option>
              <option value="food">Food</option>
            </select>
          </div>

          <div>
            <label className={`block mb-2 ${themeClasses.text}`}>Select Difficulty:</label>
            <select
              value={settings.difficulty}
              onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value as Difficulty }))}
              className={`w-full p-3 rounded-lg border ${themeClasses.input}`}
            >
              <option value="easy">Easy (Show word with romaji)</option>
              <option value="medium">Medium (Show only word)</option>
              <option value="hard">Hard (Type in Japanese/romaji)</option>
            </select>
          </div>

          {settings.difficulty === 'hard' && (
            <div>
              <label className={`block mb-2 ${themeClasses.text}`}>Answer Type:</label>
              <select
                value={settings.answerType}
                onChange={(e) => setSettings(prev => ({ ...prev, answerType: e.target.value as AnswerType }))}
                className={`w-full p-3 rounded-lg border ${themeClasses.input}`}
              >
                <option value="hiragana">Hiragana</option>
                <option value="katakana">Katakana</option>
                <option value="romaji">Romaji</option>
              </select>
            </div>
          )}

          <div>
            <label className={`block mb-2 ${themeClasses.text}`}>Number of Questions:</label>
            <select
              value={settings.questionCount}
              onChange={(e) => setSettings(prev => ({ ...prev, questionCount: Number(e.target.value) }))}
              className={`w-full p-3 rounded-lg border ${themeClasses.input}`}
            >
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
              <option value="15">15 Questions</option>
              <option value="20">20 Questions</option>
            </select>
          </div>

          <button
            onClick={handleStartQuiz}
            className={`w-full p-3 rounded-lg ${themeClasses.button.primary}`}
          >
            Start Quiz
          </button>
        </div>
      );
    }

    if (quizState.mode === 'result') {
      const timeSpent = timeEnded && timeStarted 
        ? Math.round((timeEnded.getTime() - timeStarted.getTime()) / 1000)
        : 0;
      const minutes = Math.floor(timeSpent / 60);
      const seconds = timeSpent % 60;
      const accuracy = Math.round((score / questions.length) * 100);

      return (
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${themeClasses.text}`}>Quiz Complete!</h2>
          <div className={`text-xl mb-4 ${themeClasses.text}`}>
            Score: {score}/{questions.length}
          </div>
          <div className={`text-lg mb-6 ${themeClasses.text}`}>
            Best Streak: {bestStreak}
          </div>
          <button
            onClick={restartQuiz}
            className={`px-6 py-3 rounded-lg ${themeClasses.button.primary}`}
          >
            Try Again
          </button>
        </div>
      );
    }

    const currentQuestionData = questions[quizState.currentQuestion];
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-4">
            Question {quizState.currentQuestion + 1} of {questions.length}
          </div>
          <div className="flex justify-between items-center">
            <div className={`text-sm ${themeClasses.text}`}>
              Score: {score}/{quizState.currentQuestion + 1}
            </div>
            <div className={`text-sm ${themeClasses.text}`}>
              {settings.quizType === 'multiple-choice' ? 'Multiple Choice' : 'Writing'} - {settings.difficulty}
            </div>
          </div>
        </div>

        <div className="mb-6">
          {settings.difficulty === 'hard' ? (
            <h3 className={`text-3xl font-bold mb-4 ${themeClasses.text}`}>
              {currentWord.english}
            </h3>
          ) : (
            <>
              <h3 className={`text-3xl font-bold mb-4 ${themeClasses.text}`}>
                {appSettings.showKanjiGames ? currentWord.japanese : currentWord.romaji}
              </h3>
              {appSettings.showRomajiGames && (
                <p className={`text-xl text-gray-600 mb-4 ${themeClasses.text}`}>
                  {romajiCache[currentWord.japanese] || 'Loading...'}
                </p>
              )}
            </>
          )}
        </div>

        {settings.quizType === 'multiple-choice' ? (
          <div className="space-y-3">
            {currentOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => !quizState.showFeedback && checkAnswer(option)}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  quizState.selectedAnswer === index
                    ? index === currentOptions.indexOf(userAnswer)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    : 'bg-white hover:bg-gray-50'
                }`}
                disabled={quizState.showFeedback}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className={`w-full p-3 rounded-lg border ${themeClasses.input}`}
              placeholder="Type your answer..."
              disabled={quizState.showFeedback}
              ref={inputRef}
            />
            <button
              type="submit"
              className={`w-full p-3 rounded-lg ${themeClasses.button.primary}`}
              disabled={quizState.showFeedback}
            >
              Check Answer
            </button>
          </form>
        )}

        {quizState.showFeedback && (
          <div className="mt-4">
            {quizState.isCorrect ? (
              <div className="text-green-700 font-semibold">Correct!</div>
            ) : (
              <div className="text-red-700 font-semibold">
                Incorrect! The correct answer is: <span className="underline">{currentWord.english}</span>
              </div>
            )}
            <button
              onClick={handleNextQuestion}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {quizState.currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${themeClasses.container} rounded-lg shadow-md p-6`}>
      <CSSTransition
        in={!!motivation}
        timeout={300}
        classNames="motivation-popup"
        unmountOnExit
      >
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-3 rounded-lg shadow-lg text-xl font-bold animate-bounce">
          {motivation}
        </div>
      </CSSTransition>
      {renderQuizContent()}
    </div>
  );
};

export default React.memo(Quiz); 