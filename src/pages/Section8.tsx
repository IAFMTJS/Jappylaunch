import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

interface GameState {
  isPlaying: boolean;
  score: number;
  timeLeft: number;
  level: number;
  mistakes: number;
}

interface Card {
  id: number;
  content: string;
  match: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface WordPair {
  id: number;
  japanese: string;
  english: string;
  isMatched: boolean;
  isSelected: boolean;
}

interface SentenceWord {
  id: number;
  word: string;
  type: string;
  isPlaced: boolean;
}

const Section8 = () => {
  const { theme, isDarkMode } = useTheme();
  const { updateProgress } = useApp();
  const [selectedGame, setSelectedGame] = useState<string>('matching');
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    timeLeft: 60,
    level: 1,
    mistakes: 0
  });
  const [memoryCards, setMemoryCards] = useState<Card[]>([]);
  const [matchingPairs, setMatchingPairs] = useState<WordPair[]>([]);
  const [sentenceWords, setSentenceWords] = useState<SentenceWord[]>([]);
  const [sentenceDropZone, setSentenceDropZone] = useState<SentenceWord[]>([]);
  const [quizState, setQuizState] = useState({
    currentQuestion: 0,
    selectedAnswer: null as number | null,
    showFeedback: false
  });
  const [associationState, setAssociationState] = useState({
    currentWord: '',
    selectedAssociations: [] as string[],
    correctAssociations: [] as string[]
  });

  const games = [
    { id: 'matching', name: 'Word Matching', description: 'Match Japanese words with their English meanings' },
    { id: 'sentence', name: 'Sentence Building', description: 'Build correct Japanese sentences by arranging words' },
    { id: 'memory', name: 'Memory Game', description: 'Find matching pairs of Japanese characters and their readings' },
    { id: 'quiz', name: 'Quick Quiz', description: 'Test your knowledge with timed questions' },
    { id: 'association', name: 'Word Association', description: 'Find words that are commonly associated with each other' }
  ];

  // Game data
  const matchingGameData = [
    { id: 1, japanese: '猫', english: 'cat' },
    { id: 2, japanese: '犬', english: 'dog' },
    { id: 3, japanese: '鳥', english: 'bird' },
    { id: 4, japanese: '魚', english: 'fish' },
    { id: 5, japanese: '本', english: 'book' },
    { id: 6, japanese: '水', english: 'water' }
  ];

  const sentenceGameData = [
    { id: 1, word: 'わたし', type: 'pronoun' },
    { id: 2, word: 'は', type: 'particle' },
    { id: 3, word: 'がくせい', type: 'noun' },
    { id: 4, word: 'です', type: 'copula' },
    { id: 5, word: '毎日', type: 'adverb' },
    { id: 6, word: '学校', type: 'noun' },
    { id: 7, word: 'に', type: 'particle' },
    { id: 8, word: '行きます', type: 'verb' }
  ];

  const memoryGameData = [
    { id: 1, content: 'あ', match: 'a' },
    { id: 2, content: 'い', match: 'i' },
    { id: 3, content: 'う', match: 'u' },
    { id: 4, content: 'え', match: 'e' },
    { id: 5, content: 'お', match: 'o' },
    { id: 6, content: 'か', match: 'ka' },
    { id: 7, content: 'き', match: 'ki' },
    { id: 8, content: 'く', match: 'ku' }
  ];

  const quizGameData = [
    {
      question: 'What is the Japanese word for "book"?',
      options: ['ほん', 'えんぴつ', 'つくえ', 'いす'],
      correct: 0
    },
    {
      question: 'How do you say "good morning" in Japanese?',
      options: ['こんにちは', 'おはようございます', 'こんばんは', 'さようなら'],
      correct: 1
    },
    {
      question: 'What does "水" mean?',
      options: ['Fire', 'Water', 'Earth', 'Air'],
      correct: 1
    }
  ];

  const associationGameData = [
    {
      word: '食べる',
      associations: ['ごはん', 'レストラン', 'お箸', 'おいしい', '料理'],
      distractors: ['学校', '本', '電車']
    },
    {
      word: '学校',
      associations: ['勉強', '先生', '学生', '教室', '授業'],
      distractors: ['食べる', '旅行', '音楽']
    }
  ];

  // Game initialization functions
  const initializeMemoryGame = useCallback(() => {
    const cards = [...memoryGameData, ...memoryGameData]
      .map((card, index) => ({
        ...card,
        id: index,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);
    setMemoryCards(cards);
  }, []);

  const initializeMatchingGame = useCallback(() => {
    const pairs = matchingGameData
      .map(pair => ({ ...pair, isMatched: false, isSelected: false }))
      .sort(() => Math.random() - 0.5);
    setMatchingPairs(pairs);
  }, []);

  const initializeSentenceGame = useCallback(() => {
    const words = sentenceGameData
      .map(word => ({ ...word, isPlaced: false }))
      .sort(() => Math.random() - 0.5);
    setSentenceWords(words);
    setSentenceDropZone([]);
  }, []);

  const initializeQuizGame = useCallback(() => {
    setQuizState({
      currentQuestion: 0,
      selectedAnswer: null,
      showFeedback: false
    });
  }, []);

  const initializeAssociationGame = useCallback(() => {
    const currentWordData = associationGameData[0];
    setAssociationState({
      currentWord: currentWordData.word,
      selectedAssociations: [],
      correctAssociations: currentWordData.associations
    });
  }, []);

  // Game action handlers
  const handleMemoryCardClick = (cardId: number) => {
    if (!gameState.isPlaying) return;
    
    setMemoryCards(prev => {
      const flippedCards = prev.filter(card => card.isFlipped && !card.isMatched);
      if (flippedCards.length === 2) return prev;
      
      const newCards = prev.map(card => {
        if (card.id === cardId && !card.isFlipped && !card.isMatched) {
          return { ...card, isFlipped: true };
        }
        return card;
      });

      const newlyFlipped = newCards.filter(card => card.isFlipped && !card.isMatched);
      if (newlyFlipped.length === 2) {
        const [card1, card2] = newlyFlipped;
        if (card1.match === card2.match) {
          setTimeout(() => {
            setMemoryCards(cards => 
              cards.map(card => 
                card.id === card1.id || card.id === card2.id
                  ? { ...card, isMatched: true }
                  : card
              )
            );
            setGameState(prev => ({ ...prev, score: prev.score + 10 }));
          }, 500);
        } else {
          setTimeout(() => {
            setMemoryCards(cards =>
              cards.map(card => ({ ...card, isFlipped: false }))
            );
            setGameState(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
          }, 1000);
        }
      }

      return newCards;
    });
  };

  const handleMatchingPairClick = (pairId: number) => {
    if (!gameState.isPlaying) return;
    
    setMatchingPairs(prev => {
      const selectedPairs = prev.filter(pair => !pair.isMatched);
      if (selectedPairs.length === 2) return prev;

      const newPairs = prev.map(pair => {
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
            setMatchingPairs(pairs =>
              pairs.map(pair =>
                pair.id === pair1.id || pair.id === pair2.id
                  ? { ...pair, isMatched: true, isSelected: false }
                  : pair
              )
            );
            setGameState(prev => ({ ...prev, score: prev.score + 10 }));
          }, 500);
        } else {
          setTimeout(() => {
            setMatchingPairs(pairs =>
              pairs.map(pair => ({ ...pair, isSelected: false }))
            );
            setGameState(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
          }, 1000);
        }
      }

      return newPairs;
    });
  };

  const handleSentenceWordDrag = (wordId: number) => {
    if (!gameState.isPlaying) return;
    
    setSentenceWords(prev => {
      const word = prev.find(w => w.id === wordId);
      if (!word || word.isPlaced) return prev;

      setSentenceDropZone(zone => [...zone, { ...word, isPlaced: true }]);
      return prev.map(w => w.id === wordId ? { ...w, isPlaced: true } : w);
    });
  };

  const handleQuizAnswerSelect = (answerIndex: number) => {
    if (!gameState.isPlaying || quizState.showFeedback) return;

    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      showFeedback: true
    }));

    const isCorrect = answerIndex === quizGameData[quizState.currentQuestion].correct;
    if (isCorrect) {
      setGameState(prev => ({ ...prev, score: prev.score + 10 }));
    } else {
      setGameState(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
    }

    setTimeout(() => {
      if (quizState.currentQuestion < quizGameData.length - 1) {
        setQuizState(prev => ({
          currentQuestion: prev.currentQuestion + 1,
          selectedAnswer: null,
          showFeedback: false
        }));
      } else {
        endGame();
      }
    }, 1500);
  };

  const handleAssociationSelect = (association: string) => {
    if (!gameState.isPlaying) return;

    setAssociationState(prev => {
      const newSelected = [...prev.selectedAssociations, association];
      const isCorrect = associationGameData[0].associations.includes(association);
      
      if (isCorrect) {
        setGameState(game => ({ ...game, score: game.score + 5 }));
      } else {
        setGameState(game => ({ ...game, mistakes: game.mistakes + 1 }));
      }

      return {
        ...prev,
        selectedAssociations: newSelected
      };
    });
  };

  // Game state management
  const startGame = () => {
    setGameState({
      isPlaying: true,
      score: 0,
      timeLeft: 60,
      level: 1,
      mistakes: 0
    });

    switch (selectedGame) {
      case 'memory':
        initializeMemoryGame();
        break;
      case 'matching':
        initializeMatchingGame();
        break;
      case 'sentence':
        initializeSentenceGame();
        break;
      case 'quiz':
        initializeQuizGame();
        break;
      case 'association':
        initializeAssociationGame();
        break;
    }
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
    
    // Update progress
    updateProgress('section8', gameState.score, 100, {
      score: gameState.score,
      category: selectedGame,
      difficulty: 'medium',
      quizType: 'game',
      timeTaken: 60 - gameState.timeLeft,
      date: new Date().toISOString(),
      totalQuestions: 10,
      correctAnswers: Math.floor(gameState.score / 10)
    });
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            endGame();
            return prev;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.timeLeft]);

  // Game completion checks
  useEffect(() => {
    if (!gameState.isPlaying) return;

    switch (selectedGame) {
      case 'memory':
        if (memoryCards.every(card => card.isMatched)) {
          endGame();
        }
        break;
      case 'matching':
        if (matchingPairs.every(pair => pair.isMatched)) {
          endGame();
        }
        break;
      case 'sentence':
        if (sentenceWords.every(word => word.isPlaced)) {
          endGame();
        }
        break;
    }
  }, [memoryCards, matchingPairs, sentenceWords, gameState.isPlaying, selectedGame]);

  const renderGameContent = () => {
    switch (selectedGame) {
      case 'matching':
        return (
          <div className="grid grid-cols-2 gap-4">
            {matchingPairs.map((pair) => (
              <button
                key={pair.id}
                onClick={() => handleMatchingPairClick(pair.id)}
                className={`p-4 rounded-lg border transition-all ${
                  pair.isMatched
                    ? 'bg-green-100 border-green-500'
                    : pair.isSelected
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
                disabled={pair.isMatched || !gameState.isPlaying}
              >
                <span className="text-lg">{pair.japanese}</span>
              </button>
            ))}
          </div>
        );

      case 'sentence':
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {sentenceWords.map((word) => (
                <button
                  key={word.id}
                  onClick={() => !word.isPlaced && handleSentenceWordDrag(word.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    word.isPlaced
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-move'
                  }`}
                  disabled={word.isPlaced || !gameState.isPlaying}
                >
                  {word.word}
                </button>
              ))}
            </div>
            <div className="min-h-[100px] border-2 border-dashed border-gray-300 rounded-lg p-4">
              {sentenceDropZone.map((word, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-lg mr-2 mb-2"
                >
                  {word.word}
                </span>
              ))}
            </div>
          </div>
        );

      case 'memory':
        return (
          <div className="grid grid-cols-4 gap-4">
            {memoryCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleMemoryCardClick(card.id)}
                className={`aspect-square rounded-lg transition-all ${
                  card.isMatched
                    ? 'bg-green-100 border-green-500'
                    : card.isFlipped
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                }`}
                disabled={card.isMatched || !gameState.isPlaying}
              >
                {card.isFlipped || card.isMatched ? card.content : '?'}
              </button>
            ))}
          </div>
        );

      case 'quiz':
        const currentQuestion = quizGameData[quizState.currentQuestion];
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-xl font-medium mb-4">{currentQuestion.question}</p>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      quizState.selectedAnswer === index
                        ? index === currentQuestion.correct
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    disabled={!gameState.isPlaying || quizState.showFeedback}
                  >
                    {option}
                  </button>
                ))}
              </div>
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
                    !gameState.isPlaying ||
                    associationState.selectedAssociations.includes(word)
                  }
                >
                  {word}
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
    <div className="py-8">
      <div className="flex items-center mb-8">
        <Link to="/" className="text-blue-600 hover:text-blue-800 mr-4">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Interactive Games</h1>
      </div>
      
      <div className={`${themeClasses.container} rounded-lg shadow-md p-6`}>
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 mb-6">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedGame === game.id
                    ? themeClasses.button.primary
                    : themeClasses.button.secondary
                }`}
              >
                {game.name}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h2 className={`text-xl font-semibold ${themeClasses.text}`}>
                {games.find(g => g.id === selectedGame)?.name}
              </h2>
              <p className={`text-sm ${themeClasses.text} opacity-75`}>
                {games.find(g => g.id === selectedGame)?.description}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {gameState.isPlaying && (
                <>
                  <div className={`text-lg font-medium ${themeClasses.text}`}>
                    Score: {gameState.score}
                  </div>
                  <div className={`text-lg font-medium ${themeClasses.text}`}>
                    Time: {gameState.timeLeft}s
                  </div>
                  <div className={`text-lg font-medium ${themeClasses.text}`}>
                    Mistakes: {gameState.mistakes}
                  </div>
                </>
              )}
              <button
                onClick={gameState.isPlaying ? endGame : startGame}
                className={`px-4 py-2 rounded-lg ${
                  gameState.isPlaying
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : themeClasses.button.primary
                }`}
              >
                {gameState.isPlaying ? 'End Game' : 'Start Game'}
              </button>
            </div>
          </div>
        </div>

        <div className={`mt-6 ${themeClasses.card} rounded-lg p-6`}>
          {renderGameContent()}
        </div>
      </div>
    </div>
  );
};

export default Section8; 