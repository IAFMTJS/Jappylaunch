import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  WritingMode, 
  PracticeType, 
  InputMode, 
  DisplayMode, 
  PracticeState, 
  StrokeValidationResult, 
  PracticeContentItem, 
  CharacterStroke,
  Stroke,
  StrokePoint,
  StrokeFeedback,
  QuizWord
} from '../types/writing';
import WritingCanvas from './WritingCanvas';
import WritingControls from './WritingControls';
import WritingFeedback from './WritingFeedback';
import { hiraganaWords, katakanaWords } from '../data/kanaData';
import { quizWords } from '../data/quizData';

// Helper function to validate strokes
const validateStroke = (stroke: Stroke, expectedItem: PracticeContentItem): StrokeValidationResult => {
  const expectedStroke = expectedItem.strokeOrder.strokes[0]; // For now, just validate against first stroke
  if (!expectedStroke) {
    return {
      isCorrect: false,
      accuracy: 0,
      feedback: {
        direction: 'correct',
        length: 'correct',
        angle: 'correct',
        order: 'wrong_order',
        pressure: 'correct'
      },
      expectedStroke,
      actualStroke: stroke
    };
  }

  // Calculate accuracy based on various factors
  const directionAccuracy = calculateDirectionAccuracy(stroke, expectedStroke);
  const lengthAccuracy = calculateLengthAccuracy(stroke, expectedStroke);
  const angleAccuracy = calculateAngleAccuracy(stroke, expectedStroke);
  const pressureAccuracy = calculatePressureAccuracy(stroke, expectedStroke);

  const accuracy = (directionAccuracy + lengthAccuracy + angleAccuracy + pressureAccuracy) / 4;

  return {
    isCorrect: accuracy >= 0.8,
    accuracy,
    feedback: {
      direction: determineDirectionFeedback(stroke, expectedStroke),
      length: determineLengthFeedback(stroke, expectedStroke),
      angle: determineAngleFeedback(stroke, expectedStroke),
      order: 'correct', // For now, we're only validating single strokes
      pressure: determinePressureFeedback(stroke, expectedStroke)
    },
    expectedStroke,
    actualStroke: stroke
  };
};

// Helper functions for stroke validation
const calculateDirectionAccuracy = (actual: Stroke, expected: Stroke): number => {
  const actualAngle = actual.angle;
  const expectedAngle = expected.angle;
  const angleDiff = Math.abs(actualAngle - expectedAngle);
  return Math.max(0, 1 - angleDiff / 45); // 45 degrees tolerance
};

const calculateLengthAccuracy = (actual: Stroke, expected: Stroke): number => {
  const lengthRatio = actual.length / expected.length;
  return Math.max(0, 1 - Math.abs(1 - lengthRatio));
};

const calculateAngleAccuracy = (actual: Stroke, expected: Stroke): number => {
  const angleDiff = Math.abs(actual.angle - expected.angle);
  return Math.max(0, 1 - angleDiff / 30); // 30 degrees tolerance
};

const calculatePressureAccuracy = (actual: Stroke, expected: Stroke): number => {
  const avgActualPressure = actual.points.reduce((sum: number, p: StrokePoint) => sum + (p.pressure || 0.5), 0) / actual.points.length;
  const avgExpectedPressure = expected.points.reduce((sum: number, p: StrokePoint) => sum + (p.pressure || 0.5), 0) / expected.points.length;
  return Math.max(0, 1 - Math.abs(avgActualPressure - avgExpectedPressure));
};

const determineDirectionFeedback = (actual: Stroke, expected: Stroke): StrokeValidationResult['feedback']['direction'] => {
  const angleDiff = actual.angle - expected.angle;
  if (Math.abs(angleDiff) < 15) return 'correct';
  if (angleDiff > 0) return 'too_right';
  return 'too_left';
};

const determineLengthFeedback = (actual: Stroke, expected: Stroke): StrokeValidationResult['feedback']['length'] => {
  const lengthRatio = actual.length / expected.length;
  if (lengthRatio > 0.9 && lengthRatio < 1.1) return 'correct';
  if (lengthRatio < 0.9) return 'too_short';
  return 'too_long';
};

const determineAngleFeedback = (actual: Stroke, expected: Stroke): StrokeValidationResult['feedback']['angle'] => {
  const angleDiff = Math.abs(actual.angle - expected.angle);
  if (angleDiff < 15) return 'correct';
  if (angleDiff > 30) return 'too_steep';
  return 'too_shallow';
};

const determinePressureFeedback = (actual: Stroke, expected: Stroke): StrokeValidationResult['feedback']['pressure'] => {
  const avgActualPressure = actual.points.reduce((sum, p) => sum + (p.pressure || 0.5), 0) / actual.points.length;
  const avgExpectedPressure = expected.points.reduce((sum, p) => sum + (p.pressure || 0.5), 0) / expected.points.length;
  const pressureDiff = Math.abs(avgActualPressure - avgExpectedPressure);
  if (pressureDiff < 0.2) return 'correct';
  if (avgActualPressure < avgExpectedPressure) return 'too_light';
  return 'too_heavy';
};

// Helper function to convert QuizWord to PracticeContentItem
const convertToPracticeItem = (word: QuizWord): PracticeContentItem => {
  // Create a basic stroke order for the word
  const basicStroke: Stroke = {
    type: 'horizontal',
    points: [],
    startPoint: { x: 0, y: 0, timestamp: Date.now() },
    endPoint: { x: 0, y: 0, timestamp: Date.now() },
    direction: 'left-to-right',
    length: 0,
    angle: 0
  };

  const characterStroke: CharacterStroke = {
    character: word.japanese,
    strokes: [basicStroke],
    strokeOrder: [0],
    commonMistakes: [],
    difficulty: word.difficulty
  };

  return {
    ...word,
    strokeOrder: characterStroke
  };
};

const WritingPractice: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [mode, setMode] = useState<WritingMode>('hiragana');
  const [practiceType, setPracticeType] = useState<PracticeType>('copy');
  const [inputMode, setInputMode] = useState<InputMode>('draw');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('japanese');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [showStrokeGuide, setShowStrokeGuide] = useState(true);
  const [requireTranslation, setRequireTranslation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const [practiceState, setPracticeState] = useState<PracticeState>({
    currentIndex: 0,
    totalItems: 0,
    score: 0,
    streak: 0,
    currentItem: null,
    userInput: '',
    strokeFeedback: null,
    progress: {
      correctStrokes: 0,
      totalStrokes: 0,
      timeSpent: 0,
      mistakes: []
    },
    history: []
  });

  // Get practice items based on mode, practice type, and difficulty
  const getPracticeItems = useCallback(() => {
    let items: QuizWord[] = [];
    
    switch (practiceType) {
      case 'copy':
        items = mode === 'hiragana' ? hiraganaWords : katakanaWords;
        break;
      case 'convert':
        items = quizWords.filter(word => 
          word.isHiragana && word.isKatakana && word.difficulty === difficulty
        );
        break;
      case 'translate':
        items = quizWords.filter(word => 
          (mode === 'hiragana' ? word.isHiragana : word.isKatakana) && 
          word.difficulty === difficulty
        );
        break;
    }

    // Convert QuizWords to PracticeContentItems
    return items
      .filter(item => item.difficulty === difficulty)
      .map(convertToPracticeItem);
  }, [mode, practiceType, difficulty]);

  // Handle next item
  const handleNext = useCallback(() => {
    const items = getPracticeItems();
    const nextIndex = (practiceState.currentIndex + 1) % items.length;
    setPracticeState(prev => ({
      ...prev,
      currentIndex: nextIndex,
      currentItem: items[nextIndex],
      userInput: '',
      strokeFeedback: null,
      progress: {
        ...prev.progress,
        timeSpent: 0,
        totalStrokes: items[nextIndex]?.strokeOrder?.strokes?.length || 0
      }
    }));
    setUserInput('');
    setIsCorrect(null);
    setFeedbackMessage('');
    setShowHint(false);
  }, [getPracticeItems, practiceState.currentIndex]);

  // Initialize practice
  const initializePractice = useCallback(() => {
    const items = getPracticeItems();
    setPracticeState(prev => ({
      ...prev,
      currentIndex: 0,
      totalItems: items.length,
      currentItem: items[0] || null,
      userInput: '',
      strokeFeedback: null,
      progress: {
        ...prev.progress,
        totalStrokes: items[0]?.strokeOrder?.length || 0
      }
    }));
    setUserInput('');
    setIsCorrect(null);
    setFeedbackMessage('');
  }, [getPracticeItems]);

  // Initialize practice when mode, practice type, or difficulty changes
  useEffect(() => {
    initializePractice();
  }, [mode, practiceType, difficulty, initializePractice]);

  // Update stroke feedback type
  const handleStrokeFeedback = useCallback((stroke: Stroke) => {
    if (!practiceState.currentItem) return;

    const validationResult = validateStroke(stroke, practiceState.currentItem);
    const feedback: StrokeFeedback = {
      accuracy: validationResult.accuracy,
      direction: validationResult.feedback.direction,
      length: validationResult.feedback.length,
      angle: validationResult.feedback.angle,
      points: stroke.points,
      isCorrect: validationResult.isCorrect,
      feedback: validationResult.feedback,
      expectedStroke: validationResult.expectedStroke,
      actualStroke: validationResult.actualStroke
    };
    
    setPracticeState(prev => ({
      ...prev,
      strokeFeedback: feedback as StrokeFeedback,
      progress: {
        ...prev.progress,
        correctStrokes: validationResult.isCorrect ? prev.progress.correctStrokes + 1 : prev.progress.correctStrokes,
        mistakes: validationResult.isCorrect ? prev.progress.mistakes : [
          ...prev.progress.mistakes,
          {
            character: practiceState.currentItem?.japanese || '',
            stroke: prev.currentIndex,
            error: validationResult.feedback.direction
          }
        ]
      }
    }));

    // Update score and streak
    if (validationResult.isCorrect) {
      setPracticeState(prev => ({
        ...prev,
        score: prev.score + 1,
        streak: prev.streak + 1
      }));
    } else {
      setPracticeState(prev => ({
        ...prev,
        streak: 0
      }));
    }
  }, [practiceState.currentItem]);

  // Validate user input based on practice type
  const validateInput = useCallback(() => {
    if (!practiceState.currentItem) return false;

    const currentItem = practiceState.currentItem;
    let isValid = false;
    let message = '';

    switch (practiceType) {
      case 'copy':
        isValid = userInput === currentItem.japanese;
        message = isValid ? 'Correct!' : 'Try again';
        break;
      case 'convert':
        const expectedOutput = mode === 'hiragana' ? 
          currentItem.japanese.replace(/[ァ-ン]/g, char => {
            const katakanaToHiragana: { [key: string]: string } = {
              'ァ': 'ぁ', 'ィ': 'ぃ', 'ゥ': 'ぅ', 'ェ': 'ぇ', 'ォ': 'ぉ',
              // Add more katakana to hiragana mappings
            };
            return katakanaToHiragana[char] || char;
          }) :
          currentItem.japanese.replace(/[ぁ-ん]/g, char => {
            const hiraganaToKatakana: { [key: string]: string } = {
              'ぁ': 'ァ', 'ぃ': 'ィ', 'ぅ': 'ゥ', 'ぇ': 'ェ', 'ぉ': 'ォ',
              // Add more hiragana to katakana mappings
            };
            return hiraganaToKatakana[char] || char;
          });
        isValid = userInput === expectedOutput;
        message = isValid ? 'Correct conversion!' : 'Check your conversion';
        break;
      case 'translate':
        isValid = userInput === currentItem.japanese;
        message = isValid ? 'Correct translation!' : 'Check your translation';
        break;
    }

    setIsCorrect(isValid);
    setFeedbackMessage(message);
    return isValid;
  }, [practiceType, mode, userInput, practiceState.currentItem]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    const isValid = validateInput();
    if (isValid) {
      // Add to history
      setPracticeState(prev => ({
        ...prev,
        history: [
          ...prev.history,
          {
            date: new Date().toISOString(),
            score: prev.score,
            items: [
              ...(prev.history[prev.history.length - 1]?.items || []),
              {
                character: practiceState.currentItem?.japanese || '',
                success: true,
                timeSpent: Date.now() - prev.progress.timeSpent
              }
            ]
          }
        ]
      }));
      handleNext();
    }
  }, [validateInput, practiceState.currentItem, handleNext]);

  // Handle canvas clear
  const handleClear = useCallback(() => {
    setPracticeState(prev => ({
      ...prev,
      userInput: '',
      strokeFeedback: null
    }));
    setUserInput('');
    setIsCorrect(null);
    setFeedbackMessage('');
  }, []);

  // Render practice content based on mode and practice type
  const renderPracticeContent = useMemo(() => {
    if (!practiceState.currentItem) return null;

    const { japanese, english, romaji } = practiceState.currentItem;

    switch (practiceType) {
      case 'copy':
        return (
          <div className="text-center text-4xl font-bold mb-4">
            {displayMode === 'japanese' ? japanese :
             displayMode === 'romaji' ? romaji :
             english}
          </div>
        );
      case 'convert':
        return (
          <div className="space-y-4">
            <div className="text-center text-2xl">
              {mode === 'hiragana' ? 'Convert to Hiragana:' : 'Convert to Katakana:'}
            </div>
            <div className="text-center text-4xl font-bold mb-4">
              {displayMode === 'japanese' ? japanese :
               displayMode === 'romaji' ? romaji :
               english}
            </div>
          </div>
        );
      case 'translate':
        return (
          <div className="space-y-4">
            <div className="text-center text-2xl">
              Translate to {mode === 'hiragana' ? 'Hiragana' : 'Katakana'}:
            </div>
            <div className="text-center text-4xl font-bold mb-4">
              {displayMode === 'english' ? english :
               displayMode === 'romaji' ? romaji :
               japanese}
            </div>
          </div>
        );
    }
  }, [practiceType, mode, displayMode, practiceState.currentItem]);

  return (
    <div className={`p-4 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Controls */}
        <WritingControls
          mode={mode}
          practiceType={practiceType}
          inputMode={inputMode}
          displayMode={displayMode}
          difficulty={difficulty}
          showStrokeGuide={showStrokeGuide}
          requireTranslation={requireTranslation}
          onModeChange={setMode}
          onPracticeTypeChange={setPracticeType}
          onInputModeChange={setInputMode}
          onDisplayModeChange={setDisplayMode}
          onDifficultyChange={setDifficulty}
          onStrokeGuideToggle={() => setShowStrokeGuide(prev => !prev)}
          onTranslationToggle={() => setRequireTranslation(prev => !prev)}
          onClear={handleClear}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isDarkMode={isDarkMode}
        />

        {/* Main Practice Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Practice Content */}
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {renderPracticeContent}
            
            {/* Input Area */}
            {inputMode === 'type' && (
              <div className="mt-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className={`w-full p-2 rounded ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                  } ${isCorrect === true ? 'border-green-500' : isCorrect === false ? 'border-red-500' : ''}`}
                  placeholder="Type your answer..."
                />
                {feedbackMessage && (
                  <div className={`mt-2 text-sm ${
                    isCorrect ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {feedbackMessage}
                  </div>
                )}
              </div>
            )}

            {/* Canvas */}
            {inputMode === 'draw' && (
              <WritingCanvas
                width={400}
                height={400}
                isDarkMode={isDarkMode}
                showStrokeGuide={showStrokeGuide}
                characterStroke={practiceState.currentItem?.strokeOrder}
                currentStroke={0}
                onStrokeComplete={handleStrokeFeedback}
                onDrawingStart={() => {}}
                onDrawingEnd={() => {}}
                onClear={handleClear}
              />
            )}
          </div>

          {/* Feedback */}
          <WritingFeedback
            feedback={practiceState.strokeFeedback}
            practiceState={practiceState}
            isDarkMode={isDarkMode}
            showHint={showHint}
            onHintToggle={() => setShowHint(prev => !prev)}
          />
        </div>
      </div>
    </div>
  );
};

export default WritingPractice;
