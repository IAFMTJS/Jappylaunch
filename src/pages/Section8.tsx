import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useApp } from '../context/AppContext';
import type { Settings } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { kuroshiroInstance } from '../utils/kuroshiro';

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

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface QuizGameData extends Array<QuizQuestion> {}

interface AssociationWord {
  word: string;
  associations: string[];
  distractors: string[];
}

interface AssociationGameData extends Array<AssociationWord> {}

interface SentenceExample {
  english: string;
  japanese: string;
}

interface SentenceGameWord {
  id: number;
  word: string;
  type: 'pronoun' | 'particle' | 'noun' | 'verb' | 'copula' | 'adverb';
}

interface SentenceGameData extends Array<SentenceGameWord> {}

const Section8 = () => {
  const { theme, isDarkMode } = useTheme();
  const { updateProgress } = useProgress();
  const { settings } = useApp();
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
    showFeedback: false,
    isCorrect: null as boolean | null,
    showCorrect: false
  });
  const [associationState, setAssociationState] = useState({
    currentWord: '',
    selectedAssociations: [] as string[],
    correctAssociations: [] as string[]
  });
  const [romajiMap, setRomajiMap] = useState<Record<string, string>>({});
  const [memoryFeedback, setMemoryFeedback] = useState<string>('');
  const [memoryWin, setMemoryWin] = useState<boolean>(false);

  const sentenceExamples: SentenceExample[] = [
    { english: 'I am a student.', japanese: 'わたし は がくせい です' },
    { english: 'I go to school every day.', japanese: '毎日 学校 に 行きます' },
    { english: 'I study Japanese.', japanese: '日本語 を 勉強 します' },
    { english: 'I drink coffee in the morning.', japanese: '朝 コーヒー を のみます' },
    { english: 'Tomorrow I will eat sushi.', japanese: '明日 すし を たべます' },
  ];
  const [currentSentence, setCurrentSentence] = useState(sentenceExamples[0]);
  const [sentenceChoices, setSentenceChoices] = useState<string[]>([]);
  const [sentenceAnswer, setSentenceAnswer] = useState<string[]>([]);
  const [sentenceFeedback, setSentenceFeedback] = useState<string>('');
  const [sentenceScore, setSentenceScore] = useState<number>(0);

  const sentenceGameData: SentenceGameData = [
    { id: 1, word: 'わたし', type: 'pronoun' },
    { id: 2, word: 'は', type: 'particle' },
    { id: 3, word: 'がくせい', type: 'noun' },
    { id: 4, word: 'です', type: 'copula' },
    { id: 5, word: '毎日', type: 'adverb' },
    { id: 6, word: '学校', type: 'noun' },
    { id: 7, word: 'に', type: 'particle' },
    { id: 8, word: '行きます', type: 'verb' },
    { id: 9, word: '日本語', type: 'noun' },
    { id: 10, word: 'を', type: 'particle' },
    { id: 11, word: '勉強', type: 'noun' },
    { id: 12, word: 'します', type: 'verb' },
    { id: 13, word: '朝', type: 'noun' },
    { id: 14, word: 'コーヒー', type: 'noun' },
    { id: 15, word: 'のみます', type: 'verb' },
    { id: 16, word: '明日', type: 'noun' },
    { id: 17, word: 'すし', type: 'noun' },
    { id: 18, word: 'たべます', type: 'verb' }
  ];

  const games = [
    { id: 'matching', name: 'Word Matching', description: 'Match Japanese words with their English meanings' },
    { id: 'sentence', name: 'Sentence Building', description: 'Build correct Japanese sentences by arranging words' },
    { id: 'memory', name: 'Memory Game', description: 'Find matching pairs of Japanese characters and their readings' },
    { id: 'quiz', name: 'Quick Quiz', description: 'Test your knowledge with timed questions' },
    { id: 'association', name: 'Word Association', description: 'Find words that are commonly associated with each other' }
  ];

  // Game data
  const matchingGameData: WordPair[] = [
    { id: '1', japanese: '猫', english: 'cat', hiragana: 'ねこ' },
    { id: '2', japanese: '犬', english: 'dog', hiragana: 'いぬ' },
    { id: '3', japanese: '鳥', english: 'bird', hiragana: 'とり' },
    { id: '4', japanese: '魚', english: 'fish', hiragana: 'さかな' },
    { id: '5', japanese: '本', english: 'book', hiragana: 'ほん' },
    { id: '6', japanese: '水', english: 'water', hiragana: 'みず' },
    { id: '7', japanese: '山', english: 'mountain', hiragana: 'やま' },
    { id: '8', japanese: '川', english: 'river', hiragana: 'かわ' },
    { id: '9', japanese: '空', english: 'sky', hiragana: 'そら' },
    { id: '10', japanese: '海', english: 'sea', hiragana: 'うみ' },
    { id: '11', japanese: '花', english: 'flower', hiragana: 'はな' },
    { id: '12', japanese: '木', english: 'tree', hiragana: 'き' },
    { id: '13', japanese: 'あめ', english: 'rain', hiragana: 'あめ' },
    { id: '14', japanese: 'くも', english: 'cloud', hiragana: 'くも' },
    { id: '15', japanese: 'かみ', english: 'paper', hiragana: 'かみ' },
    { id: '16', japanese: 'みず', english: 'water', hiragana: 'みず' },
    { id: '17', japanese: 'テレビ', english: 'TV', hiragana: 'テレビ' },
    { id: '18', japanese: 'ラジオ', english: 'radio', hiragana: 'ラジオ' },
    { id: '19', japanese: 'パソコン', english: 'computer', hiragana: 'パソコン' },
    { id: '20', japanese: 'カメラ', english: 'camera', hiragana: 'カメラ' },
    { id: '21', japanese: 'ピアノ', english: 'piano', hiragana: 'ピアノ' },
    { id: '22', japanese: 'ギター', english: 'guitar', hiragana: 'ギター' },
    { id: '23', japanese: 'コーヒー', english: 'coffee', hiragana: 'コーヒー' },
    { id: '24', japanese: 'ジュース', english: 'juice', hiragana: 'ジュース' }
  ];

  const memoryGameData = [
    { id: 1, content: 'あ', match: 'a' },
    { id: 2, content: 'い', match: 'i' },
    { id: 3, content: 'う', match: 'u' },
    { id: 4, content: 'え', match: 'e' },
    { id: 5, content: 'お', match: 'o' },
    { id: 6, content: 'か', match: 'ka' },
    { id: 7, content: 'き', match: 'ki' },
    { id: 8, content: 'く', match: 'ku' },
    { id: 9, content: 'け', match: 'ke' },
    { id: 10, content: 'こ', match: 'ko' },
    { id: 11, content: 'さ', match: 'sa' },
    { id: 12, content: 'し', match: 'shi' },
    { id: 13, content: 'す', match: 'su' },
    { id: 14, content: 'せ', match: 'se' },
    { id: 15, content: 'そ', match: 'so' },
    { id: 16, content: 'た', match: 'ta' }
  ];

  const quizGameData: QuizGameData = [
    {
      question: 'What is the Japanese word for "cat"?',
      options: ['いぬ', 'ねこ', 'とり', 'さかな'],
      correct: 1
    },
    {
      question: 'What is the Japanese word for "dog"?',
      options: ['ねこ', 'いぬ', 'とり', 'さかな'],
      correct: 1
    },
    {
      question: 'What is the Japanese word for "bird"?',
      options: ['ねこ', 'いぬ', 'とり', 'さかな'],
      correct: 2
    },
    {
      question: 'What is the Japanese word for "fish"?',
      options: ['ねこ', 'いぬ', 'とり', 'さかな'],
      correct: 3
    }
  ];

  const associationGameData: AssociationGameData = [
    {
      word: '音楽',
      associations: ['歌', '楽器', 'コンサート', '演奏', 'リズム'],
      distractors: ['食べ物', 'スポーツ', '学校', '仕事']
    },
    {
      word: '学校',
      associations: ['勉強', '先生', '生徒', '教室', '授業'],
      distractors: ['音楽', 'スポーツ', '仕事', '遊び']
    },
    {
      word: '食べ物',
      associations: ['料理', 'レストラン', '食事', '味', '栄養'],
      distractors: ['音楽', 'スポーツ', '学校', '仕事']
    }
  ];

  // Game initialization functions
  const initializeSentenceBuilder = useCallback(() => {
    console.log('Initializing sentence builder...');
    try {
      const example = sentenceExamples[Math.floor(Math.random() * sentenceExamples.length)];
      setCurrentSentence(example);
      const words = example.japanese.split(' ');
      setSentenceChoices(words.sort(() => Math.random() - 0.5));
      setSentenceAnswer([]);
      setSentenceFeedback('');
      setSentenceScore(0);
      console.log('Sentence builder initialized successfully');
    } catch (error) {
      console.error('Error initializing sentence builder:', error);
      setSentenceFeedback('Error initializing game. Please try again.');
    }
  }, [sentenceExamples]);

  const initializeMemoryGame = useCallback(() => {
    console.log('Initializing memory game...');
    try {
      // Create pairs of cards
      const pairs = matchingGameData.map(item => [
        { 
          id: `${item.id}-japanese`, 
          content: item.japanese, 
          type: 'japanese', 
          isFlipped: false, 
          isMatched: false,
          match: item.hiragana
        },
        { 
          id: `${item.id}-hiragana`, 
          content: item.hiragana, 
          type: 'hiragana', 
          isFlipped: false, 
          isMatched: false,
          match: item.japanese
        }
      ]).flat();

      // Shuffle the cards
      const shuffled = pairs.sort(() => Math.random() - 0.5);
      setMemoryCards(shuffled);
      setMemoryFeedback('');
      setMemoryWin(false);
      console.log('Memory game initialized successfully with', shuffled.length, 'cards');
    } catch (error) {
      console.error('Error initializing memory game:', error);
      setMemoryFeedback('Error initializing game. Please try again.');
    }
  }, [matchingGameData]);

  const initializeMatchingGame = useCallback(() => {
    const pairs = matchingGameData.map(item => ({
      ...item,
      isMatched: false,
      isSelected: false
    }));
    setMatchingPairs(pairs);
  }, [matchingGameData]);

  const initializeSentenceGameData = useCallback(() => {
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
      showFeedback: false,
      isCorrect: null,
      showCorrect: false
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
  const handleMemoryCardClick = (cardId: string) => {
    if (!gameState.isPlaying) return;
    setMemoryFeedback('');
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
            setMemoryFeedback('Correct!');
          }, 500);
        } else {
          setTimeout(() => {
            setMemoryCards(cards =>
              cards.map(card => ({ ...card, isFlipped: false }))
            );
            setGameState(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
            setMemoryFeedback('Try again!');
          }, 1000);
        }
      }
      return newCards;
    });
  };

  const handleMatchingPairClick = (pairId: string) => {
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

    const isCorrect = answerIndex === quizGameData[quizState.currentQuestion].correct;
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      showFeedback: true,
      isCorrect,
      showCorrect: !isCorrect
    }));

    if (isCorrect) {
      setGameState(prev => ({ ...prev, score: prev.score + 10 }));
    } else {
      setGameState(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizState.currentQuestion < quizGameData.length - 1) {
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
  const startGame = useCallback(() => {
    console.log('Starting game:', selectedGame);
    // Reset game state first
    setGameState({
      isPlaying: true,
      score: 0,
      timeLeft: 60,
      level: 1,
      mistakes: 0
    });

    // Initialize the selected game
    switch (selectedGame) {
      case 'memory':
        initializeMemoryGame();
        break;
      case 'matching':
        initializeMatchingGame();
        break;
      case 'sentence':
        initializeSentenceBuilder();
        break;
      case 'quiz':
        initializeQuizGame();
        break;
      case 'association':
        initializeAssociationGame();
        break;
      default:
        console.error('Unknown game type:', selectedGame);
        setGameState(prev => ({ ...prev, isPlaying: false }));
        return;
    }
  }, [selectedGame, initializeMemoryGame, initializeMatchingGame, initializeSentenceBuilder, initializeQuizGame, initializeAssociationGame]);

  const endGame = useCallback(() => {
    console.log('Ending game:', selectedGame);
    // Update progress before ending
    if (gameState.score > 0) {
      const itemId = `${selectedGame}-${Date.now()}`;
      updateProgress('section8', itemId, true).catch((err: Error) => {
        console.error('Failed to update progress:', err);
      });
    }
    
    // Reset game state
    setGameState(prev => ({ ...prev, isPlaying: false }));
    
    // Reset game-specific states
    switch (selectedGame) {
      case 'memory':
        setMemoryCards([]);
        setMemoryFeedback('');
        setMemoryWin(false);
        break;
      case 'matching':
        setMatchingPairs([]);
        break;
      case 'sentence':
        setSentenceWords([]);
        setSentenceDropZone([]);
        setSentenceFeedback('');
        break;
      case 'quiz':
        setQuizState({
          currentQuestion: 0,
          selectedAnswer: null,
          showFeedback: false,
          isCorrect: null,
          showCorrect: false
        });
        break;
      case 'association':
        setAssociationState({
          currentWord: '',
          selectedAssociations: [],
          correctAssociations: []
        });
        break;
    }
  }, [selectedGame, gameState.score, updateProgress]);

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

  // Initialize games when component mounts
  useEffect(() => {
    console.log('Section8 component mounted, initializing games...');
    initializeSentenceBuilder();
    initializeMemoryGame();
    initializeMatchingGame();
  }, [initializeSentenceBuilder, initializeMemoryGame, initializeMatchingGame]);

  // Update romaji when settings change
  useEffect(() => {
    if (settings.showRomajiGames) {
      console.log('Updating romaji for games...');
      const updateRomaji = async () => {
        try {
          // Update romaji for sentence game
          const sentenceWords = sentenceExamples.flatMap(example => example.japanese.split(' '));
          for (const word of sentenceWords) {
            if (!romajiMap[word]) {
              await getRomaji(word);
            }
          }

          // Update romaji for memory game
          for (const item of matchingGameData) {
            if (!romajiMap[item.japanese]) {
              await getRomaji(item.japanese);
            }
            if (!romajiMap[item.hiragana]) {
              await getRomaji(item.hiragana);
            }
          }

          console.log('Romaji update complete');
        } catch (error) {
          console.error('Error updating romaji:', error);
        }
      };
      updateRomaji();
    }
  }, [settings.showRomajiGames]);

  // Functie om een nieuwe zin te starten
  const startNewSentence = () => {
    const example = sentenceExamples[Math.floor(Math.random() * sentenceExamples.length)];
    setCurrentSentence(example);
    const words = example.japanese.split(' ');
    setSentenceChoices(words.sort(() => Math.random() - 0.5));
    setSentenceAnswer([]);
    setSentenceFeedback('');
  };

  // Start een nieuwe zin bij het starten van het spel
  useEffect(() => {
    if (selectedGame === 'sentence' && gameState.isPlaying) {
      startNewSentence();
    }
  }, [selectedGame, gameState.isPlaying]);

  // Handler voor het kiezen van een woord
  const handleSentenceChoice = (word: string, idx: number) => {
    setSentenceAnswer(ans => [...ans, word]);
    setSentenceChoices(choices => choices.filter((w, i) => i !== idx));
  };

  // Handler voor het verwijderen van een woord uit het antwoord
  const handleRemoveAnswerWord = (idx: number) => {
    setSentenceChoices(choices => [...choices, sentenceAnswer[idx]]);
    setSentenceAnswer(ans => ans.filter((w, i) => i !== idx));
  };

  // Controleer of het antwoord klopt
  useEffect(() => {
    if (sentenceAnswer.length === currentSentence.japanese.split(' ').length) {
      if (sentenceAnswer.join(' ') === currentSentence.japanese) {
        setSentenceFeedback('Correct!');
        setSentenceScore(score => score + 1);
      } else {
        setSentenceFeedback('Incorrect, try again!');
      }
    } else {
      setSentenceFeedback('');
    }
  }, [sentenceAnswer, currentSentence]);

  // Winmelding effect:
  useEffect(() => {
    if (gameState.isPlaying && memoryCards.length > 0 && memoryCards.every(card => card.isMatched)) {
      setMemoryWin(true);
      setTimeout(() => setMemoryWin(false), 2000);
    }
  }, [memoryCards, gameState.isPlaying]);

  const renderGameContent = () => {
    if (!gameState.isPlaying) {
      return (
        <div className="text-center">
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Game
          </button>
        </div>
      );
    }

    switch (selectedGame) {
      case 'memory':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {memoryCards.map((card, index) => (
              <button
                key={index}
                onClick={() => handleMemoryCardClick(card.id)}
                className={`p-4 rounded-lg border ${
                  card.isMatched ? 'bg-green-100' : card.isFlipped ? 'bg-blue-100' : 'bg-white'
                } ${settings?.showRomajiGames ? 'text-lg' : 'text-xl'}`}
                disabled={card.isMatched || memoryFeedback !== ''}
              >
                {card.isFlipped || card.isMatched ? card.content : '?'}
                {settings?.showRomajiGames && (card.isFlipped || card.isMatched) && card.match && (
                  <span className="block text-sm text-gray-600 mt-1">
                    {card.match}
                  </span>
                )}
              </button>
            ))}
          </div>
        );
      case 'matching':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {matchingPairs.map((pair, index) => (
              <button
                key={index}
                onClick={() => handleMatchingPairClick(pair.id)}
                className={`p-4 rounded-lg border ${
                  pair.isMatched ? 'bg-green-100' : pair.isSelected ? 'bg-blue-100' : 'bg-white'
                } ${settings?.showRomajiGames ? 'text-lg' : 'text-xl'}`}
                disabled={pair.isMatched}
              >
                {pair.isSelected ? (settings?.showKanjiGames ? pair.japanese : pair.hiragana) : '?'}
                {settings?.showRomajiGames && pair.isSelected && (
                  <span className="block text-sm text-gray-600 mt-1">
                    {romajiMap[settings.showKanjiGames ? pair.japanese : pair.hiragana] || 'Loading...'}
                  </span>
                )}
              </button>
            ))}
          </div>
        );
      case 'sentence':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {sentenceWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleSentenceWordDrag(word.id)}
                  className={`px-4 py-2 rounded-lg border ${
                    word.isPlaced ? 'bg-gray-100' : 'bg-white'
                  } ${settings?.showRomajiGames ? 'text-lg' : 'text-xl'}`}
                  disabled={word.isPlaced}
                >
                  {word.word}
                </button>
              ))}
            </div>
            <div className="min-h-[100px] p-4 border rounded-lg bg-gray-50">
              {sentenceDropZone.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleSentenceWordDrag(word.id)}
                  className={`px-4 py-2 rounded-lg border mr-2 mb-2 ${
                    settings?.showRomajiGames ? 'text-lg' : 'text-xl'
                  }`}
                >
                  {word.word}
                </button>
              ))}
            </div>
          </div>
        );
      case 'quiz':
        return (
          <div className="space-y-4">
            <div className="text-xl font-medium">
              {quizState.currentQuestion < quizGameData.length
                ? quizGameData[quizState.currentQuestion].question
                : 'Quiz Complete!'}
            </div>
            {quizState.currentQuestion < quizGameData.length && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizGameData[quizState.currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswerSelect(index)}
                    className={`p-4 rounded-lg border ${
                      quizState.selectedAnswer === index
                        ? quizState.isCorrect
                          ? 'bg-green-100'
                          : 'bg-red-100'
                        : 'bg-white'
                    } ${settings?.showRomajiGames ? 'text-lg' : 'text-xl'}`}
                    disabled={quizState.showFeedback}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      case 'association':
        return (
          <div className="space-y-4">
            <div className="text-xl font-medium">
              {associationState.currentWord || 'Game Complete!'}
            </div>
            {associationState.currentWord && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {associationState.correctAssociations.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleAssociationSelect(word)}
                    className={`p-4 rounded-lg border ${
                      associationState.selectedAssociations.includes(word)
                        ? 'bg-green-100'
                        : 'bg-white'
                    } ${settings?.showRomajiGames ? 'text-lg' : 'text-xl'}`}
                    disabled={associationState.selectedAssociations.includes(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
            )}
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
        {!gameState.isPlaying ? (
          // Show start button when not playing
          <div className="mb-4 flex justify-center">
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Start {selectedGame.charAt(0).toUpperCase() + selectedGame.slice(1)} Game
            </button>
          </div>
        ) : (
          // Show game content only when playing
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
                  Time: {gameState.timeLeft}s
                </div>
                <div className={`text-lg font-medium ${themeClasses.text}`}>
                  Mistakes: {gameState.mistakes}
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
        )}
      </div>
    </div>
  );
};

export default Section8;