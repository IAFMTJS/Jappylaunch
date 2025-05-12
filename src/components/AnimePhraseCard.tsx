import React from 'react';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type Category = 'greeting' | 'emotion' | 'action' | 'question' | 'response';

interface AnimePhraseCardProps {
  id: string;
  japanese: string;
  romaji: string;
  english: string;
  context: string;
  example: string;
  difficulty: Difficulty;
  category: Category;
  showRomaji: boolean;
  showEnglish: boolean;
  animeImage?: string;
  characterName?: string;
  animeTitle?: string;
  onMarkAsLearned?: () => Promise<void>;
  isLearned: boolean;
  onPlaySound?: () => void;
  isDarkMode: boolean;
}

const AnimePhraseCard: React.FC<AnimePhraseCardProps> = ({
  japanese,
  romaji,
  english,
  context,
  example,
  category,
  showRomaji,
  showEnglish,
  animeImage,
  characterName,
  animeTitle,
  onMarkAsLearned,
  isLearned,
  onPlaySound,
  isDarkMode
}) => {
  console.log('AnimePhraseCard props:', {
    onMarkAsLearned,
    onPlaySound,
    isLearned,
    japanese,
    romaji,
    english,
    context,
    example,
    category,
    animeImage,
    characterName,
    animeTitle,
    showRomaji,
    showEnglish,
    isDarkMode
  });

  // Default anime images based on category
  const getDefaultImage = (category: Category) => {
    switch (category) {
      case 'greeting':
        return 'https://i.imgur.com/8YtG5Yx.png'; // Tanjiro greeting
      case 'emotion':
        return 'https://i.imgur.com/QZxG5Yx.png'; // Deku determined
      case 'action':
        return 'https://i.imgur.com/2XtG5Yx.png'; // Naruto running
      case 'question':
        return 'https://i.imgur.com/4XtG5Yx.png'; // Confused character
      case 'response':
        return 'https://i.imgur.com/6XtG5Yx.png'; // Character responding
      default:
        return 'https://i.imgur.com/8YtG5Yx.png';
    }
  };

  let imageUrl = animeImage || getDefaultImage(category);
  if (animeImage && !animeImage.startsWith('http')) {
    imageUrl = `/anime/${animeImage}`;
  }

  const handleMarkAsLearned = async () => {
    if (onMarkAsLearned) {
      try {
        await onMarkAsLearned();
      } catch (error) {
        console.error('Failed to mark as learned:', error);
      }
    }
  };

  const handlePlaySound = () => {
    if (onPlaySound) {
      onPlaySound();
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Visual Section */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="text-center p-4">
              <h2 
                className="text-3xl font-bold text-white mb-2 drop-shadow-lg cursor-pointer hover:text-blue-200 transition-colors"
                onClick={handlePlaySound}
              >
                {japanese}
              </h2>
              {showRomaji && (
                <p className="text-xl text-white drop-shadow-lg">
                  {romaji}
                </p>
              )}
            </div>
          </div>
        </div>
        {characterName && animeTitle && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
            {characterName} - {animeTitle}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {showEnglish && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {english}
            </h3>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-200">
              <span className="font-semibold">Context:</span> {context}
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-200">
              <span className="font-semibold">Example:</span> {example}
            </p>
          </div>
        </div>

        {/* Category and Actions */}
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            {category}
          </span>
          
          {onMarkAsLearned && (
            <button
              onClick={handleMarkAsLearned}
              disabled={isLearned}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLearned
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
              }`}
            >
              {isLearned ? 'Learned' : 'Mark as Learned'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimePhraseCard; 