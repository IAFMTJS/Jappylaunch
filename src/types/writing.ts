export type StrokeType = 
  | 'horizontal' 
  | 'vertical' 
  | 'diagonal' 
  | 'curve'
  | 'hook'
  | 'dot'
  | 'cross'
  | 'complex';
export type WritingMode = 'hiragana' | 'katakana';
export type PracticeType = 'copy' | 'convert' | 'translate';
export type InputMode = 'draw' | 'type';
export type DisplayMode = 'japanese' | 'romaji' | 'english';

export type Category = 'food' | 'animals' | 'colors' | 'numbers' | 'family' | 'weather' | 'time' | 
  'transportation' | 'clothing' | 'body' | 'emotions' | 'school' | 'work' | 'hobbies' | 'nature' | 
  'house' | 'city' | 'technology' | 'health' | 'hiragana' | 'katakana' | 'all';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface StrokeFeedback {
  accuracy: number;
  direction: 'correct' | 'too_left' | 'too_right' | 'too_up' | 'too_down';
  length: 'correct' | 'too_short' | 'too_long';
  angle: 'correct' | 'too_steep' | 'too_shallow';
  points: { x: number; y: number }[];
  isCorrect: boolean;
  feedback: StrokeValidationResult['feedback'];
  expectedStroke: Stroke;
  actualStroke: Stroke;
}

export interface QuizWord {
  japanese: string;
  english: string;
  category: Category;
  difficulty: Difficulty;
  hint?: string;
  romaji?: string;
  isHiragana: boolean;
  isKatakana: boolean;
  strokeOrder?: CharacterStroke;
}

export interface PracticeContentItem extends QuizWord {
  strokeOrder: CharacterStroke;
}

export interface StrokePoint {
  x: number;
  y: number;
  pressure?: number;
  timestamp: number;
}

export interface Stroke {
  type: StrokeType;
  points: StrokePoint[];
  startPoint: StrokePoint;
  endPoint: StrokePoint;
  direction: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top' | 'diagonal';
  length: number;
  angle: number;
}

export interface CharacterStroke {
  character: string;
  strokes: Stroke[];
  strokeOrder: number[];
  commonMistakes: string[];
  difficulty: Difficulty;
  length?: number;
  jlptLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
}

export interface StrokeValidationResult {
  accuracy: number;
  isCorrect: boolean;
  feedback: {
    direction: string;
    length: string;
    angle: string;
    pressure: string;
  };
  expectedStroke: Stroke;
  actualStroke: Stroke;
  direction?: string;
  length?: string;
  angle?: string;
  points?: StrokePoint[];
}

export interface PracticeState {
  currentIndex: number;
  totalItems: number;
  score: number;
  streak: number;
  currentItem: PracticeContentItem | null;
  userInput: string;
  strokeFeedback: StrokeValidationResult | null;
  progress: {
    correctStrokes: number;
    totalStrokes: number;
    timeSpent: number;
    mistakes: {
      character: string;
      stroke: number;
      error: string;
    }[];
  };
  history: {
    date: string;
    score: number;
    items: {
      character: string;
      success: boolean;
      timeSpent: number;
    }[];
  }[];
}

export interface WritingCanvasProps {
  width: number;
  height: number;
  isDarkMode: boolean;
  showStrokeGuide: boolean;
  strokeOrder: { type: StrokeType; points: { x: number; y: number }[] }[];
  currentStroke: number;
  onStrokeComplete: (points: { x: number; y: number }[]) => void;
  onClear: () => void;
} 