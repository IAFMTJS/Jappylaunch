import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import { ProgressItem } from '../types';

interface DayData {
  date: Date;
  practiceCount: number;
  accuracy: number;
  hiraganaPractice: boolean;
  katakanaPractice: boolean;
}

interface SectionProgress {
  totalQuestions: number;
  correctAnswers: number;
  bestStreak: number;
  lastAttempt?: number;
}

const StreakCalendar: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const { progress } = useProgress();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarData, setCalendarData] = useState<DayData[]>([]);

  const getThemeClasses = () => {
    if (isDarkMode) {
      return {
        container: 'bg-dark-card',
        text: 'text-dark-text',
        card: 'bg-dark-hover',
        border: 'border-dark-border',
        calendar: {
          header: 'bg-dark-bg',
          cell: 'bg-dark-hover',
          today: 'bg-primary/20',
          streak: 'bg-green-900/20',
          empty: 'bg-gray-900/20',
        },
      };
    }

    switch (theme) {
      case 'blue':
        return {
          container: 'bg-blue-card',
          text: 'text-blue-text',
          card: 'bg-blue-hover',
          border: 'border-blue-border',
          calendar: {
            header: 'bg-blue-bg',
            cell: 'bg-blue-hover',
            today: 'bg-primary/20',
            streak: 'bg-green-50',
            empty: 'bg-gray-50',
          },
        };
      case 'green':
        return {
          container: 'bg-green-card',
          text: 'text-green-text',
          card: 'bg-green-hover',
          border: 'border-green-border',
          calendar: {
            header: 'bg-green-bg',
            cell: 'bg-green-hover',
            today: 'bg-primary/20',
            streak: 'bg-green-50',
            empty: 'bg-gray-50',
          },
        };
      default:
        return {
          container: 'bg-white',
          text: 'text-gray-800',
          card: 'bg-gray-50',
          border: 'border-gray-200',
          calendar: {
            header: 'bg-gray-50',
            cell: 'bg-white',
            today: 'bg-primary/20',
            streak: 'bg-green-50',
            empty: 'bg-gray-50',
          },
        };
    }
  };

  const themeClasses = getThemeClasses();

  const getProgressData = (): { hiragana: SectionProgress; katakana: SectionProgress } => {
    const defaultSection: SectionProgress = {
      totalQuestions: 0,
      correctAnswers: 0,
      bestStreak: 0
    };

    const convertToSectionProgress = (item: ProgressItem | undefined): SectionProgress => ({
      totalQuestions: item?.totalQuestions ?? 0,
      correctAnswers: item?.correctAnswers ?? 0,
      bestStreak: item?.bestStreak ?? 0,
      lastAttempt: item?.lastAttempt
    });

    return {
      hiragana: convertToSectionProgress(progress.hiragana),
      katakana: convertToSectionProgress(progress.katakana)
    };
  };

  useEffect(() => {
    const generateCalendarData = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfMonth = new Date(year, month, 1).getDay();
      
      const data: DayData[] = [];
      const progressData = getProgressData();
      
      // Add padding for days before the first day of the month
      for (let i = 0; i < firstDayOfMonth; i++) {
        const date = new Date(year, month, -i);
        data.unshift({
          date,
          practiceCount: 0,
          accuracy: 0,
          hiraganaPractice: false,
          katakanaPractice: false
        });
      }
      
      // Add days of the current month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        
        // Check if there was practice on this day
        const hiraganaLastAttempt = progressData.hiragana.lastAttempt 
          ? new Date(progressData.hiragana.lastAttempt).toISOString().split('T')[0]
          : null;
        const katakanaLastAttempt = progressData.katakana.lastAttempt
          ? new Date(progressData.katakana.lastAttempt).toISOString().split('T')[0]
          : null;
        
        const hiraganaPractice = hiraganaLastAttempt === dateStr;
        const katakanaPractice = katakanaLastAttempt === dateStr;
        
        const totalQuestions = (hiraganaPractice ? progressData.hiragana.totalQuestions : 0) +
                             (katakanaPractice ? progressData.katakana.totalQuestions : 0);
        const totalCorrect = (hiraganaPractice ? progressData.hiragana.correctAnswers : 0) +
                           (katakanaPractice ? progressData.katakana.correctAnswers : 0);
        
        data.push({
          date,
          practiceCount: (hiraganaPractice ? 1 : 0) + (katakanaPractice ? 1 : 0),
          accuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
          hiraganaPractice,
          katakanaPractice
        });
      }
      
      // Add padding for days after the last day of the month
      const totalDays = 42; // 6 rows of 7 days
      const remainingDays = totalDays - data.length;
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month + 1, i);
        data.push({
          date,
          practiceCount: 0,
          accuracy: 0,
          hiraganaPractice: false,
          katakanaPractice: false
        });
      }
      
      setCalendarData(data);
    };

    generateCalendarData();
  }, [currentMonth, progress]);

  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getDayName = (day: number) => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isInCurrentMonth = (date: Date) => {
    return (
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  };

  const getCellClass = (day: DayData) => {
    const today = new Date();
    const isToday = day.date.toDateString() === today.toDateString();
    
    if (!isInCurrentMonth(day.date)) {
      return themeClasses.calendar.empty;
    }
    
    if (isToday) {
      return themeClasses.calendar.today;
    }
    
    if (day.practiceCount > 0) {
      return themeClasses.calendar.streak;
    }
    
    return themeClasses.calendar.cell;
  };

  const changeMonth = (delta: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`mb-8 ${themeClasses.container} rounded-lg shadow-md p-6`}>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold">{getMonthName(currentMonth)}</h2>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className={`text-center font-semibold p-2 ${themeClasses.calendar.header}`}
            >
              {getDayName(i)}
            </div>
          ))}

          {calendarData.map((day, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg border ${themeClasses.border} ${getCellClass(day)}`}
            >
              <div className="text-sm">{day.date.getDate()}</div>
              {isInCurrentMonth(day.date) && day.practiceCount > 0 && (
                <div className="text-xs mt-1">
                  <div className="flex items-center justify-between">
                    <span>Hiragana: {day.hiraganaPractice ? '✓' : '✗'}</span>
                    <span>Katakana: {day.katakanaPractice ? '✓' : '✗'}</span>
                  </div>
                  <div className="mt-1">Accuracy: {Math.round(day.accuracy)}%</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-primary/20 mr-2" />
            <span>Today</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-50 mr-2" />
            <span>Practice Day</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-50 mr-2" />
            <span>No Practice</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar; 