import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useApp } from '../context/AppContext';
import { kuroshiroInstance } from '../utils/kuroshiro';
import AnimePhraseCard from '../components/AnimePhraseCard';
import { ProgressItem } from '../types';

interface AnimePhrase {
  japanese: string;
  romaji: string;
  english: string;
  context: string;
  example: string;
  difficulty: 'beginner' | 'intermediate';
  category: 'greeting' | 'emotion' | 'action' | 'question' | 'response';
  animeImage?: string;
  characterName?: string;
  animeTitle?: string;
}

const beginnerPhrases: AnimePhrase[] = [
  {
    japanese: 'おはようございます',
    romaji: 'ohayou gozaimasu',
    english: 'Good morning',
    context: 'A polite way to say good morning, commonly used in anime when characters meet in the morning.',
    example: 'おはようございます、先生！(Good morning, teacher!) - Used by Tanjiro in Demon Slayer when greeting his teacher.',
    difficulty: 'beginner',
    category: 'greeting',
    animeImage: '/anime/tanjiro-demonslayer.JPG',
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
    animeImage: '/anime/naruto.JPG',
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
    animeImage: '/anime/hide-tokyoghoul.JPG',
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
    animeImage: "/anime/kaneki-tokyoghoul.JPG",
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
    animeImage: "/anime/windbreaker.JPG",
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
    animeImage: "/anime/sololeveling.JPG",
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
    animeImage: "/anime/hisoka-hxh.JPG",
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
    animeImage: "/anime/hide-tokyoghoul.JPG",
    characterName: "Hide",
    animeTitle: "Tokyo Ghoul"
  }
];

// Helper: check if string is kana-only (hiragana/katakana)
const isKanaOnly = (str: string) => /^[\u3040-\u309F\u30A0-\u30FF\u3000-\u303F\uFF66-\uFF9F\s]+$/.test(str);

interface PracticeState {
  mode: 'translation' | 'typing' | 'listening';
  currentPhrase: AnimePhrase | null;
  userInput: string;
  isCorrect: boolean | null;
  showHint: boolean;
  score: number;
  totalAttempts: number;
}

const AnimeSection: React.FC = () => {
  const { currentUser } = useAuth();
  const { settings } = useApp();
  const { updateProgress, setTotalItems, progress } = useProgress();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [showRomaji, setShowRomaji] = useState(settings.showRomaji);
  const [romajiMap, setRomajiMap] = useState<{ [key: string]: string }>({});
  const [showEnglish, setShowEnglish] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AnimePhrase['category'] | 'all'>('all');
  const [score, setScore] = useState(0);
  const [practiceState, setPracticeState] = useState<PracticeState>({
    mode: 'translation',
    currentPhrase: null,
    userInput: '',
    isCorrect: null,
    showHint: false,
    score: 0,
    totalAttempts: 0
  });
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  // Filter phrases to kana-only
  const kanaPhrases = useMemo(() =>
    beginnerPhrases.filter(phrase => isKanaOnly(phrase.japanese)),
    []
  );

  const filteredPhrases = useMemo(() =>
    (selectedCategory === 'all' ? kanaPhrases : kanaPhrases.filter(phrase => phrase.category === selectedCategory)),
    [kanaPhrases, selectedCategory]
  );

  const currentPhrase = filteredPhrases[currentPhraseIndex];

  // Romaji conversion with batch processing
  useEffect(() => {
    let isMounted = true;
    const updateRomaji = async () => {
      if (showRomaji && filteredPhrases.length > 0) {
        // Collect all phrases that need romaji conversion
        const textsToConvert = filteredPhrases
          .map(phrase => phrase.japanese.trim())
          .filter(text => !romajiMap[text]);
        console.log('Batching for romaji:', textsToConvert);
        if (textsToConvert.length > 0) {
          const newRomajiMap = await kuroshiroInstance.convertBatch(textsToConvert);
          console.log('Batch result:', newRomajiMap);
          if (isMounted) {
            setRomajiMap(prev => ({ ...prev, ...newRomajiMap }));
          }
        }
      }
    };
    updateRomaji();
    return () => { isMounted = false; };
  }, [showRomaji, filteredPhrases]);

  // Set total items for progress tracking
  useEffect(() => {
    setTotalItems('anime', filteredPhrases.length);
  }, [filteredPhrases.length, setTotalItems]);

  // --- Progress tracking for Anime section ---
  const animeProgressItems = useMemo(() =>
    beginnerPhrases.map(phrase => {
      const key = `anime-${phrase.japanese}`;
      return progress[key] as ProgressItem | undefined;
    }),
    [progress]
  );
  const totalAnime = beginnerPhrases.length;
  const mastered = animeProgressItems.filter(item => item && item.correct >= 3).length;
  const inProgress = animeProgressItems.filter(item => item && item.correct > 0 && item.correct < 3).length;
  const notStarted = animeProgressItems.filter(item => !item || item.correct === 0).length;
  const animeProgressPercent = totalAnime > 0 ? Math.round((mastered / totalAnime) * 100) : 0;

  const handleNext = () => {
    if (currentPhraseIndex < filteredPhrases.length - 1) {
      setCurrentPhraseIndex(prev => prev + 1);
      setShowEnglish(false);
    }
  };

  const handlePrevious = () => {
    if (currentPhraseIndex > 0) {
      setCurrentPhraseIndex(prev => prev - 1);
      setShowEnglish(false);
    }
  };

  const handleCategoryChange = (category: AnimePhrase['category'] | 'all') => {
    setSelectedCategory(category);
    setCurrentPhraseIndex(0);
    setShowEnglish(false);
  };

  const handlePractice = async () => {
    if (currentUser && currentPhrase) {
      await updateProgress('anime', currentPhrase.japanese, true);
      setScore(prev => prev + 1);
    }
  };

  const startPractice = (mode: PracticeState['mode']) => {
    const randomPhrase = filteredPhrases[Math.floor(Math.random() * filteredPhrases.length)];
    setPracticeState({
      mode,
      currentPhrase: randomPhrase,
      userInput: '',
      isCorrect: null,
      showHint: false,
      score: 0,
      totalAttempts: 0
    });
    setIsPracticeMode(true);
  };

  const checkAnswer = () => {
    if (!practiceState.currentPhrase) return;

    let isCorrect = false;
    const userAnswer = practiceState.userInput.trim().toLowerCase();
    
    switch (practiceState.mode) {
      case 'translation':
        isCorrect = userAnswer === practiceState.currentPhrase.english.toLowerCase();
        break;
      case 'typing':
        isCorrect = userAnswer === practiceState.currentPhrase.japanese.toLowerCase() ||
                   userAnswer === practiceState.currentPhrase.romaji.toLowerCase();
        break;
    }

    setPracticeState(prev => ({
      ...prev,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
      totalAttempts: prev.totalAttempts + 1,
      showHint: !isCorrect
    }));
  };

  const nextPhrase = () => {
    const randomPhrase = filteredPhrases[Math.floor(Math.random() * filteredPhrases.length)];
    setPracticeState(prev => ({
      ...prev,
      currentPhrase: randomPhrase,
      userInput: '',
      isCorrect: null,
      showHint: false
    }));
  };

  const renderPracticeMode = () => {
    if (!practiceState.currentPhrase) return null;

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Practice Mode</h2>
          <div className="text-right">
            <p className="text-lg">Score: {practiceState.score}/{practiceState.totalAttempts}</p>
            <button 
              onClick={() => setIsPracticeMode(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              Exit Practice
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-2xl mb-4">
            {practiceState.mode === 'translation' ? (
              practiceState.currentPhrase.japanese
            ) : (
              practiceState.currentPhrase.english
            )}
          </div>
          
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={practiceState.userInput}
              onChange={(e) => setPracticeState(prev => ({ ...prev, userInput: e.target.value }))}
              placeholder={practiceState.mode === 'translation' ? "Enter English translation" : "Enter Japanese or Romaji"}
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={checkAnswer}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Check
            </button>
          </div>

          {practiceState.isCorrect !== null && (
            <div className={`p-4 rounded ${practiceState.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
              {practiceState.isCorrect ? (
                <p className="text-green-700">Correct! 🎉</p>
              ) : (
                <div>
                  <p className="text-red-700">Not quite right. Try again!</p>
                  {practiceState.showHint && (
                    <p className="mt-2 text-gray-600">
                      Hint: {practiceState.mode === 'translation' 
                        ? `Romaji: ${practiceState.currentPhrase.romaji}`
                        : `Japanese: ${practiceState.currentPhrase.japanese}`
                      }
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {practiceState.isCorrect && (
            <button
              onClick={nextPhrase}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Next Phrase
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!isPracticeMode ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Anime Phrases Practice</h1>
            <div className="flex gap-4">
              <button
                onClick={() => startPractice('translation')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Practice Translation
              </button>
              <button
                onClick={() => startPractice('typing')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Practice Typing
              </button>
            </div>
          </div>
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
              Learn Japanese with Anime & Manga
            </h1>

            {/* Anime Progress Bar and Stats */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Anime Progress</span>
                <span className="font-bold text-gray-700 dark:text-gray-200">{animeProgressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${animeProgressPercent}%` }}
                />
              </div>
              <div className="flex gap-6 text-sm text-gray-700 dark:text-gray-300 mt-2">
                <span>Not started: <span className="font-bold">{notStarted}</span></span>
                <span>In progress: <span className="font-bold">{inProgress}</span></span>
                <span>Mastered: <span className="font-bold">{mastered}</span> / {totalAnime}</span>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center px-4">
              <div className="w-full max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`px-3 py-2 rounded-lg text-sm sm:text-base transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  All
                </button>
                {['greeting', 'emotion', 'action', 'question', 'response'].map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category as AnimePhrase['category'])}
                    className={`px-3 py-2 rounded-lg text-sm sm:text-base transition-colors capitalize ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4 flex items-center gap-4 justify-center px-4">
              <label className="flex items-center gap-2 cursor-pointer bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-600">
                <input
                  type="checkbox"
                  checked={showRomaji}
                  onChange={() => setShowRomaji(r => !r)}
                  className="form-checkbox h-4 w-4 text-blue-600 transition-colors"
                />
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Show Romaji</span>
              </label>
            </div>

            {/* Phrase Card */}
            <div className="mb-6">
              <AnimePhraseCard
                japanese={currentPhrase.japanese}
                romaji={romajiMap[currentPhrase.japanese.trim()] || currentPhrase.romaji}
                english={currentPhrase.english}
                context={currentPhrase.context}
                example={currentPhrase.example}
                category={currentPhrase.category}
                showRomaji={showRomaji}
                showEnglish={showEnglish}
                animeImage={currentPhrase.animeImage}
                characterName={currentPhrase.characterName}
                animeTitle={currentPhrase.animeTitle}
              />
            </div>

            {/* Controls and Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setShowEnglish(!showEnglish)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                {showEnglish ? 'Hide' : 'Show'} English
              </button>
              <button
                onClick={handlePractice}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                Practice
              </button>
              <button
                onClick={handlePrevious}
                disabled={currentPhraseIndex === 0}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <span className="self-center text-gray-600 dark:text-gray-300">
                {currentPhraseIndex + 1} / {filteredPhrases.length}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPhraseIndex === filteredPhrases.length - 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>

            {/* Progress */}
            <div className="text-center text-gray-600 dark:text-gray-300">
              <p>Phrases practiced today: {score}</p>
            </div>
          </div>
        </>
      ) : (
        renderPracticeMode()
      )}
    </div>
  );
};

export default AnimeSection; 