import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface LearningStats {
  date: string;
  mastered: number;
  attempted: number;
  accuracy: number;
}

interface ProgressData {
  hiragana: LearningStats[];
  katakana: LearningStats[];
  kanji: LearningStats[];
}

interface PieChartData {
  name: string;
  value: number;
}

interface PieChartLabelProps {
  name: string;
  percent: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const LearningProgress: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { progress } = useProgress();
  const [stats, setStats] = useState<ProgressData>({
    hiragana: [],
    katakana: [],
    kanji: []
  });
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    // Process progress data into statistics
    const processProgress = () => {
      const now = new Date();
      const ranges = {
        week: 7,
        month: 30,
        year: 365
      };
      const days = ranges[timeRange];
      
      const newStats: ProgressData = {
        hiragana: [],
        katakana: [],
        kanji: []
      };

      // Generate date range
      const dates = Array.from({ length: days }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (days - i - 1));
        return date.toISOString().split('T')[0];
      });

      // Process each mode
      ['hiragana', 'katakana', 'kanji'].forEach(mode => {
        const modeStats = dates.map(date => {
          const dayProgress = progress[mode] || {
            totalQuestions: 0,
            correctAnswers: 0,
            masteredIds: new Set(),
            lastAttempt: date
          };

          return {
            date,
            mastered: dayProgress.masteredIds?.size || 0,
            attempted: dayProgress.totalQuestions || 0,
            accuracy: dayProgress.totalQuestions 
              ? (dayProgress.correctAnswers / dayProgress.totalQuestions) * 100 
              : 0
          };
        });

        newStats[mode as keyof ProgressData] = modeStats;
      });

      setStats(newStats);
    };

    processProgress();
  }, [progress, timeRange]);

  const renderLineChart = (data: LearningStats[], title: string) => (
    <div className={`p-4 rounded-lg ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } shadow-md`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>
        {title} Progress
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#4a5568' : '#e2e8f0'} />
            <XAxis 
              dataKey="date" 
              stroke={isDarkMode ? '#a0aec0' : '#4a5568'}
              tick={{ fill: isDarkMode ? '#a0aec0' : '#4a5568' }}
            />
            <YAxis 
              stroke={isDarkMode ? '#a0aec0' : '#4a5568'}
              tick={{ fill: isDarkMode ? '#a0aec0' : '#4a5568' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="mastered" 
              stroke="#0088FE" 
              name="Mastered Items"
            />
            <Line 
              type="monotone" 
              dataKey="attempted" 
              stroke="#00C49F" 
              name="Attempted Items"
            />
            <Line 
              type="monotone" 
              dataKey="accuracy" 
              stroke="#FFBB28" 
              name="Accuracy %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderPieChart = () => {
    const totalMastered = {
      hiragana: stats.hiragana[stats.hiragana.length - 1]?.mastered || 0,
      katakana: stats.katakana[stats.katakana.length - 1]?.mastered || 0,
      kanji: stats.kanji[stats.kanji.length - 1]?.mastered || 0
    };

    const data: PieChartData[] = [
      { name: 'Hiragana', value: totalMastered.hiragana },
      { name: 'Katakana', value: totalMastered.katakana },
      { name: 'Kanji', value: totalMastered.kanji }
    ];

    return (
      <div className={`p-4 rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-md`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Mastery Distribution
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: PieChartLabelProps) => 
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Learning Progress
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
          className={`px-4 py-2 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-700 text-white border-gray-600' 
              : 'bg-white text-gray-800 border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderLineChart(stats.hiragana, 'Hiragana')}
        {renderLineChart(stats.katakana, 'Katakana')}
        {renderLineChart(stats.kanji, 'Kanji')}
        {renderPieChart()}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {['hiragana', 'katakana', 'kanji'].map(mode => {
          const latest = stats[mode as keyof ProgressData][stats[mode as keyof ProgressData].length - 1];
          return (
            <div
              key={mode}
              className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-md`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)} Summary
              </h3>
              <div className="space-y-2">
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Mastered Items: {latest?.mastered || 0}
                </p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Attempted Today: {latest?.attempted || 0}
                </p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Accuracy: {latest?.accuracy.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningProgress; 