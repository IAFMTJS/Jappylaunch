import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Section6 = () => {
  const [selectedType, setSelectedType] = useState<string>('hiragana');
  const [selectedLevel, setSelectedLevel] = useState<string>('beginner');

  const readingMaterials = {
    hiragana: {
      beginner: [
        {
          title: 'はじめまして',
          content: 'わたしは たなか です。にほんじん です。よろしく おねがいします。',
          translation: 'Nice to meet you. I am Tanaka. I am Japanese. Please be kind to me.',
          vocabulary: ['はじめまして', 'わたし', 'たなか', 'にほんじん', 'よろしく おねがいします']
        },
        {
          title: 'わたしの いえ',
          content: 'わたしの いえは ちいさい です。でも、きれい です。にわに はな が あります。',
          translation: 'My house is small. But it is beautiful. There are flowers in the garden.',
          vocabulary: ['いえ', 'ちいさい', 'きれい', 'にわ', 'はな']
        }
      ],
      intermediate: [
        {
          title: 'まいにちの せいかつ',
          content: 'まいあさ 6じに おきます。7じに あさごはんを たべます。8じに がっこうに いきます。',
          translation: 'I wake up at 6 every morning. I eat breakfast at 7. I go to school at 8.',
          vocabulary: ['まいあさ', 'おきます', 'あさごはん', 'たべます', 'がっこう']
        }
      ]
    },
    katakana: {
      beginner: [
        {
          title: 'レストランで',
          content: 'ハンバーガーと コーラを ください。サラダも おねがいします。',
          translation: 'Please give me a hamburger and cola. I would also like a salad.',
          vocabulary: ['レストラン', 'ハンバーガー', 'コーラ', 'サラダ']
        },
        {
          title: 'ショッピング',
          content: 'デパートで シャツと ズボンを かいました。とても たかい です。',
          translation: 'I bought a shirt and pants at the department store. They are very expensive.',
          vocabulary: ['ショッピング', 'デパート', 'シャツ', 'ズボン', 'たかい']
        }
      ],
      intermediate: [
        {
          title: 'インターネット',
          content: 'インターネットで ニュースを よみます。メールも おくります。',
          translation: 'I read news on the internet. I also send emails.',
          vocabulary: ['インターネット', 'ニュース', 'メール', 'おくります']
        }
      ]
    }
  };

  const currentMaterials = readingMaterials[selectedType as keyof typeof readingMaterials][selectedLevel as keyof typeof readingMaterials.hiragana];

  return (
    <div className="py-8">
      <div className="flex items-center mb-8">
        <Link to="/" className="text-blue-600 hover:text-blue-800 mr-4">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Reading Practice</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setSelectedType('hiragana')}
              className={`px-4 py-2 rounded-lg border ${
                selectedType === 'hiragana'
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              Hiragana
            </button>
            <button
              onClick={() => setSelectedType('katakana')}
              className={`px-4 py-2 rounded-lg border ${
                selectedType === 'katakana'
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              Katakana
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedLevel('beginner')}
              className={`px-4 py-2 rounded-lg border ${
                selectedLevel === 'beginner'
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => setSelectedLevel('intermediate')}
              className={`px-4 py-2 rounded-lg border ${
                selectedLevel === 'intermediate'
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              Intermediate
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {currentMaterials.map((material, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{material.title}</h3>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2">Reading:</h4>
                <p className="text-lg leading-relaxed">{material.content}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Translation:</h4>
                <p className="text-gray-700">{material.translation}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Vocabulary:</h4>
                <div className="flex flex-wrap gap-2">
                  {material.vocabulary.map((word, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Section6; 