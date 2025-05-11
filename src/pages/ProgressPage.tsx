import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Dictionary from '../components/Dictionary';
import LearningProgress from '../components/LearningProgress';
import { downloadOfflineData } from '../utils/offlineData';

type TabType = 'progress' | 'dictionary';

const ProgressPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('progress');
  const [dictionaryMode, setDictionaryMode] = useState<'hiragana' | 'katakana' | 'kanji'>('hiragana');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadOfflineData = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    setDownloadSuccess(false);
    try {
      await downloadOfflineData();
      setDownloadSuccess(true);
    } catch (err) {
      setDownloadError('Er is een fout opgetreden bij het downloaden van de offline data.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Learning Dashboard
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'progress'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Progress
            </button>
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'dictionary'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Dictionary
            </button>
          </div>
        </div>
        <div className="mb-4 flex items-center gap-4">
          <button
            onClick={handleDownloadOfflineData}
            disabled={isDownloading}
            className={`px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors ${isDownloading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isDownloading ? 'Downloading...' : 'Download Offline Data'}
          </button>
          {downloadSuccess && <span className="text-green-600 font-semibold">Offline data opgeslagen!</span>}
          {downloadError && <span className="text-red-600 font-semibold">{downloadError}</span>}
        </div>

        {activeTab === 'dictionary' && (
          <div className="flex gap-4 mb-4">
            {(['hiragana', 'katakana', 'kanji'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setDictionaryMode(mode)}
                className={`px-4 py-2 rounded-lg ${
                  dictionaryMode === mode
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeTab === 'progress' ? (
        <LearningProgress />
      ) : (
        <Dictionary mode={dictionaryMode} />
      )}
    </div>
  );
};

export default ProgressPage; 