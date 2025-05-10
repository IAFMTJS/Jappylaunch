import React, { useState, useCallback, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { quizWords, Category } from '../data/quizData';
import { useProgress } from '../context/ProgressContext';
import { kuroshiroInstance } from '../utils/kuroshiro';

type Difficulty = 'easy' | 'medium' | 'hard';
type QuizState = 'setup' | 'in-progress' | 'complete';
type QuizType = 'multiple-choice' | 'writing';
type AnswerType = 'hiragana' | 'katakana' | 'romaji';

interface QuizSettings {
  category: Category;
  difficulty: Difficulty;
  questionCount: number;
  quizType: QuizType;
  answerType?: AnswerType; // Only used for hard difficulty
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

const Quiz: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const { updateProgress } = useApp();
  const { updateProgress: updateProgressProgress } = useProgress();
  const { settings: appSettings } = useApp();
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [settings, setSettings] = useState<QuizSettings>({
    category: 'all',
    difficulty: 'easy',
    questionCount: 10,
    quizType: 'multiple-choice',
    answerType: 'romaji'
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [questions, setQuestions] = useState<typeof quizWords>([]);
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [timeEnded, setTimeEnded] = useState<Date | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const { progress } = useProgress();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [romajiMap, setRomajiMap] = useState<Record<string, string>>({});

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

  const themeClasses = getThemeClasses();

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
    setCurrentQuestion(0);
    setScore(0);
    setShowAnswer(false);
    setUserAnswer('');
    setIsCorrect(null);
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
    setQuizState('in-progress');
  };

  const checkAnswer = (answer: string) => {
    const isCorrect = questions[currentQuestion].english.toLowerCase() === answer.toLowerCase();
    const newScore = isCorrect ? score + 1 : score;
    const newStreak = isCorrect ? currentStreak + 1 : 0;
    const newBestStreak = Math.max(bestStreak, newStreak);
    
    setScore(newScore);
    setCurrentStreak(newStreak);
    setBestStreak(newBestStreak);
    setShowFeedback(true);
    setFeedback(isCorrect);
    
    // Update progress based on category
    if (settings.category === 'hiragana' || settings.category === 'katakana') {
      const section = settings.category as 'hiragana' | 'katakana';
      updateProgressProgress(section, {
        totalQuestions: (progress[section].totalQuestions || 0) + 1,
        correctAnswers: (progress[section].correctAnswers || 0) + (isCorrect ? 1 : 0),
        bestStreak: newBestStreak,
        lastAttempt: new Date().toISOString(),
        averageTime: 0 // TODO: Implement time tracking
      });
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setCurrentStreak(newStreak);
      } else {
        const finalScore = Math.round((newScore / questions.length) * 100);
        setQuizState('complete');
        const endTime = new Date();
        setTimeEnded(endTime);
        
        // Update quiz stats in AppContext with complete QuizData
        const timeTaken = timeStarted && endTime ? (endTime.getTime() - timeStarted.getTime()) / 1000 : 0;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    checkAnswer(userAnswer.trim());
  };

  const handleOptionSelect = (option: string) => {
    checkAnswer(option);
  };

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowAnswer(false);
      setUserAnswer('');
      setIsCorrect(null);
      if (settings.quizType === 'multiple-choice') {
        setOptions(generateOptions(questions[currentQuestion + 1], quizWords));
      }
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

      setQuizState('complete');
      setTimeEnded(timeEnded);
    }
  }, [currentQuestion, questions.length, score, settings, timeStarted, updateProgress]);

  const restartQuiz = () => {
    setQuizState('setup');
  };

  // Function to get romaji for a given text
  const getRomaji = async (text: string) => {
    if (romajiMap[text]) return romajiMap[text];
    try {
      const romaji = await kuroshiroInstance.convert(text);
      setRomajiMap(prev => ({ ...prev, [text]: romaji }));
      return romaji;
    } catch (error) {
      console.error('Error converting to romaji:', error);
      return text;
    }
  };

  // Update romaji when settings change
  useEffect(() => {
    if (appSettings.showRomajiGames) {
      const updateRomaji = async () => {
        for (const word of questions) {
          if (!romajiMap[word.japanese]) {
            await getRomaji(word.japanese);
          }
        }
      };
      updateRomaji();
    }
  }, [questions, appSettings.showRomajiGames]);

  if (quizState === 'setup') {
    return (
      <div className={`${themeClasses.container} rounded-lg shadow-md p-6`}>
        <h2 className={`text-2xl font-bold mb-6 ${themeClasses.text}`}>Quiz Setup</h2>
        
        <div className="space-y-6">
          <div>
            <label className={`block mb-2 ${themeClasses.text}`}>Select Category:</label>
            <select
              value={settings.category}
              onChange={(e) => setSettings(prev => ({ ...prev, category: e.target.value as Category }))}
              className={`w-full p-3 rounded-lg border ${themeClasses.input}`}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block mb-2 ${themeClasses.text}`}>Select Quiz Type:</label>
            <select
              value={settings.quizType}
              onChange={(e) => setSettings(prev => ({ ...prev, quizType: e.target.value as QuizType }))}
              className={`w-full p-3 rounded-lg border ${themeClasses.input}`}
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="writing">Writing</option>
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
                onChange={(e) => setSettings(prev => ({ ...prev, answerType: e.target.value as 'hiragana' | 'katakana' | 'romaji' }))}
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
      </div>
    );
  }

  if (quizState === 'complete') {
    const timeSpent = timeEnded && timeStarted 
      ? Math.round((timeEnded.getTime() - timeStarted.getTime()) / 1000)
      : 0;
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    const accuracy = Math.round((score / questions.length) * 100);

    return (
      <div className={`${themeClasses.container} rounded-lg shadow-md p-6`}>
        <h2 className={`text-2xl font-bold mb-6 ${themeClasses.text}`}>Quiz Complete!</h2>
        
        <div className="space-y-4">
          <div className={`text-xl ${themeClasses.text}`}>
            <p>Score: {score} out of {questions.length}</p>
            <p>Accuracy: {accuracy}%</p>
            <p>Time: {minutes}m {seconds}s</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={restartQuiz}
              className={`w-full p-3 rounded-lg ${themeClasses.button.primary}`}
            >
              Try Again
            </button>
            <button
              onClick={() => {
                setSettings(prev => ({
                  ...prev,
                  category: 'all'
                }));
                restartQuiz();
              }}
              className={`w-full p-3 rounded-lg ${themeClasses.button.secondary}`}
            >
              Change Category
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className={`${themeClasses.container} rounded-lg shadow-md p-6`}>
        <p className={`${themeClasses.text}`}>
          No questions available for the selected category and difficulty. Please try different settings.
        </p>
        <button
          onClick={restartQuiz}
          className={`mt-4 p-3 rounded-lg ${themeClasses.button.primary}`}
        >
          Back to Setup
        </button>
      </div>
    );
  }

  const currentWord = questions[currentQuestion];

  return (
    <div className={`${themeClasses.container} rounded-lg shadow-md p-6`}>
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-4">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="flex justify-between items-center">
          <div className={`text-sm ${themeClasses.text}`}>
            Score: {score}/{currentQuestion + 1}
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
                {romajiMap[currentWord.japanese] || 'Loading...'}
              </p>
            )}
          </>
        )}
      </div>

      {!showAnswer ? (
        settings.quizType === 'multiple-choice' ? (
          <div className="space-y-4">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-3 rounded-lg text-left ${
                  themeClasses.button.secondary
                }`}
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
              placeholder="Enter the English meaning..."
              className={`w-full p-3 rounded-lg border ${themeClasses.input}`}
              autoFocus
            />
            <button
              type="submit"
              className={`w-full p-3 rounded-lg ${themeClasses.button.primary}`}
            >
              Check Answer
            </button>
          </form>
        )
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${
            feedback ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <p className="text-xl font-semibold mb-2">
              {feedback ? 'Correct! 🎉' : 'Incorrect 😕'}
            </p>
            {settings.difficulty === 'hard' ? (
              <>
                <p className="mb-2">
                  The correct answer is: {currentWord.japanese}
                </p>
              </>
            ) : (
              <>
                <p className="mb-2">
                  The correct answer is: {currentWord.english}
                </p>
                {currentWord.hint && (
                  <p className="text-sm opacity-75">
                    Hint: {currentWord.hint}
                  </p>
                )}
              </>
            )}
          </div>
          <button
            onClick={handleNext}
            className={`w-full p-3 rounded-lg ${themeClasses.button.primary}`}
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz; 