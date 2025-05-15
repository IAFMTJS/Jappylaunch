import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { kuroshiroInstance } from '../utils/kuroshiro';
import { useApp } from '../context/AppContext';
import type { Settings } from '../context/AppContext';
import { quizWords, Category } from '../data/quizData';

interface WordPair {
  id: string;
  japanese: string;
  english: string;
  hiragana: string;
  isMatched?: boolean;
  isSelected?: boolean;
}

interface GameState {
  isPlaying: boolean;
  score: number;
  timeLeft: number;
  level: number;
  mistakes: number;
}

interface Card {
  id: string;
  content: string;
  type: string;
  isFlipped: boolean;
  isMatched: boolean;
  match?: string;
}

interface SentenceWord {
  id: number;
  word: string;
  type: string;
  isPlaced: boolean;
}

interface GameSettings {
  showRomajiGames: boolean;
  showKanjiGames: boolean;
}

// Separate game states
interface BaseGameState {
  isPlaying: boolean;
  score: number;
  mistakes: number;
}

interface MemoryCard {
  id: number;
  word: string;
  match: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameState extends BaseGameState {
  cards: MemoryCard[];
  feedback: string;
  isWin: boolean;
}

interface MatchingPair {
  id: number;
  japanese: string;
  english: string;
  hiragana: string;
  isMatched: boolean;
  isSelected: boolean;
}

interface MatchingGameState extends BaseGameState {
  pairs: MatchingPair[];
}

interface SentenceGameState extends BaseGameState {
  currentSentence: typeof sentenceExamples[0];
  choices: SentenceWord[];
  answer: SentenceWord[];
  feedback: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizGameState extends BaseGameState {
  currentQuestion: number;
  selectedAnswer: string | null;
  showFeedback: boolean;
  isCorrect: boolean | null;
  showCorrect: boolean;
  questions: QuizQuestion[];
}

interface AssociationGameState extends BaseGameState {
  currentWord: string;
  selectedAssociations: string[];
  correctAssociations: string[];
}

const sentenceExamples = [
  { english: 'I am a student.', japanese: 'わたし は がくせい です' },
  { english: 'I go to school every day.', japanese: '毎日 学校 に 行きます' },
  { english: 'I study Japanese.', japanese: '日本語 を 勉強 します' },
  { english: 'I drink coffee in the morning.', japanese: '朝 コーヒー を のみます' },
  { english: 'Tomorrow I will eat sushi.', japanese: '明日 すし を たべます' }
] as const;

const Section8 = () => {
  const { theme, isDarkMode } = useTheme();
  const { updateProgress } = useProgress();
  const { settings } = useApp();
  const [selectedGame, setSelectedGame] = useState<string>('matching');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [romajiMap, setRomajiMap] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  // Game data
  const sentenceExamples = [
    { english: 'I am a student.', japanese: 'わたし は がくせい です' },
    { english: 'I go to school every day.', japanese: '毎日 学校 に 行きます' },
    { english: 'I study Japanese.', japanese: '日本語 を 勉強 します' },
    { english: 'I drink coffee in the morning.', japanese: '朝 コーヒー を のみます' },
    { english: 'Tomorrow I will eat sushi.', japanese: '明日 すし を たべます' }
  ] as const;

  // Game-specific states
  const [memoryState, setMemoryState] = useState<MemoryGameState>({
    isPlaying: false,
    score: 0,
    mistakes: 0,
    cards: [],
    feedback: '',
    isWin: false
  });

  const [matchingState, setMatchingState] = useState<MatchingGameState>({
    isPlaying: false,
    score: 0,
    mistakes: 0,
    pairs: []
  });

  const [sentenceState, setSentenceState] = useState<SentenceGameState>({
    isPlaying: false,
    score: 0,
    mistakes: 0,
    currentSentence: sentenceExamples[0],
    choices: [],
    answer: [],
    feedback: ''
  });

  const [quizState, setQuizState] = useState<QuizGameState>({
    isPlaying: false,
    score: 0,
    mistakes: 0,
    currentQuestion: 0,
    selectedAnswer: null,
    showFeedback: false,
    isCorrect: null,
    showCorrect: false,
    questions: []
  });

  const [associationState, setAssociationState] = useState<AssociationGameState>({
    isPlaying: false,
    score: 0,
    mistakes: 0,
    currentWord: '',
    selectedAssociations: [],
    correctAssociations: []
  });

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(60);

  const games = [
    { id: 'matching', name: 'Word Matching', description: 'Match Japanese words with their English meanings' },
    { id: 'sentence', name: 'Sentence Building', description: 'Build correct Japanese sentences by arranging words' },
    { id: 'memory', name: 'Memory Game', description: 'Find matching pairs of Japanese characters and their readings' },
    { id: 'quiz', name: 'Quick Quiz', description: 'Test your knowledge with timed questions' },
    { id: 'association', name: 'Word Association', description: 'Find words that are commonly associated with each other' }
  ];

  // Game data
  const memoryGameData: MemoryCard[] = [
    { id: 1, word: 'あ', match: 'a', isFlipped: false, isMatched: false },
    { id: 2, word: 'い', match: 'i', isFlipped: false, isMatched: false },
    { id: 3, word: 'う', match: 'u', isFlipped: false, isMatched: false },
    { id: 4, word: 'え', match: 'e', isFlipped: false, isMatched: false },
    { id: 5, word: 'お', match: 'o', isFlipped: false, isMatched: false },
    { id: 6, word: 'か', match: 'ka', isFlipped: false, isMatched: false },
    { id: 7, word: 'き', match: 'ki', isFlipped: false, isMatched: false },
    { id: 8, word: 'く', match: 'ku', isFlipped: false, isMatched: false },
    { id: 9, word: 'け', match: 'ke', isFlipped: false, isMatched: false },
    { id: 10, word: 'こ', match: 'ko', isFlipped: false, isMatched: false },
    { id: 11, word: 'さ', match: 'sa', isFlipped: false, isMatched: false },
    { id: 12, word: 'し', match: 'shi', isFlipped: false, isMatched: false },
    { id: 13, word: 'す', match: 'su', isFlipped: false, isMatched: false },
    { id: 14, word: 'せ', match: 'se', isFlipped: false, isMatched: false },
    { id: 15, word: 'そ', match: 'so', isFlipped: false, isMatched: false },
    { id: 16, word: 'た', match: 'ta', isFlipped: false, isMatched: false }
  ];

  const matchingGameData: MatchingPair[] = [
    { id: 1, japanese: '猫', english: 'cat', hiragana: 'ねこ', isMatched: false, isSelected: false },
    { id: 2, japanese: '犬', english: 'dog', hiragana: 'いぬ', isMatched: false, isSelected: false },
    { id: 3, japanese: '鳥', english: 'bird', hiragana: 'とり', isMatched: false, isSelected: false },
    { id: 4, japanese: '魚', english: 'fish', hiragana: 'さかな', isMatched: false, isSelected: false },
    { id: 5, japanese: '本', english: 'book', hiragana: 'ほん', isMatched: false, isSelected: false },
    { id: 6, japanese: '水', english: 'water', hiragana: 'みず', isMatched: false, isSelected: false }
  ];

  const sentenceGameData = [
    { id: 1, word: 'わたし', type: 'pronoun' },
    { id: 2, word: 'は', type: 'particle' },
    { id: 3, word: 'がくせい', type: 'noun' },
    { id: 4, word: 'です', type: 'copula' },
    { id: 5, word: '毎日', type: 'adverb' },
    { id: 6, word: '学校', type: 'noun' },
    { id: 7, word: 'に', type: 'particle' },
    { id: 8, word: '行きます', type: 'verb' },
    { id: 9, word: '今日', type: 'noun' },
    { id: 10, word: 'から', type: 'particle' },
    { id: 11, word: '日本語', type: 'noun' },
    { id: 12, word: 'を', type: 'particle' },
    { id: 13, word: '勉強', type: 'noun' },
    { id: 14, word: 'します', type: 'verb' },
    { id: 15, word: '明日', type: 'noun' },
    { id: 16, word: 'も', type: 'particle' },
    { id: 17, word: 'あした', type: 'noun' },
    { id: 18, word: 'きょう', type: 'noun' },
    { id: 19, word: 'あさ', type: 'noun' },
    { id: 20, word: 'よる', type: 'noun' },
    { id: 21, word: 'みる', type: 'verb' },
    { id: 22, word: 'きく', type: 'verb' },
    { id: 23, word: 'たべる', type: 'verb' },
    { id: 24, word: 'のむ', type: 'verb' },
    { id: 25, word: 'テレビ', type: 'noun' },
    { id: 26, word: 'ラジオ', type: 'noun' },
    { id: 27, word: 'パソコン', type: 'noun' },
    { id: 28, word: 'カメラ', type: 'noun' },
    { id: 29, word: 'ピアノ', type: 'noun' },
    { id: 30, word: 'ギター', type: 'noun' },
    { id: 31, word: 'コーヒー', type: 'noun' },
    { id: 32, word: 'ジュース', type: 'noun' }
  ];

  // Game initialization functions
  const initializeSentenceBuilder = useCallback(() => {
    console.log('Initializing sentence builder...');
    try {
      const example = sentenceExamples[Math.floor(Math.random() * sentenceExamples.length)];
      setSentenceState(prev => ({
        ...prev,
        currentSentence: example,
        choices: example.japanese.split(' ').map((word, idx) => ({ id: idx, word, type: 'word', isPlaced: false })).sort(() => Math.random() - 0.5),
        answer: [],
        feedback: '',
        score: 0,
        mistakes: 0
      }));
      console.log('Sentence builder initialized successfully');
    } catch (error) {
      console.error('Error initializing sentence builder:', error);
      setSentenceState(prev => ({ ...prev, feedback: 'Error initializing game. Please try again.' }));
    }
  }, [sentenceExamples]);

  const initializeMemoryGame = useCallback(() => {
    const shuffledCards = [...memoryGameData]
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, isFlipped: false, isMatched: false }));
    
    setMemoryState(prev => ({
      ...prev,
      cards: shuffledCards,
      feedback: '',
      isWin: false,
      score: 0,
      mistakes: 0,
      isPlaying: true
    }));
  }, []);

  const initializeMatchingGame = useCallback(() => {
    const shuffledPairs = [...matchingGameData]
      .sort(() => Math.random() - 0.5)
      .map(pair => ({ ...pair, isMatched: false, isSelected: false }));
    
    setMatchingState(prev => ({
      ...prev,
      pairs: shuffledPairs,
      score: 0,
      mistakes: 0,
      isPlaying: true
    }));
  }, []);

  const initializeSentenceGameData = useCallback(() => {
    const words = sentenceGameData
      .map(word => ({ ...word, isPlaced: false }))
      .sort(() => Math.random() - 0.5);
    setSentenceState(prev => ({
      ...prev,
      choices: words,
      answer: [],
      score: 0,
      mistakes: 0
    }));
  }, []);

  const initializeQuizGame = useCallback(() => {
    // Filter questions based on selectedCategory
    let filteredQuestions = quizWords;
    if (selectedCategory === 'hiragana') {
      filteredQuestions = quizWords.filter(q => q.isHiragana);
    } else if (selectedCategory === 'katakana') {
      filteredQuestions = quizWords.filter(q => q.isKatakana);
    }
    // Shuffle and pick 10 questions
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    // Map to QuizQuestion format
    const questions = shuffled.map((q, idx) => ({
      id: idx + 1,
      question: `What is the reading for "${q.japanese}"?`,
      options: shuffleArray([
        q.english,
        ...shuffleArray(quizWords.filter(w => w !== q && ((selectedCategory === 'hiragana' && w.isHiragana) || (selectedCategory === 'katakana' && w.isKatakana) || selectedCategory === 'all')).map(w => w.english)).slice(0, 3)
      ]),
      correctAnswer: q.english
    }));
    setQuizState(prev => ({
      ...prev,
      currentQuestion: 0,
      selectedAnswer: null,
      showFeedback: false,
      isCorrect: null,
      showCorrect: false,
      score: 0,
      mistakes: 0,
      questions
    }));
  }, [selectedCategory]);

  const initializeAssociationGame = useCallback(() => {
    const currentWordData = associationGameData[0];
    setAssociationState(prev => ({
      ...prev,
      currentWord: currentWordData.word,
      selectedAssociations: [],
      correctAssociations: currentWordData.associations,
      score: 0,
      mistakes: 0
    }));
  }, []);

  // Helper to shuffle an array
  function shuffleArray<T>(array: T[]): T[] {
    return array.slice().sort(() => Math.random() - 0.5);
  }

  // Game action handlers
  const handleMemoryCardClick = (cardId: number) => {
    if (!memoryState.isPlaying) return;

    setMemoryState(prev => {
      const card = prev.cards.find(c => c.id === cardId);
      if (!card || card.isMatched || card.isFlipped) return prev;

      const flippedCards = prev.cards.filter(c => c.isFlipped && !c.isMatched);
      const newCards = prev.cards.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
      );

      if (flippedCards.length === 1) {
        const firstCard = flippedCards[0];
        const secondCard = card;

        if (firstCard.match === secondCard.match) {
          return {
            ...prev,
            cards: newCards.map(c => 
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, isMatched: true }
                : c
            ),
            score: prev.score + 1
          };
        } else {
          setTimeout(() => {
            setMemoryState(current => ({
              ...current,
              cards: current.cards.map(c => 
                c.id === firstCard.id || c.id === secondCard.id
                  ? { ...c, isFlipped: false }
                  : c
              ),
              mistakes: current.mistakes + 1
            }));
          }, 1000);
        }
      }

      return { ...prev, cards: newCards };
    });
  };

  const handleMatchingPairClick = (pairId: string) => {
    if (!matchingState.isPlaying) return;
    
    setMatchingState(prev => {
      const selectedPairs = prev.pairs.filter(pair => !pair.isMatched);
      if (selectedPairs.length === 2) return prev;

      const newPairs = prev.pairs.map(pair => {
        if (pair.id === pairId && !pair.isMatched) {
          return { ...pair, isSelected: !pair.isSelected };
        }
        return pair;
      });

      const selected = newPairs.filter(pair => pair.isSelected && !pair.isMatched);
      if (selected.length === 2) {
        const [pair1, pair2] = selected;
        if (pair1.english === pair2.english || pair1.japanese === pair2.japanese) {
          setTimeout(() => {
            setMatchingState(pairs =>
              pairs.map(pair =>
                pair.id === pair1.id || pair.id === pair2.id
                  ? { ...pair, isMatched: true, isSelected: false }
                  : pair
              )
            );
            setMemoryState(prev => ({ ...prev, score: prev.score + 10 }));
          }, 500);
        } else {
          setTimeout(() => {
            setMatchingState(pairs =>
              pairs.map(pair => ({ ...pair, isSelected: false }))
            );
            setMemoryState(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
          }, 1000);
        }
      }

      return { ...prev, pairs: newPairs };
    });
  };

  const handleSentenceWordDrag = (wordId: number) => {
    if (!sentenceState.isPlaying) return;
    
    setSentenceState(prev => {
      const word = prev.choices.find(w => w.id === wordId);
      if (!word || word.isPlaced) return prev;

      return {
        ...prev,
        choices: prev.choices.map(w => w.id === wordId ? { ...w, isPlaced: true } : w),
        answer: [...prev.answer, { ...word, isPlaced: true }]
      };
    });
  };

  const handleQuizAnswer = (answer: string) => {
    if (!quizState.isPlaying) return;

    const currentQuestion = quizState.questions[quizState.currentQuestion];
    const isCorrect = answer === currentQuestion.correctAnswer;

    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true,
      isCorrect,
      showCorrect: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      mistakes: isCorrect ? prev.mistakes : prev.mistakes + 1
    }));

    setTimeout(() => {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        selectedAnswer: null,
        showFeedback: false,
        isCorrect: null,
        showCorrect: false
      }));
    }, 2000);
  };

  const handleNextQuizQuestion = () => {
    if (quizState.currentQuestion < quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        selectedAnswer: null,
        showFeedback: false,
        isCorrect: null,
        showCorrect: false
      }));
    } else {
      endGame();
    }
  };

  const handleAssociationSelect = (association: string) => {
    if (!associationState.isPlaying) return;

    setAssociationState(prev => {
      const newSelected = [...prev.selectedAssociations, association];
      const isCorrect = associationGameData[0].associations.includes(association);
      
      if (isCorrect) {
        setMemoryState(game => ({ ...game, score: game.score + 5 }));
      } else {
        setMemoryState(game => ({ ...game, mistakes: game.mistakes + 1 }));
      }

      return {
        ...prev,
        selectedAssociations: newSelected
      };
    });
  };

  // Game state management
  const startGame = useCallback(() => {
    console.log('Starting game:', selectedGame);
    setTimeLeft(60);

    switch (selectedGame) {
      case 'memory':
        setMemoryState(prev => ({ ...prev, isPlaying: true }));
        initializeMemoryGame();
        break;
      case 'matching':
        setMatchingState(prev => ({ ...prev, isPlaying: true }));
        initializeMatchingGame();
        break;
      case 'sentence':
        setSentenceState(prev => ({ ...prev, isPlaying: true }));
        initializeSentenceBuilder();
        break;
      case 'quiz':
        setQuizState(prev => ({ ...prev, isPlaying: true }));
        initializeQuizGame();
        break;
      case 'association':
        setAssociationState(prev => ({ ...prev, isPlaying: true }));
        initializeAssociationGame();
        break;
    }
  }, [selectedGame, initializeMemoryGame, initializeMatchingGame, initializeSentenceBuilder, initializeQuizGame, initializeAssociationGame]);

  const endGame = useCallback(() => {
    console.log('Ending game:', selectedGame);
    const getScore = () => {
      switch (selectedGame) {
        case 'memory': return memoryState.score;
        case 'matching': return matchingState.score;
        case 'sentence': return sentenceState.score;
        case 'quiz': return quizState.score;
        case 'association': return associationState.score;
        default: return 0;
      }
    };

    const score = getScore();
    if (score > 0) {
      const itemId = `${selectedGame}-${Date.now()}`;
      updateProgress('section8', itemId, true).catch((err: Error) => {
        console.error('Failed to update progress:', err);
      });
    }

    switch (selectedGame) {
      case 'memory':
        setMemoryState(prev => ({ ...prev, isPlaying: false }));
        break;
      case 'matching':
        setMatchingState(prev => ({ ...prev, isPlaying: false }));
        break;
      case 'sentence':
        setSentenceState(prev => ({ ...prev, isPlaying: false }));
        break;
      case 'quiz':
        setQuizState(prev => ({ ...prev, isPlaying: false }));
        break;
      case 'association':
        setAssociationState(prev => ({ ...prev, isPlaying: false }));
        break;
    }
  }, [selectedGame, memoryState.score, matchingState.score, sentenceState.score, quizState.score, associationState.score, updateProgress]);

  // Timer effect - only run for active game
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const isPlaying = (() => {
      switch (selectedGame) {
        case 'memory': return memoryState.isPlaying;
        case 'matching': return matchingState.isPlaying;
        case 'sentence': return sentenceState.isPlaying;
        case 'quiz': return quizState.isPlaying;
        case 'association': return associationState.isPlaying;
        default: return false;
      }
    })();

    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return prev;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedGame, memoryState.isPlaying, matchingState.isPlaying, sentenceState.isPlaying, quizState.isPlaying, associationState.isPlaying, timeLeft, endGame]);

  // Game completion checks
  useEffect(() => {
    const isPlaying = (() => {
      switch (selectedGame) {
        case 'memory': return memoryState.isPlaying;
        case 'matching': return matchingState.isPlaying;
        case 'sentence': return sentenceState.isPlaying;
        case 'quiz': return quizState.isPlaying;
        case 'association': return associationState.isPlaying;
        default: return false;
      }
    })();

    if (!isPlaying) return;

    switch (selectedGame) {
      case 'memory':
        if (memoryState.cards.every((card: MemoryCard) => card.isMatched)) {
          endGame();
        }
        break;
      case 'matching':
        if (matchingState.pairs.every((pair: MatchingPair) => pair.isMatched)) {
          endGame();
        }
        break;
      case 'sentence':
        if (sentenceState.choices.every((word: SentenceWord) => word.isPlaced)) {
          endGame();
        }
        break;
      case 'quiz':
        if (quizState.currentQuestion >= quizState.questions.length) {
          endGame();
        }
        break;
    }
  }, [selectedGame, memoryState, matchingState, sentenceState, quizState, associationState, endGame]);

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

  // Modify the render function to use game-specific states
  const renderGameContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (selectedGame) {
      case 'memory':
        return (
          <div className="space-y-4">
            <div className="flex gap-6 items-center">
              <span className="text-lg">Score: {memoryState.score}</span>
              <span className="text-lg">Mistakes: {memoryState.mistakes}</span>
              <span className="text-lg">Time: {timeLeft}s</span>
            </div>
            {memoryState.feedback && (
              <div className={memoryState.feedback === 'Correct!' ? 'text-green-600' : 'text-red-600'}>
                {memoryState.feedback}
              </div>
            )}
            {memoryState.isWin && (
              <div className="text-2xl text-green-700 font-bold animate-bounce">You won!</div>
            )}
            <div className="grid grid-cols-4 gap-4">
              {memoryState.cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleMemoryCardClick(card.id)}
                  className={`aspect-square rounded-lg transition-all duration-300 border-2
                    ${card.isMatched ? 'bg-green-100 border-green-500' :
                      card.isFlipped ? 'bg-blue-100 border-blue-500 scale-105' :
                      'bg-gray-100 border-gray-300 hover:bg-gray-200'}
                  `}
                  disabled={card.isMatched || !memoryState.isPlaying}
                >
                  <span className={`block text-2xl transition-opacity duration-300 ${card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'}`}>
                    {settings.showKanjiGames ? card.word : card.match}
                  </span>
                  {settings.showRomajiGames && (
                    <span className="block text-sm text-gray-600 mt-1">
                      {romajiMap[card.word] || 'Loading...'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'sentence':
        return (
          <div className="space-y-6">
            <div className="mb-2 text-lg font-semibold">Build this sentence:</div>
            <div className="mb-4 text-blue-700">{sentenceState.currentSentence.english}</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {sentenceState.choices.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSentenceWordDrag(word.id)}
                  className="px-4 py-2 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200"
                  disabled={sentenceState.feedback === 'Correct!'}
                >
                  {word.word}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
              {sentenceState.answer.map((word, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-lg bg-green-100 text-green-800 cursor-pointer"
                  onClick={() => handleSentenceWordDrag(word.id)}
                >
                  {word.word}
                </span>
              ))}
            </div>
            {sentenceState.feedback && (
              <div className={sentenceState.feedback === 'Correct!' ? 'text-green-600' : 'text-red-600'}>
                {sentenceState.feedback}
              </div>
            )}
            <div className="mt-4 flex gap-4 items-center">
              <button
                onClick={initializeSentenceBuilder}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                New Sentence
              </button>
              <span className="text-lg">Score: {sentenceState.score}</span>
            </div>
          </div>
        );

      case 'quiz':
        const currentQuestion = quizState.questions[quizState.currentQuestion];
        if (!currentQuestion) {
          return (
            <div className="text-center p-6">
              <p className="text-xl text-gray-600">No questions available.</p>
              <button
                onClick={initializeQuizGame}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Load Questions
              </button>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-xl font-medium mb-4">{currentQuestion.question}</p>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(option)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      quizState.selectedAnswer === option
                        ? index === currentQuestion.correctAnswer
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
              {quizState.showFeedback && (
                <div className="mt-4">
                  {quizState.isCorrect ? (
                    <div className="text-green-700 font-semibold">Correct!</div>
                  ) : (
                    <div className="text-red-700 font-semibold">
                      Incorrect! The correct answer is: <span className="underline">{currentQuestion.correctAnswer}</span>
                    </div>
                  )}
                  <button
                    onClick={handleNextQuizQuestion}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Next Question
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'association':
        const currentWordData = associationGameData[0];
        const allOptions = [...currentWordData.associations, ...currentWordData.distractors]
          .sort(() => Math.random() - 0.5);
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">{currentWordData.word}</h3>
              <p className="text-gray-600 mb-6">Select words that are commonly associated with this word</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {allOptions.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleAssociationSelect(word)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    associationState.selectedAssociations.includes(word)
                      ? currentWordData.associations.includes(word)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                  disabled={
                    !associationState.isPlaying ||
                    associationState.selectedAssociations.includes(word)
                  }
                >
                  {settings.showKanjiGames ? word : 'Word ' + (index + 1)}
                  {settings.showRomajiGames && (
                    <span className="block text-sm text-gray-600 mt-1">
                      {romajiMap[word] || 'Loading...'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getThemeClasses = () => {
    if (isDarkMode) {
      return {
        container: 'bg-gray-800',
        text: 'text-gray-100',
        card: 'bg-gray-700',
        border: 'border-gray-600',
        button: {
          primary: 'bg-blue-600 hover:bg-blue-700 text-white',
          secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-300',
        },
      };
    }

    switch (theme) {
      case 'blue':
        return {
          container: 'bg-blue-50',
          text: 'text-blue-900',
          card: 'bg-white',
          border: 'border-blue-200',
          button: {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'bg-white hover:bg-blue-50 text-blue-900',
          },
        };
      case 'green':
        return {
          container: 'bg-green-50',
          text: 'text-green-900',
          card: 'bg-white',
          border: 'border-green-200',
          button: {
            primary: 'bg-green-600 hover:bg-green-700 text-white',
            secondary: 'bg-white hover:bg-green-50 text-green-900',
          },
        };
      default:
        return {
          container: 'bg-white',
          text: 'text-gray-900',
          card: 'bg-gray-50',
          border: 'border-gray-200',
          button: {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'bg-gray-50 hover:bg-gray-100 text-gray-900',
          },
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Japanese Games</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setSelectedGame('sentence')}
          className={`p-4 rounded ${
            selectedGame === 'sentence' ? 'bg-primary text-white' : 'bg-gray-100'
          }`}
        >
          Sentence Builder
        </button>
        <button
          onClick={() => setSelectedGame('memory')}
          className={`p-4 rounded ${
            selectedGame === 'memory' ? 'bg-primary text-white' : 'bg-gray-100'
          }`}
        >
          Memory Game
        </button>
        <button
          onClick={() => setSelectedGame('quiz')}
          className={`p-4 rounded ${
            selectedGame === 'quiz' ? 'bg-primary text-white' : 'bg-gray-100'
          }`}
        >
          Quiz
        </button>
        <button
          onClick={() => setSelectedGame('association')}
          className={`p-4 rounded ${
            selectedGame === 'association' ? 'bg-primary text-white' : 'bg-gray-100'
          }`}
        >
          Word Association
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {(() => {
          const isPlaying = (() => {
            switch (selectedGame) {
              case 'memory': return memoryState.isPlaying;
              case 'matching': return matchingState.isPlaying;
              case 'sentence': return sentenceState.isPlaying;
              case 'quiz': return quizState.isPlaying;
              case 'association': return associationState.isPlaying;
              default: return false;
            }
          })();

          if (!isPlaying) {
            return (
              <div className="mb-4 flex justify-center">
                <button
                  onClick={startGame}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  Start {selectedGame.charAt(0).toUpperCase() + selectedGame.slice(1)} Game
                </button>
              </div>
            );
          }

          return (
            <>
              {(() => {
                console.log('Rendering game content for:', selectedGame);
                const content = renderGameContent();
                if (!content) {
                  return (
                    <div className="text-red-600">
                      Error: Unable to render game content. (Debug: {selectedGame})
                    </div>
                  );
                }
                return content;
              })()}
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex space-x-4">
                  <div className={`text-lg font-medium ${themeClasses.text}`}>
                    Time: {timeLeft}s
                  </div>
                  <div className={`text-lg font-medium ${themeClasses.text}`}>
                    Mistakes: {(() => {
                      switch (selectedGame) {
                        case 'memory': return memoryState.mistakes;
                        case 'matching': return matchingState.mistakes;
                        case 'sentence': return sentenceState.mistakes;
                        case 'quiz': return quizState.mistakes;
                        case 'association': return associationState.mistakes;
                        default: return 0;
                      }
                    })()}
                  </div>
                </div>
                <button
                  onClick={endGame}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                >
                  End Game
                </button>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default Section8;