import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';
import SettingsPanel from '../components/Settings';
import { kuroshiroInstance } from '../utils/kuroshiro';

interface BaseWord {
  japanese: string;
  english: string;
  difficulty: 'easy' | 'medium' | 'hard';
  romaji?: string;
}

interface ThemedWord extends BaseWord {
  category: string;
}

interface SynonymWord extends BaseWord {
  synonym: string;
  antonym: string;
}

interface WordFamilyWord extends BaseWord {
  related: string[];
}

interface CollocationWord extends BaseWord {
  usage: string;
}

interface IdiomWord extends BaseWord {
  literal: string;
}

type Word = ThemedWord | SynonymWord | WordFamilyWord | CollocationWord | IdiomWord;

interface Category {
  id: string;
  name: string;
  words: Word[];
}

const Section5 = () => {
  const { settings } = useApp();
  const { getProgressStatus, updateProgress } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState<string>('themed');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [completedWords, setCompletedWords] = useState<number>(0);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [romajiMap, setRomajiMap] = useState<{ [key: string]: string }>({});

  const categories: Category[] = [
    { 
      id: 'themed',
      name: 'Themed Lists',
      words: [
        { japanese: '食べ物', english: 'Food', category: 'Food', difficulty: 'easy' },
        { japanese: '飲み物', english: 'Drinks', category: 'Food', difficulty: 'easy' },
        { japanese: '動物', english: 'Animals', category: 'Animals', difficulty: 'easy' },
        { japanese: '色', english: 'Colors', category: 'Colors', difficulty: 'easy' }
      ]
    },
    { 
      id: 'synonyms',
      name: 'Synonyms & Antonyms',
      words: [
        { japanese: '大きい', english: 'Big', synonym: 'でかい', antonym: '小さい', difficulty: 'medium' },
        { japanese: '新しい', english: 'New', synonym: 'フレッシュ', antonym: '古い', difficulty: 'medium' },
        { japanese: '速い', english: 'Fast', synonym: 'スピーディー', antonym: '遅い', difficulty: 'medium' }
      ]
    },
    { 
      id: 'word-families',
      name: 'Word Families',
      words: [
        { japanese: '食べる', english: 'To eat', related: ['食べ物', '食べ方', '食べ過ぎる'], difficulty: 'medium' },
        { japanese: '書く', english: 'To write', related: ['書き方', '書き取り', '書き直す'], difficulty: 'medium' },
        { japanese: '見る', english: 'To see', related: ['見方', '見物', '見直す'], difficulty: 'medium' }
      ]
    },
    { 
      id: 'collocations',
      name: 'Collocations',
      words: [
        { japanese: '電話をかける', english: 'To make a phone call', usage: 'Common phrase', difficulty: 'hard' },
        { japanese: '約束を守る', english: 'To keep a promise', usage: 'Common phrase', difficulty: 'hard' },
        { japanese: '気をつける', english: 'To be careful', usage: 'Common phrase', difficulty: 'hard' }
      ]
    },
    { 
      id: 'idioms',
      name: 'Idiomatic Expressions',
      words: [
        { japanese: '猫の手も借りたい', english: 'To be very busy', literal: 'Want to borrow even a cat\'s paw', difficulty: 'hard' },
        { japanese: '猿も木から落ちる', english: 'Even experts make mistakes', literal: 'Even monkeys fall from trees', difficulty: 'hard' },
        { japanese: '目が回る', english: 'To be dizzy/busy', literal: 'Eyes are spinning', difficulty: 'hard' }
      ]
    }
  ];

  const currentCategory = categories.find(cat => cat.id === selectedCategory);
  const filteredWords = currentCategory?.words.filter((word: Word) => 
    word.japanese.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.english.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  React.useEffect(() => {
    if (currentCategory) {
      const completed = currentCategory.words.filter(word => 
        getProgressStatus('section5', word.japanese).isMarked
      ).length;
      setCompletedWords(completed);
      setTotalWords(currentCategory.words.length);
    }
  }, [currentCategory, getProgressStatus]);

  const handleWordComplete = async (word: Word) => {
    const currentStatus = getProgressStatus('section5', word.japanese);
    await updateProgress('section5', word.japanese, !currentStatus.isMarked);
    // The completed words count will be updated by the useEffect above
  };

  const getRomaji = async (text: string) => {
    if (romajiMap[text]) return romajiMap[text];
    try {
      const romaji = await kuroshiroInstance.convert(text);
      setRomajiMap(prev => ({ ...prev, [text]: romaji }));
      return romaji;
    } catch (error) {
      console.error('Error converting to romaji:', error);
      return '';
    }
  };

  useEffect(() => {
    if (settings.showRomajiVocabulary) {
      const updateRomaji = async () => {
        // Collect all words that need romaji conversion
        const wordsToConvert = categories.flatMap(category => 
          category.words.map(word => word.japanese.trim())
        ).filter(word => !romajiMap[word]);
        console.log('Batching for romaji:', wordsToConvert);
        if (wordsToConvert.length > 0) {
          const newRomajiMap = await kuroshiroInstance.convertBatch(wordsToConvert);
          console.log('Batch result:', newRomajiMap);
          setRomajiMap(prev => ({ ...prev, ...newRomajiMap }));
        }
      };
      updateRomaji();
    }
  }, [settings.showRomajiVocabulary, categories]);

  const renderWord = (word: Word) => {
    const { isMarked } = getProgressStatus('section5', word.japanese);
    return (
      <div className={`bg-gray-50 p-4 rounded-lg ${isMarked ? 'border-2 border-green-500' : ''}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{word.japanese}</h3>
            {settings.showRomajiVocabulary && (
              <p className="text-gray-500 italic">
                {romajiMap[word.japanese.trim()] || 'Loading...'}
              </p>
            )}
            <p className="text-gray-600">{word.english}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-sm ${
              word.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              word.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {word.difficulty}
            </span>
            <button
              onClick={() => handleWordComplete(word)}
              className={`p-2 rounded-full ${
                isMarked 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {isMarked ? '✓' : '○'}
            </button>
          </div>
        </div>
        
        {'synonym' in word && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Synonym: {word.synonym} | Antonym: {word.antonym}
            </p>
          </div>
        )}
        
        {'related' in word && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Related words: {word.related.join(', ')}
            </p>
          </div>
        )}
        
        {'usage' in word && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Usage: {word.usage}
            </p>
          </div>
        )}
        
        {'literal' in word && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Literal meaning: {word.literal}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 mr-4">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Vocabulary Builder</h1>
        </div>
        <div className="text-sm text-gray-600">
          Progress: {completedWords}/{totalWords} words completed
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Choose a Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-lg border ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search vocabulary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {currentCategory && (
              <div className="space-y-4">
                {filteredWords.map((word: Word, index: number) => (
                  <React.Fragment key={index}>
                    {renderWord(word)}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <SettingsPanel />
        </div>
      </div>
    </div>
  );
};

export default Section5; 