import React, { useState, useEffect, useMemo, useCallback, Suspense, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import AnimePhraseCard from '../components/AnimePhraseCard';
import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

// Types
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type Category = 'greeting' | 'emotion' | 'action' | 'question' | 'response';
type SoundType = 'correct' | 'incorrect' | 'complete' | 'click';

interface AnimePhrase {
  id: string;
  japanese: string;
  romaji: string;
  english: string;
  context: string;
  example: string;
  difficulty: Difficulty;
  category: Category;
  animeImage?: string;
  characterName?: string;
  animeTitle?: string;
}

interface AnimePhraseCardProps {
  id: string;
  japanese: string;
  romaji: string;
  english: string;
  context: string;
  example: string;
  difficulty: Difficulty;
  category: Category;
  animeImage?: string;
  characterName?: string;
  animeTitle?: string;
  showRomaji: boolean;
  showEnglish: boolean;
  onMarkAsLearned?: () => Promise<void>;
  isLearned: boolean;
  onPlaySound?: () => void;
  isDarkMode: boolean;
}

interface AnimeSectionState {
  currentPhraseIndex: number;
  showRomaji: boolean;
  showEnglish: boolean;
  selectedCategory: Category | 'all';
  score: number;
  error: string | null;
  romajiMap: Record<string, string>;
  isInitialized: boolean;
}

// Constants
const INITIAL_STATE: AnimeSectionState = {
  currentPhraseIndex: 0,
  showRomaji: true,
  showEnglish: false,
  selectedCategory: 'all',
  score: 0,
  error: null,
  romajiMap: {},
  isInitialized: false
};

// Utility functions
const generateId = (phrase: Omit<AnimePhrase, 'id'>): string => {
  return `${phrase.japanese}-${phrase.category}-${phrase.difficulty}`;
};

// Add IDs to phrases with proper typing
const beginnerPhrases: AnimePhrase[] = [
  {
    japanese: 'おはようございます',
    romaji: 'ohayou gozaimasu',
    english: 'Good morning',
    context: 'A polite way to say good morning, commonly used in anime when characters meet in the morning.',
    example: 'おはようございます、先生！(Good morning, teacher!) - Used by Tanjiro in Demon Slayer when greeting his teacher.',
    difficulty: 'beginner',
    category: 'greeting',
    animeImage: 'https://i.imgur.com/8YtG5Yx.png',
    characterName: 'Tanjiro Kamado',
    animeTitle: 'Demon Slayer'
  },
  {
    japanese: 'ありがとう',
    romaji: 'arigatou',
    english: 'Thank you',
    context: 'A common expression of gratitude, often used in anime when characters help each other.',
    example: 'ありがとう、ナルト！(Thank you, Naruto!) - Said by Sasuke when Naruto helps him in battle.',
    difficulty: 'beginner',
    category: 'response',
    animeImage: 'https://i.imgur.com/2XtG5Yx.png',
    characterName: 'Sasuke Uchiha',
    animeTitle: 'Naruto'
  },
  {
    japanese: '頑張って',
    romaji: 'ganbatte',
    english: 'Do your best!',
    context: 'A motivational phrase frequently used in anime to encourage characters.',
    example: '頑張って、ミドリヤ！(Do your best, Midoriya!) - All Might cheering on Deku in My Hero Academia.',
    difficulty: 'beginner',
    category: 'emotion',
    animeImage: 'https://i.imgur.com/QZxG5Yx.png',
    characterName: 'All Might',
    animeTitle: 'My Hero Academia'
  },
  {
    japanese: '大丈夫',
    romaji: 'daijoubu',
    english: 'I\'m okay / It\'s fine',
    context: 'Used to reassure others, common in anime when characters want to show they\'re fine.',
    example: '大丈夫、心配しないで (I\'m okay, don\'t worry) - Kaneki reassuring his friends in Tokyo Ghoul.',
    difficulty: 'beginner',
    category: 'response'
  },
  {
    japanese: 'すみません',
    romaji: 'sumimasen',
    english: 'Excuse me / I\'m sorry',
    context: 'A polite way to get attention or apologize, often used in anime for comedic effect.',
    example: 'すみません、遅れました (I\'m sorry, I\'m late) - Ichigo apologizing for being late to class in Bleach.',
    difficulty: 'beginner',
    category: 'greeting'
  },
  {
    japanese: '行くぞ',
    romaji: 'ikuzo',
    english: 'Let\'s go!',
    context: 'An energetic phrase used when starting an action or battle.',
    example: '行くぞ、ルフィ！(Let\'s go, Luffy!) - Zoro ready to fight in One Piece.',
    difficulty: 'beginner',
    category: 'action'
  },
  {
    japanese: '分かった',
    romaji: 'wakatta',
    english: 'I understand / Got it',
    context: 'Used when acknowledging something or agreeing to a plan.',
    example: '分かった、先生 (I understand, teacher) - Gon responding to his teacher in Hunter x Hunter.',
    difficulty: 'beginner',
    category: 'response'
  },
  {
    japanese: '待って',
    romaji: 'matte',
    english: 'Wait!',
    context: 'Used to ask someone to stop or wait, often in urgent situations.',
    example: '待って、サクラ！(Wait, Sakura!) - Naruto calling out to Sakura.',
    difficulty: 'beginner',
    category: 'action'
  },
  {
    japanese: '助けて',
    romaji: 'tasukete',
    english: 'Help me!',
    context: 'A cry for help, often used in dramatic or intense scenes.',
    example: '助けて、イチゴ！(Help me, Ichigo!) - Rukia calling for help in Bleach.',
    difficulty: 'beginner',
    category: 'action'
  },
  {
    japanese: 'お疲れ様',
    romaji: 'otsukaresama',
    english: 'Good work / Thank you for your effort',
    context: 'Used to acknowledge someone\'s hard work or effort.',
    example: 'お疲れ様、みんな (Good work, everyone) - All Might after a training session in My Hero Academia.',
    difficulty: 'beginner',
    category: 'greeting'
  },
  {
    japanese: '信じて',
    romaji: 'shinjite',
    english: 'Believe in me / Trust me',
    context: 'A phrase used to ask for trust or belief in one\'s abilities.',
    example: '信じて、エレン (Believe in me, Eren) - Mikasa to Eren in Attack on Titan.',
    difficulty: 'beginner',
    category: 'emotion'
  },
  {
    japanese: '気をつけて',
    romaji: 'ki wo tsukete',
    english: 'Be careful / Take care',
    context: 'Used to warn someone to be careful or to say goodbye.',
    example: '気をつけて、タンjiロウ (Be careful, Tanjiro) - Nezuko warning her brother in Demon Slayer.',
    difficulty: 'beginner',
    category: 'emotion'
  },
  {
    japanese: '何',
    romaji: 'nani',
    english: 'What?',
    context: 'A common expression of surprise or confusion.',
    example: '何？！(What?!) - A common reaction in many anime, especially in JoJo\'s Bizarre Adventure.',
    difficulty: 'beginner',
    category: 'question'
  },
  {
    japanese: 'よし',
    romaji: 'yoshi',
    english: 'Alright / Good',
    context: 'An expression of approval or readiness.',
    example: 'よし、始めよう (Alright, let\'s begin) - Goku preparing for battle in Dragon Ball.',
    difficulty: 'beginner',
    category: 'emotion'
  },
  {
    japanese: '行こう',
    romaji: 'ikou',
    english: 'Let\'s go',
    context: 'A casual way to suggest moving forward or starting something.',
    example: '行こう、ヒナタ (Let\'s go, Hinata) - Naruto inviting Hinata to train together.',
    difficulty: 'beginner',
    category: 'action'
  },
  {
    japanese: "俺はゴン・フリークスだ！",
    romaji: "Ore wa Gon Furīkusu da!",
    english: "I am Gon Freecss!",
    context: "Gon's famous introduction in Hunter x Hunter.",
    example: "俺はゴン・フリークスだ！ (I am Gon Freecss!) – Gon introducing himself.",
    difficulty: "beginner",
    category: "greeting",
    animeImage: "/anime/gon-hxh.JPG",
    characterName: "Gon Freecss",
    animeTitle: "Hunter x Hunter"
  },
  {
    japanese: "炭治郎、がんばれ！",
    romaji: "Tanjiro, ganbare!",
    english: "Tanjiro, do your best!",
    context: "A cheering phrase for Tanjiro in Demon Slayer.",
    example: "炭治郎、がんばれ！ (Tanjiro, do your best!) – Nezuko cheering her brother.",
    difficulty: "beginner",
    category: "emotion",
    animeImage: "/anime/tanjiro-demonslayer.JPG",
    characterName: "Tanjiro Kamado",
    animeTitle: "Demon Slayer"
  },
  {
    japanese: "ナルト、忍者の道を極めるぞ！",
    romaji: "Naruto, ninja no michi wo kiwameru zo!",
    english: "Naruto, I'll master the way of the ninja!",
    context: "Naruto's determination in Naruto.",
    example: "ナルト、忍者の道を極めるぞ！ (Naruto, I'll master the way of the ninja!) – Naruto's vow.",
    difficulty: "beginner",
    category: "action",
    animeImage: "/anime/naruto.JPG",
    characterName: "Naruto Uzumaki",
    animeTitle: "Naruto"
  },
  {
    japanese: "喰種、俺は人間だ。",
    romaji: "Gūru, ore wa ningen da.",
    english: "Ghoul, I am human.",
    context: "Kaneki's famous line in Tokyo Ghoul.",
    example: "喰種、俺は人間だ。 (Ghoul, I am human.) – Kaneki's declaration.",
    difficulty: "beginner",
    category: "emotion",
    animeImage: "kaneki-tokyoghoul.JPG",
    characterName: "Kaneki Ken",
    animeTitle: "Tokyo Ghoul"
  },
  {
    japanese: "風のブレーカー、俺は速いぞ。",
    romaji: "Kaze no Burēkā, ore wa hayai zo.",
    english: "Wind Breaker, I am fast.",
    context: "A phrase inspired by Wind Breaker (placeholder).",
    example: "風のブレーカー、俺は速いぞ。 (Wind Breaker, I am fast.) – Placeholder quote.",
    difficulty: "beginner",
    category: "action",
    animeImage: "windbreaker.JPG",
    characterName: "Wind Breaker",
    animeTitle: "Wind Breaker"
  },
  {
    japanese: "ソロ・レベリング、俺は最強だ。",
    romaji: "Soro Reberingu, ore wa saikyō da.",
    english: "Solo Leveling, I am the strongest.",
    context: "A phrase inspired by Solo Leveling (placeholder).",
    example: "ソロ・レベリング、俺は最強だ。 (Solo Leveling, I am the strongest.) – Placeholder quote.",
    difficulty: "beginner",
    category: "emotion",
    animeImage: "sololeveling.JPG",
    characterName: "Sung Jin-Woo",
    animeTitle: "Solo Leveling"
  },
  {
    japanese: "ヒソカだよ。",
    romaji: "Hisoka da yo.",
    english: "I am Hisoka.",
    context: "Hisoka's introduction in Hunter x Hunter.",
    example: "ヒソカだよ。 (I am Hisoka.) – Hisoka introducing himself.",
    difficulty: "beginner",
    category: "greeting",
    animeImage: "hisoka-hxh.JPG",
    characterName: "Hisoka",
    animeTitle: "Hunter x Hunter"
  },
  {
    japanese: "ヒデ、がんばれ！",
    romaji: "Hide, ganbare!",
    english: "Hide, do your best!",
    context: "A cheering phrase for Hide in Tokyo Ghoul.",
    example: "ヒデ、がんばれ！ (Hide, do your best!) – cheering for Hide.",
    difficulty: "beginner",
    category: "greeting",
    animeImage: "hide-tokyoghoul.JPG",
    characterName: "Hide",
    animeTitle: "Tokyo Ghoul"
  }
].map(phrase => {
  const typedPhrase = {
    ...phrase,
    difficulty: phrase.difficulty as Difficulty,
    category: phrase.category as Category
  };
  return {
    ...typedPhrase,
    id: generateId(typedPhrase)
  };
});

// Initialize Kuroshiro with proper error handling
const initializeKuroshiro = async (): Promise<Kuroshiro> => {
  const kuroshiro = new Kuroshiro();
  const analyzer = new KuromojiAnalyzer();
  
  try {
    await kuroshiro.init(analyzer);
    return kuroshiro;
  } catch (error) {
    console.error('Failed to initialize Kuroshiro:', error);
    throw new Error('Failed to initialize Japanese text converter');
  }
};

// Custom hooks
const useKuroshiro = () => {
  const [kuroshiro, setKuroshiro] = useState<Kuroshiro | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const instance = await initializeKuroshiro();
        if (isMounted) {
          setKuroshiro(instance);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize converter');
        }
      }
    };

    init();
    return () => { isMounted = false; };
  }, []);

  return { kuroshiro, error };
};

const useRomajiConversion = (phrases: AnimePhrase[], kuroshiro: Kuroshiro | null) => {
  const [romajiMap, setRomajiMap] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (!kuroshiro) return;

    const convertPhrases = async () => {
      try {
        const newRomajiMap: Record<string, string> = {};
        
        for (const phrase of phrases) {
          if (!romajiMap[phrase.japanese]) {
            const romaji = await kuroshiro.convert(phrase.japanese, {
              to: 'romaji',
              mode: 'spaced'
            });
            newRomajiMap[phrase.japanese] = romaji;
          }
        }

        if (isMounted.current) {
          setRomajiMap(prev => ({ ...prev, ...newRomajiMap }));
        }
      } catch (err) {
        if (isMounted.current) {
          setError('Failed to convert phrases to romaji');
          console.error('Romaji conversion error:', err);
        }
      }
    };

    convertPhrases();
  }, [phrases, kuroshiro]);

  return { romajiMap, error };
};

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode; onError?: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AnimeSection Error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Loading component with better accessibility
const LoadingFallback = () => (
  <div 
    className="animate-pulse space-y-4" 
    role="status" 
    aria-label="Loading content"
  >
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

// Error fallback component with better error handling
const ErrorFallback = ({ error, onRetry }: { error: Error | null; onRetry?: () => void }) => (
  <div 
    className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg" 
    role="alert"
  >
    <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
      Something went wrong
    </h2>
    <p className="text-red-600 dark:text-red-300">
      {error?.message || 'An unknown error occurred'}
    </p>
    <div className="mt-4 space-x-4">
      <button
        onClick={onRetry || (() => window.location.reload())}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        {onRetry ? 'Try Again' : 'Reload Page'}
      </button>
    </div>
  </div>
);

// Main component
const AnimeSection: React.FC = () => {
  // Context hooks
  const { user } = useAuth();
  const { settings } = useApp();
  const { updateProgress } = useProgress();
  const { theme, isDarkMode } = useTheme();
  const { playSound } = useSound();

  // Custom hooks
  const { kuroshiro, error: kuroshiroError } = useKuroshiro();

  // State management
  const [state, setState] = useState<AnimeSectionState>({
    ...INITIAL_STATE,
    showRomaji: settings?.showRomaji ?? true
  });

  // Memoized values
  const filteredPhrases = useMemo(() => {
    try {
      return state.selectedCategory === 'all'
        ? beginnerPhrases
        : beginnerPhrases.filter(phrase => phrase.category === state.selectedCategory);
    } catch (err) {
      console.error('Error filtering phrases:', err);
      setState(prev => ({ ...prev, error: 'Error loading phrases' }));
      return [];
    }
  }, [state.selectedCategory]);

  const currentPhrase = useMemo(() => 
    filteredPhrases[state.currentPhraseIndex],
    [filteredPhrases, state.currentPhraseIndex]
  );

  // Romaji conversion
  const { romajiMap, error: romajiError } = useRomajiConversion(
    filteredPhrases,
    kuroshiro
  );

  // Effect for updating romaji map
  useEffect(() => {
    if (romajiMap) {
      setState(prev => ({ ...prev, romajiMap }));
    }
  }, [romajiMap]);

  // Effect for error handling
  useEffect(() => {
    const errors = [kuroshiroError, romajiError].filter(Boolean);
    if (errors.length > 0) {
      setState(prev => ({ ...prev, error: errors[0] }));
    }
  }, [kuroshiroError, romajiError]);

  // Memoized handlers
  const handleNext = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPhraseIndex: Math.min(prev.currentPhraseIndex + 1, filteredPhrases.length - 1),
      showEnglish: false
    }));
  }, [filteredPhrases.length]);

  const handlePrevious = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPhraseIndex: Math.max(prev.currentPhraseIndex - 1, 0),
      showEnglish: false
    }));
  }, []);

  const handleCategoryChange = useCallback((category: Category | 'all') => {
    setState(prev => ({
      ...prev,
      selectedCategory: category,
      currentPhraseIndex: 0,
      showEnglish: false
    }));
  }, []);

  const handlePractice = useCallback(async () => {
    if (!user || !currentPhrase) return;

    try {
      await updateProgress('anime', currentPhrase.japanese, true);
      setState(prev => ({ ...prev, score: prev.score + 1 }));
      if (playSound) {
        playSound('correct');
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to save progress. Please try again.' 
      }));
    }
  }, [user, currentPhrase, updateProgress, playSound]);

  const handleToggleEnglish = useCallback(() => {
    setState(prev => ({ ...prev, showEnglish: !prev.showEnglish }));
  }, []);

  const handleToggleRomaji = useCallback(() => {
    setState(prev => ({ ...prev, showRomaji: !prev.showRomaji }));
  }, []);

  const handleRetry = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const handlePlaySound = useCallback(() => {
    if (playSound) {
      playSound('click');
    }
  }, [playSound]);

  // Error handling
  if (state.error) {
    return (
      <ErrorBoundary 
        fallback={<ErrorFallback error={new Error(state.error)} onRetry={handleRetry} />}
        onError={(error) => console.error('Boundary caught error:', error)}
      >
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{state.error}</span>
            <button
              onClick={handleRetry}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Loading state
  if (!kuroshiro || !currentPhrase) {
    return <LoadingFallback />;
  }

  // Empty state
  if (filteredPhrases.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Learn Japanese with Anime & Manga
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            No phrases available for the selected category.<br />
            Please try selecting a different category.
          </p>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <ErrorBoundary 
      fallback={<ErrorFallback error={null} onRetry={handleRetry} />}
      onError={(error) => console.error('Boundary caught error:', error)}
    >
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Learn Japanese with Anime & Manga
        </h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <div className="w-full max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3 py-2 rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                state.selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
              aria-pressed={state.selectedCategory === 'all'}
            >
              All
            </button>
            {(['greeting', 'emotion', 'action', 'question', 'response'] as const).map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-2 rounded-lg text-sm sm:text-base transition-colors capitalize focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  state.selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
                aria-pressed={state.selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Romaji Toggle */}
        <div className="flex justify-center mb-6">
          <label className="flex items-center gap-2 cursor-pointer bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-600">
            <input
              type="checkbox"
              checked={state.showRomaji}
              onChange={handleToggleRomaji}
              className="form-checkbox h-4 w-4 text-blue-600 transition-colors focus:ring-blue-500"
              aria-label="Toggle romaji display"
            />
            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              Show Romaji
            </span>
          </label>
        </div>

        {/* Phrase Card */}
        <Suspense fallback={<LoadingFallback />}>
          <AnimePhraseCard
            key={currentPhrase.id}
            id={currentPhrase.id}
            japanese={currentPhrase.japanese}
            romaji={state.romajiMap[currentPhrase.japanese] || ''}
            english={currentPhrase.english}
            context={currentPhrase.context}
            example={currentPhrase.example}
            difficulty={currentPhrase.difficulty}
            category={currentPhrase.category}
            animeImage={currentPhrase.animeImage}
            characterName={currentPhrase.characterName}
            animeTitle={currentPhrase.animeTitle}
            showRomaji={state.showRomaji}
            showEnglish={state.showEnglish}
            onMarkAsLearned={handlePractice}
            isLearned={false}
            onPlaySound={handlePlaySound}
            isDarkMode={isDarkMode}
          />
        </Suspense>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleToggleEnglish}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-pressed={state.showEnglish}
          >
            {state.showEnglish ? 'Hide' : 'Show'} English
          </button>
          <button
            onClick={handlePractice}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            disabled={!user}
            title={!user ? 'Please log in to practice' : 'Mark as practiced'}
          >
            Practice
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePrevious}
            disabled={state.currentPhraseIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Previous phrase"
          >
            Previous
          </button>
          <span 
            className="text-gray-600 dark:text-gray-300"
            aria-label={`Phrase ${state.currentPhraseIndex + 1} of ${filteredPhrases.length}`}
          >
            {state.currentPhraseIndex + 1} / {filteredPhrases.length}
          </span>
          <button
            onClick={handleNext}
            disabled={state.currentPhraseIndex === filteredPhrases.length - 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Next phrase"
          >
            Next
          </button>
        </div>

        {/* Progress */}
        <div className="text-center text-gray-600 dark:text-gray-300 mt-6">
          <p>Phrases practiced today: {state.score}</p>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AnimeSection; 