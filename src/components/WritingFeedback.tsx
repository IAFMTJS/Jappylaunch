import React from 'react';
import { StrokeFeedback, PracticeState } from '../types/writing';

interface WritingFeedbackProps {
  feedback: StrokeFeedback | null;
  practiceState: PracticeState;
  isDarkMode: boolean;
  showHint: boolean;
  onHintToggle: () => void;
}

const WritingFeedback: React.FC<WritingFeedbackProps> = ({
  feedback,
  practiceState,
  isDarkMode,
  showHint,
  onHintToggle
}) => {
  const getFeedbackColor = (accuracy: number) => {
    if (accuracy >= 0.9) return 'text-green-500';
    if (accuracy >= 0.7) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getFeedbackMessage = (feedback: StrokeFeedback) => {
    const messages = [];
    if (feedback.accuracy < 0.7) {
      messages.push('Try to follow the stroke guide more closely');
    }
    if (feedback.direction !== 'correct') {
      messages.push(`Stroke direction should be ${feedback.direction}`);
    }
    if (feedback.length !== 'correct') {
      messages.push(`Stroke length should be ${feedback.length}`);
    }
    if (feedback.angle !== 'correct') {
      messages.push(`Stroke angle should be ${feedback.angle}`);
    }
    return messages.join('. ');
  };

  return (
    <div className={`space-y-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      {/* Score Display */}
      <div className="flex justify-between items-center">
        <div className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Score: {practiceState.score}
        </div>
        <button
          onClick={onHintToggle}
          className={`px-3 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'} hover:bg-gray-300`}
        >
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>
      </div>

      {/* Current Progress */}
      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Progress: {practiceState.currentIndex + 1} / {practiceState.totalItems}
      </div>

      {/* Stroke Feedback */}
      {feedback && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className={`font-medium ${getFeedbackColor(feedback.accuracy)}`}>
              Accuracy: {Math.round(feedback.accuracy * 100)}%
            </span>
          </div>
          
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {getFeedbackMessage(feedback)}
          </div>

          {/* Stroke Details */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Direction: <span className={getFeedbackColor(feedback.direction === 'correct' ? 1 : 0)}>
                {feedback.direction}
              </span>
            </div>
            <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Length: <span className={getFeedbackColor(feedback.length === 'correct' ? 1 : 0)}>
                {feedback.length}
              </span>
            </div>
            <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Angle: <span className={getFeedbackColor(feedback.angle === 'correct' ? 1 : 0)}>
                {feedback.angle}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hint Display */}
      {showHint && practiceState.currentItem && (
        <div className={`mt-4 p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Hint:
          </div>
          <div className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {practiceState.currentItem.hint || 'No hint available'}
          </div>
        </div>
      )}

      {/* Streak Display */}
      {practiceState.streak > 0 && (
        <div className={`text-center font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
          {practiceState.streak} in a row! 🔥
        </div>
      )}
    </div>
  );
};

export default WritingFeedback; 