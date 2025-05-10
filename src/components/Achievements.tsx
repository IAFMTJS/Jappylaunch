import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (progress: any) => boolean;
  category: 'word' | 'sentence' | 'kanji' | 'hiragana' | 'katakana' | 'general';
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_word',
    title: 'First Steps',
    description: 'Complete your first word practice',
    icon: '🎯',
    condition: (progress) => progress.wordPractice.totalQuestions > 0,
    category: 'word'
  },
  {
    id: 'word_master',
    title: 'Word Master',
    description: 'Complete 100 word practices with 80% accuracy',
    icon: '📚',
    condition: (progress) => 
      progress.wordPractice.totalQuestions >= 100 && 
      (progress.wordPractice.correctAnswers / progress.wordPractice.totalQuestions) >= 0.8,
    category: 'word'
  },
  {
    id: 'sentence_starter',
    title: 'Sentence Builder',
    description: 'Complete your first sentence practice',
    icon: '📝',
    condition: (progress) => progress.sentencePractice.totalQuestions > 0,
    category: 'sentence'
  },
  {
    id: 'sentence_master',
    title: 'Grammar Guru',
    description: 'Complete 50 sentence practices with 75% accuracy',
    icon: '🎓',
    condition: (progress) => 
      progress.sentencePractice.totalQuestions >= 50 && 
      (progress.sentencePractice.correctAnswers / progress.sentencePractice.totalQuestions) >= 0.75,
    category: 'sentence'
  },
  {
    id: 'kanji_beginner',
    title: 'Kanji Explorer',
    description: 'Complete your first kanji practice',
    icon: '🖋️',
    condition: (progress) => progress.kanji.totalQuestions > 0,
    category: 'kanji'
  },
  {
    id: 'kanji_master',
    title: 'Kanji Master',
    description: 'Complete 200 kanji practices with 85% accuracy',
    icon: '🏆',
    condition: (progress) => 
      progress.kanji.totalQuestions >= 200 && 
      (progress.kanji.correctAnswers / progress.kanji.totalQuestions) >= 0.85,
    category: 'kanji'
  },
  {
    id: 'streak_3',
    title: 'On Fire',
    description: 'Maintain a 3-day practice streak',
    icon: '🔥',
    condition: (progress) => {
      const lastAttempt = new Date(progress.kanji.lastAttempt);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return lastAttempt >= threeDaysAgo;
    },
    category: 'general'
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day practice streak',
    icon: '⚔️',
    condition: (progress) => {
      const lastAttempt = new Date(progress.kanji.lastAttempt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return lastAttempt >= sevenDaysAgo;
    },
    category: 'general'
  },
  {
    id: 'hiragana_beginner',
    title: 'Hiragana Explorer',
    description: 'Complete your first hiragana practice',
    icon: 'あ',
    condition: (progress) => progress.hiragana.totalQuestions > 0,
    category: 'hiragana'
  },
  {
    id: 'hiragana_master',
    title: 'Hiragana Master',
    description: 'Complete 100 hiragana practices with 90% accuracy',
    icon: 'あ',
    condition: (progress) => 
      progress.hiragana.totalQuestions >= 100 && 
      (progress.hiragana.correctAnswers / progress.hiragana.totalQuestions) >= 0.9,
    category: 'hiragana'
  },
  {
    id: 'katakana_beginner',
    title: 'Katakana Explorer',
    description: 'Complete your first katakana practice',
    icon: 'ア',
    condition: (progress) => progress.katakana.totalQuestions > 0,
    category: 'katakana'
  },
  {
    id: 'katakana_master',
    title: 'Katakana Master',
    description: 'Complete 100 katakana practices with 90% accuracy',
    icon: 'ア',
    condition: (progress) => 
      progress.katakana.totalQuestions >= 100 && 
      (progress.katakana.correctAnswers / progress.katakana.totalQuestions) >= 0.9,
    category: 'katakana'
  },
  {
    id: 'kana_master',
    title: 'Kana Master',
    description: 'Master both hiragana and katakana with 90% accuracy',
    icon: '🎯',
    condition: (progress) => 
      progress.hiragana.totalQuestions >= 100 && 
      progress.katakana.totalQuestions >= 100 &&
      (progress.hiragana.correctAnswers / progress.hiragana.totalQuestions) >= 0.9 &&
      (progress.katakana.correctAnswers / progress.katakana.totalQuestions) >= 0.9,
    category: 'general'
  },
  {
    id: 'kana_streak_7',
    title: 'Kana Warrior',
    description: 'Practice hiragana or katakana for 7 consecutive days',
    icon: '🔥',
    condition: (progress) => {
      const lastHiragana = new Date(progress.hiragana.lastAttempt);
      const lastKatakana = new Date(progress.katakana.lastAttempt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return lastHiragana >= sevenDaysAgo || lastKatakana >= sevenDaysAgo;
    },
    category: 'general'
  }
];

const Achievements: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const { progress } = useProgress();

  const getThemeClasses = () => {
    if (isDarkMode) {
      return {
        container: 'bg-dark-card',
        text: 'text-dark-text',
        card: 'bg-dark-hover',
        border: 'border-dark-border',
        unlocked: 'bg-green-900/20 border-green-800/30',
        locked: 'bg-gray-900/20 border-gray-800/30',
      };
    }

    switch (theme) {
      case 'blue':
        return {
          container: 'bg-blue-card',
          text: 'text-blue-text',
          card: 'bg-blue-hover',
          border: 'border-blue-border',
          unlocked: 'bg-green-50 border-green-200',
          locked: 'bg-gray-50 border-gray-200',
        };
      case 'green':
        return {
          container: 'bg-green-card',
          text: 'text-green-text',
          card: 'bg-green-hover',
          border: 'border-green-border',
          unlocked: 'bg-green-50 border-green-200',
          locked: 'bg-gray-50 border-gray-200',
        };
      default:
        return {
          container: 'bg-white',
          text: 'text-gray-800',
          card: 'bg-gray-50',
          border: 'border-gray-200',
          unlocked: 'bg-green-50 border-green-200',
          locked: 'bg-gray-50 border-gray-200',
        };
    }
  };

  const themeClasses = getThemeClasses();

  const unlockedAchievements = ACHIEVEMENTS.filter(achievement => achievement.condition(progress));
  const lockedAchievements = ACHIEVEMENTS.filter(achievement => !achievement.condition(progress));

  const renderAchievementCard = (achievement: Achievement, isUnlocked: boolean) => (
    <div
      key={achievement.id}
      className={`p-4 rounded-lg border ${
        isUnlocked ? themeClasses.unlocked : themeClasses.locked
      } transition-all duration-300`}
    >
      <div className="flex items-center space-x-4">
        <div className="text-4xl">{achievement.icon}</div>
        <div>
          <h3 className="font-semibold">{achievement.title}</h3>
          <p className="text-sm opacity-80">{achievement.description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`mb-8 ${themeClasses.container} rounded-lg shadow-md p-6`}>
        <h2 className="text-2xl font-bold mb-6">Achievements</h2>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Unlocked ({unlockedAchievements.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map(achievement => renderAchievementCard(achievement, true))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Locked ({lockedAchievements.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedAchievements.map(achievement => renderAchievementCard(achievement, false))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements; 