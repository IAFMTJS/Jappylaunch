import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import AnimePhraseCard from '../components/AnimePhraseCard';

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
  }
];

const AnimeSection: React.FC = () => {
  const { currentUser } = useAuth();
  const { updateProgress } = useProgress();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [showRomaji, setShowRomaji] = useState(false);
  const [showEnglish, setShowEnglish] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AnimePhrase['category'] | 'all'>('all');
  const [score, setScore] = useState(0);

  const filteredPhrases = selectedCategory === 'all' 
    ? beginnerPhrases 
    : beginnerPhrases.filter(phrase => phrase.category === selectedCategory);

  const currentPhrase = filteredPhrases[currentPhraseIndex];

  const handleNext = () => {
    if (currentPhraseIndex < filteredPhrases.length - 1) {
      setCurrentPhraseIndex(prev => prev + 1);
      setShowRomaji(false);
      setShowEnglish(false);
    }
  };

  const handlePrevious = () => {
    if (currentPhraseIndex > 0) {
      setCurrentPhraseIndex(prev => prev - 1);
      setShowRomaji(false);
      setShowEnglish(false);
    }
  };

  const handleCategoryChange = (category: AnimePhrase['category'] | 'all') => {
    setSelectedCategory(category);
    setCurrentPhraseIndex(0);
    setShowRomaji(false);
    setShowEnglish(false);
  };

  const handlePractice = () => {
    // Update progress when user practices phrases
    if (currentUser) {
      updateProgress('anime', {
        totalQuestions: score + 1,
        correctAnswers: score + 1,
        lastAttempt: new Date().toISOString(),
        averageTime: 0
      });
      setScore(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Learn Japanese with Anime & Manga
      </h1>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-2 rounded-full ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          All
        </button>
        {['greeting', 'emotion', 'action', 'question', 'response'].map(category => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category as AnimePhrase['category'])}
            className={`px-4 py-2 rounded-full capitalize ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Phrase Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            {currentPhrase.japanese}
          </h2>
          {showRomaji && (
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              {currentPhrase.romaji}
            </p>
          )}
          {showEnglish && (
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {currentPhrase.english}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Context:</span> {currentPhrase.context}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Example:</span> {currentPhrase.example}
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setShowRomaji(!showRomaji)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {showRomaji ? 'Hide' : 'Show'} Romaji
          </button>
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
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentPhraseIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600 dark:text-gray-300">
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
      </div>

      {/* Progress */}
      <div className="text-center text-gray-600 dark:text-gray-300">
        <p>Phrases practiced today: {score}</p>
      </div>
    </div>
  );
};

export default AnimeSection; 