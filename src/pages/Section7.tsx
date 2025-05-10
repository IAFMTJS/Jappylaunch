import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Section7 = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('n5');
  const [selectedSection, setSelectedSection] = useState<string>('grammar');

  const jlptContent = {
    n5: {
      grammar: [
        {
          pattern: '～は～です',
          example: 'わたしは がくせい です',
          meaning: 'I am a student',
          usage: 'Basic "is/am/are" pattern'
        },
        {
          pattern: '～に～があります',
          example: 'つくえの うえに ほんが あります',
          meaning: 'There is a book on the desk',
          usage: 'Existence of inanimate objects'
        }
      ],
      vocabulary: [
        {
          word: '食べる',
          reading: 'たべる',
          romaji: 'taberu',
          meaning: 'to eat',
          example: 'ごはんを たべます',
          exampleRomaji: 'gohan o tabemasu'
        },
        {
          word: '飲む',
          reading: 'のむ',
          romaji: 'nomu',
          meaning: 'to drink',
          example: 'みずを のみます',
          exampleRomaji: 'mizu o nomimasu'
        }
      ],
      reading: [
        {
          title: '自己紹介',
          content: 'はじめまして。わたしは たなか です。にほんじん です。よろしく おねがいします。',
          questions: [
            {
              question: 'たなかさんは にほんじん ですか。',
              options: ['はい、そうです', 'いいえ、ちがいます'],
              correct: 0
            }
          ]
        }
      ]
    },
    n4: {
      grammar: [
        {
          pattern: '～てください',
          example: 'ここに すわって ください',
          meaning: 'Please sit here',
          usage: 'Polite request'
        },
        {
          pattern: '～てもいいです',
          example: 'ここで たばこを すっても いいです',
          meaning: 'You may smoke here',
          usage: 'Permission'
        }
      ],
      vocabulary: [
        {
          word: '準備する',
          reading: 'じゅんびする',
          romaji: 'junbi suru',
          meaning: 'to prepare',
          example: 'しけんの じゅんびを します',
          exampleRomaji: 'shiken no junbi o shimasu'
        },
        {
          word: '説明する',
          reading: 'せつめいする',
          romaji: 'setsumei suru',
          meaning: 'to explain',
          example: 'ルールを せつめいします',
          exampleRomaji: 'ruuru o setsumei shimasu'
        }
      ],
      reading: [
        {
          title: '旅行の計画',
          content: '来週、友達と 京都へ 旅行に 行きます。新幹線で 行きます。ホテルは もう 予約しました。',
          questions: [
            {
              question: 'いつ 京都へ 行きますか。',
              options: ['今週', '来週', '先週'],
              correct: 1
            }
          ]
        }
      ]
    }
  };

  const currentContent = jlptContent[selectedLevel as keyof typeof jlptContent][selectedSection as keyof typeof jlptContent.n5];

  return (
    <div className="py-8">
      <div className="flex items-center mb-8">
        <Link to="/" className="text-blue-600 hover:text-blue-800 mr-4">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">JLPT Preparation</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setSelectedLevel('n5')}
              className={`px-4 py-2 rounded-lg border ${
                selectedLevel === 'n5'
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              N5
            </button>
            <button
              onClick={() => setSelectedLevel('n4')}
              className={`px-4 py-2 rounded-lg border ${
                selectedLevel === 'n4'
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              N4
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedSection('grammar')}
              className={`px-4 py-2 rounded-lg border ${
                selectedSection === 'grammar'
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              Grammar
            </button>
            <button
              onClick={() => setSelectedSection('vocabulary')}
              className={`px-4 py-2 rounded-lg border ${
                selectedSection === 'vocabulary'
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              Vocabulary
            </button>
            <button
              onClick={() => setSelectedSection('reading')}
              className={`px-4 py-2 rounded-lg border ${
                selectedSection === 'reading'
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              Reading
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {selectedSection === 'grammar' && (
            currentContent.map((item: any, index: number) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">{item.pattern}</h3>
                <div className="space-y-2">
                  <p className="text-lg">{item.example}</p>
                  <p className="text-gray-600">{item.meaning}</p>
                  <p className="text-sm text-gray-500">Usage: {item.usage}</p>
                </div>
              </div>
            ))
          )}

          {selectedSection === 'vocabulary' && (
            currentContent.map((item: any, index: number) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{item.word}</h3>
                    <p className="text-gray-600">{item.reading}</p>
                    <p className="text-gray-500 italic">{item.romaji}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {item.meaning}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">Example: {item.example}</p>
                <p className="text-gray-500 italic">Example (romaji): {item.exampleRomaji}</p>
              </div>
            ))
          )}

          {selectedSection === 'reading' && (
            currentContent.map((item: any, index: number) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <div className="mb-6">
                  <p className="text-lg leading-relaxed">{item.content}</p>
                </div>
                <div className="space-y-4">
                  {item.questions.map((q: any, qIndex: number) => (
                    <div key={qIndex} className="border-t pt-4">
                      <p className="font-medium mb-2">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((option: string, oIndex: number) => (
                          <button
                            key={oIndex}
                            className={`w-full text-left p-2 rounded ${
                              q.correct === oIndex
                                ? 'bg-green-100 text-green-800'
                                : 'bg-white hover:bg-gray-50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Section7; 