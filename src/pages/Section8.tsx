import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
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

const Section8 = () => {
  const { theme, isDarkMode } = useTheme();
  const { updateProgress, settings } = useApp();
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

  const sentenceExamples = [
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
    },
    {
      question: 'What is the Japanese word for "mountain"?',
      options: ['やま', 'かわ', 'うみ', 'そら'],
      correct: 0
    },
    {
      question: 'How do you say "thank you" in Japanese?',
      options: ['ありがとう', 'すみません', 'おめでとう', 'さようなら'],
      correct: 0
    },
    {
      question: 'What does "学校" mean?',
      options: ['School', 'Hospital', 'Library', 'Park'],
      correct: 0
    },
    {
      question: 'What is the Japanese word for "flower"?',
      options: ['はな', 'き', 'くさ', 'みどり'],
      correct: 0
    },
    {
      question: 'How do you say "I am a student" in Japanese?',
      options: ['わたしはがくせいです', 'わたしはせんせいです', 'わたしはいしゃです', 'わたしはエンジニアです'],
      correct: 0
    },
    {
      question: 'What does "毎日" mean?',
      options: ['Every day', 'Sometimes', 'Never', 'Once'],
      correct: 0
    },
    {
      question: 'What is the Japanese word for "tree"?',
      options: ['き', 'はな', 'くさ', 'みどり'],
      correct: 0
    },
    {
      question: 'What is the Japanese word for "rain"?',
      options: ['あめ', 'くも', 'かぜ', 'ゆき'],
      correct: 0
    },
    {
      question: 'How do you say "computer" in Japanese?',
      options: ['パソコン', 'テレビ', 'ラジオ', 'カメラ'],
      correct: 0
    },
    {
      question: 'What is the Japanese word for "piano"?',
      options: ['ピアノ', 'ギター', 'バイオリン', 'ドラム'],
      correct: 0
    },
    {
      question: 'How do you say "coffee" in Japanese?',
      options: ['コーヒー', 'ジュース', 'おちゃ', 'みず'],
      correct: 0
    },
    {
      question: 'What is the Japanese word for "morning"?',
      options: ['あさ', 'よる', 'ひる', 'ゆうがた'],
      correct: 0
    },
    {
      question: 'How do you say "to eat" in Japanese?',
      options: ['たべる', 'のむ', 'みる', 'きく'],
      correct: 0
    },
    {
      question: 'What is the Japanese word for "camera"?',
      options: ['カメラ', 'テレビ', 'ラジオ', 'パソコン'],
      correct: 0
    },
    {
      question: 'How do you say "juice" in Japanese?',
      options: ['ジュース', 'コーヒー', 'おちゃ', 'みず'],
      correct: 0
    }
  ];

  const associationGameData = [
    {
      word: '食べる',
      associations: ['ごはん', 'レストラン', 'お箸', 'おいしい', '料理'],
      distractors: ['学校', '本', '電車', '音楽']
    },
    {
      word: '学校',
      associations: ['勉強', '先生', '学生', '教室', '授業'],
      distractors: ['食べる', '旅行', '音楽', 'スポーツ']
    },
    {
      word: '旅行',
      associations: ['飛行機', 'ホテル', '観光', 'カメラ', '地図'],
      distractors: ['学校', '仕事', '勉強', '料理']
    },
    {
      word: '音楽',
      associations: ['ピアノ', 'ギター', '歌', 'コンサート', 'CD'],
      distractors: ['料理', '勉強', '運動', '仕事']
    },
    {
      word: 'スポーツ',
      associations: ['サッカー', '野球', 'テニス', '運動', '試合'],
      distractors: ['勉強', '料理', '音楽', '旅行']
    },
    {
      word: 'テレビ',
      associations: ['ニュース', 'ドラマ', 'アニメ', 'チャンネル', 'リモコン'],
      distractors: ['ラジオ', 'パソコン', 'カメラ', 'ピアノ']
    },
    {
      word: 'コーヒー',
      associations: ['カフェ', 'ミルク', '砂糖', 'カップ', 'ドーナツ'],
      distractors: ['ジュース', 'おちゃ', 'みず', 'ビール']
    },
    {
      word: 'たべる',
      associations: ['ごはん', 'レストラン', 'お箸', 'おいしい', '料理'],
      distractors: ['のむ', 'みる', 'きく', 'あるく']
    },
    {
      word: 'あさ',
      associations: ['おはよう', '朝ごはん', '新聞', 'テレビ', 'コーヒー'],
      distractors: ['よる', 'ひる', 'ゆうがた', 'ばん']
    },
    {
      word: 'ピアノ',
      associations: ['音楽', 'コンサート', '練習', '曲', '先生'],
      distractors: ['ギター', 'バイオリン', 'ドラム', 'フルート']
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
        initializeSentenceBuilder();
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
                <span className="text-lg">
                  {settings.showKanjiGames ? pair.japanese : pair.hiragana}
                </span>
                {settings.showRomajiGames && (
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
          <div className="space-y-6">
            <div className="mb-2 text-lg font-semibold">Build this sentence:</div>
            <div className="mb-4 text-blue-700">{currentSentence.english}</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {sentenceChoices.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSentenceChoice(word, idx)}
                  className="px-4 py-2 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200"
                  disabled={sentenceFeedback === 'Correct!'}
                >
                  {word}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
              {sentenceAnswer.map((word, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-lg bg-green-100 text-green-800 cursor-pointer"
                  onClick={() => handleRemoveAnswerWord(idx)}
                >
                  {word}
                </span>
              ))}
            </div>
            {sentenceFeedback && (
              <div className={sentenceFeedback === 'Correct!' ? 'text-green-600' : 'text-red-600'}>
                {sentenceFeedback}
              </div>
            )}
            <div className="mt-4 flex gap-4 items-center">
              <button
                onClick={startNewSentence}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                New Sentence
              </button>
              <span className="text-lg">Score: {sentenceScore}</span>
            </div>
          </div>
        );

      case 'memory':
        return (
          <div className="space-y-4">
            <div className="flex gap-6 items-center">
              <span className="text-lg">Score: {gameState.score}</span>
              <span className="text-lg">Mistakes: {gameState.mistakes}</span>
            </div>
            {memoryFeedback && (
              <div className={memoryFeedback === 'Correct!' ? 'text-green-600' : 'text-red-600'}>
                {memoryFeedback}
              </div>
            )}
            {memoryWin && (
              <div className="text-2xl text-green-700 font-bold animate-bounce">You won!</div>
            )}
            <div className="grid grid-cols-4 gap-4">
              {memoryCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleMemoryCardClick(card.id)}
                  className={`aspect-square rounded-lg transition-all duration-300 border-2
                    ${card.isMatched ? 'bg-green-100 border-green-500' :
                      card.isFlipped ? 'bg-blue-100 border-blue-500 scale-105' :
                      'bg-gray-100 border-gray-300 hover:bg-gray-200'}
                  `}
                  disabled={card.isMatched || !gameState.isPlaying}
                >
                  <span className={`block text-2xl transition-opacity duration-300 ${card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'}`}>
                    {settings.showKanjiGames ? card.content : card.match}
                  </span>
                  {settings.showRomajiGames && (
                    <span className="block text-sm text-gray-600 mt-1">
                      {romajiMap[card.content] || 'Loading...'}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                initializeMemoryGame();
                setGameState(prev => ({ ...prev, score: 0, mistakes: 0 }));
                setMemoryFeedback('');
                setMemoryWin(false);
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              New Game
            </button>
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
                      Incorrect! The correct answer is: <span className="underline">{currentQuestion.options[currentQuestion.correct]}</span>
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
                    !gameState.isPlaying ||
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
        {/* Render Start buttons for each game when not playing */}
        {selectedGame === 'sentence' && !gameState.isPlaying && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={() => {
                initializeSentenceBuilder();
                setGameState(prev => ({ ...prev, isPlaying: true }));
              }}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Start Sentence Builder
            </button>
          </div>
        )}
        {selectedGame === 'memory' && !gameState.isPlaying && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={() => {
                initializeMemoryGame();
                setGameState(prev => ({ ...prev, isPlaying: true }));
              }}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Start Memory Game
            </button>
          </div>
        )}
        {selectedGame === 'quiz' && !gameState.isPlaying && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={() => {
                initializeQuizGame();
                setGameState(prev => ({ ...prev, isPlaying: true }));
              }}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Start Quiz
            </button>
          </div>
        )}
        {selectedGame === 'association' && !gameState.isPlaying && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={() => {
                initializeAssociationGame();
                setGameState(prev => ({ ...prev, isPlaying: true }));
              }}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Start Word Association
            </button>
          </div>
        )}
        {/* Always render game content for any selected game */}
        {['sentence', 'memory', 'quiz', 'association'].includes(selectedGame) && renderGameContent()}
      </div>

      {gameState.isPlaying && (
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
      )}
    </div>
  );
};

export default Section8;