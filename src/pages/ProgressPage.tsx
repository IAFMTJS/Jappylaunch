import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Dictionary from '../components/Dictionary';
import LearningProgress from '../components/LearningProgress';
import { downloadOfflineData } from '../utils/offlineData';
import { useProgress } from '../context/ProgressContext';

type TabType = 'progress' | 'dictionary';

const ProgressPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('progress');
  const [dictionaryMode, setDictionaryMode] = useState<'hiragana' | 'katakana' | 'kanji'>('hiragana');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Progress context for sync/backup/restore
  const {
    syncProgress,
    isSyncing,
    isOnline,
    createDataBackup,
    restoreDataBackup,
    error: progressError,
    lastSyncTime
  } = useProgress();

  const [backupData, setBackupData] = useState<string>('');
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);

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

  // Manual sync handler
  const handleManualSync = async () => {
    setBackupStatus(null);
    setRestoreStatus(null);
    try {
      await syncProgress();
      setBackupStatus('Progress synced!');
    } catch (err) {
      setBackupStatus('Sync failed.');
    }
  };

  // Manual backup handler
  const handleBackup = async () => {
    setBackupStatus(null);
    setRestoreStatus(null);
    try {
      const backup = await createDataBackup();
      setBackupData(JSON.stringify(backup, null, 2));
      setBackupStatus('Backup created! You can copy or download the data below.');
    } catch (err) {
      setBackupStatus('Backup failed.');
    }
  };

  // Manual restore handler
  const handleRestore = async () => {
    setBackupStatus(null);
    setRestoreStatus(null);
    setRestoreError(null);
    try {
      const parsed = JSON.parse(backupData);
      await restoreDataBackup(parsed);
      setRestoreStatus('Restore successful!');
    } catch (err) {
      setRestoreError('Restore failed. Please check your backup data.');
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

        {/* Manual Sync/Backup/Restore UI */}
        {activeTab === 'progress' && (
          <div className="mb-6 p-4 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-800">
            <div className="flex flex-wrap gap-4 items-center mb-2">
              <button
                onClick={handleManualSync}
                disabled={isSyncing || !isOnline}
                className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors ${isSyncing || !isOnline ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isSyncing ? 'Syncing...' : 'Sync Progress'}
              </button>
              <button
                onClick={handleBackup}
                className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
              >
                Create Backup
              </button>
              <button
                onClick={handleRestore}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                Restore Backup
              </button>
              <span className="text-xs text-gray-500 ml-2">
                {isOnline ? 'Online' : 'Offline'}
                {lastSyncTime && (
                  <> | Last Sync: {new Date(lastSyncTime).toLocaleString()}</>
                )}
              </span>
            </div>
            {progressError && <div className="text-red-600 text-sm mb-2">{progressError}</div>}
            {backupStatus && <div className="text-green-700 text-sm mb-2">{backupStatus}</div>}
            {restoreStatus && <div className="text-green-700 text-sm mb-2">{restoreStatus}</div>}
            {restoreError && <div className="text-red-600 text-sm mb-2">{restoreError}</div>}
            <textarea
              className="w-full h-32 p-2 border rounded mt-2 text-xs bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              value={backupData}
              onChange={e => setBackupData(e.target.value)}
              placeholder="Backup data will appear here. Paste backup JSON to restore."
            />
          </div>
        )}

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