export const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
};

export const calculateScore = (isCorrect: boolean, streak: number): number => {
  if (!isCorrect) return 0;
  return Math.min(100, 10 + (streak * 5));
};

export const calculateAverageTime = (currentAverage: number, totalQuestions: number, timeLeft: number): number => {
  return ((currentAverage * totalQuestions) + (30 - timeLeft)) / (totalQuestions + 1);
}; 