import React, { useState, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { QuizWord, quizWords, Category } from '../data/quizData';

const Dictionary: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

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
            primary: 'bg-primary hover:bg-primary-dark text-white',
            secondary: 'bg-secondary hover:bg-secondary-dark text-white',
          },
        };
      case 'green':
        return {
          container: 'bg-green-card',
          text: 'text-green-text',
          input: 'bg-white border-green-border text-green-text',
          button: {
            primary: 'bg-primary hover:bg-primary-dark text-white',
            secondary: 'bg-secondary hover:bg-secondary-dark text-white',
          },
        };
      default:
        return {
          container: 'bg-white',
          text: 'text-gray-800',
          input: 'bg-white border-gray-200 text-gray-800',
          button: {
            primary: 'bg-primary hover:bg-primary-dark text-white',
            secondary: 'bg-secondary hover:bg-secondary-dark text-white',
          },
        };
    }
  };

  const themeClasses = getThemeClasses();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'food', label: 'Food' },
    { value: 'animals', label: 'Animals' },
    { value: 'colors', label: 'Colors' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'family', label: 'Family' },
    { value: 'weather', label: 'Weather' },
    { value: 'time', label: 'Time' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Difficulties' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  const filteredWords = useMemo(() => {
    return quizWords.filter(word => {
      const matchesSearch = !searchTerm || 
        word.japanese.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (word.romaji && word.romaji.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || word.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const renderWordCard = (word: QuizWord) => (
    <div
      key={`${word.japanese}-${word.english}`}
      className={`${themeClasses.container} rounded-lg shadow-md p-6 transform transition-all duration-300 hover:shadow-lg`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className={`text-3xl font-bold mb-2 ${themeClasses.text}`}>
            {word.japanese}
          </div>
          {word.romaji && (
            <div className={`text-xl mb-2 ${themeClasses.text} opacity-75`}>
              {word.romaji}
            </div>
          )}
          <div className={`text-xl font-semibold mb-2 ${themeClasses.text}`}>
            {word.english}
          </div>
          {word.hint && (
            <div className={`text-sm ${themeClasses.text} opacity-75`}>
              Hint: {word.hint}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className={`px-3 py-1 rounded-full text-sm ${
            isDarkMode ? 'bg-dark-border' : 'bg-gray-100'
          } ${themeClasses.text}`}>
            {word.category}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm ${
            word.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            word.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {word.difficulty}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className={`${themeClasses.container} rounded-lg shadow-md p-6 mb-6`}>
        <h2 className={`text-2xl font-bold mb-6 ${themeClasses.text}`}>
          Japanese Dictionary
        </h2>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search in Japanese, English, or Romaji..."
                className={`w-full p-3 border rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-primary focus:border-primary`}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category)}
              className={`p-3 border rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-primary focus:border-primary`}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as 'all' | 'easy' | 'medium' | 'hard')}
              className={`p-3 border rounded-lg ${themeClasses.input} focus:ring-2 focus:ring-primary focus:border-primary`}
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredWords.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredWords.map(renderWordCard)}
          </div>
        ) : (
          <div className={`text-center p-6 ${themeClasses.container} rounded-lg shadow-md`}>
            <div className={`text-xl ${themeClasses.text}`}>
              No words found matching your criteria
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dictionary; 