import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { getWordsForLevel } from '../data/wordLevels';

interface ExamSectionProps {
  level: number;
  onAdvanceLevel: () => void;
}

export const ExamSection: React.FC<ExamSectionProps> = ({ level, onAdvanceLevel }) => {
  const words = getWordsForLevel(level);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAdvance, setShowAdvance] = useState(false);
  const [questionType, setQuestionType] = useState<'mc' | 'writing' | 'story'>('mc');
  const [story, setStory] = useState<{ context: string; question: string; answer: string } | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (started && current < words.length) {
      const types: ('mc' | 'writing' | 'story')[] = ['mc', 'writing', 'story'];
      const type = types[Math.floor(Math.random() * types.length)];
      setQuestionType(type);
      setUserAnswer('');
      setStory(null);
      if (type === 'mc') {
        const correct = words[current].english;
        const wrong = words.filter((w, i) => i !== current).sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.english);
        setOptions([...wrong, correct].sort(() => 0.5 - Math.random()));
      } else if (type === 'story') {
        const contextWord = words[current];
        const other = words.filter((w, i) => i !== current);
        const randomOther = other[Math.floor(Math.random() * other.length)];
        const context = `たろうは${contextWord.japanese}を${randomOther ? `見ました。` : `使いました。`}`;
        const question = `${contextWord.english} means...?`;
        setStory({ context, question, answer: contextWord.english });
      }
    }
  }, [started, current, words]);

  const handleSubmit = () => {
    let correct = false;
    if (questionType === 'mc') {
      correct = userAnswer === words[current].english;
    } else if (questionType === 'writing') {
      correct = userAnswer.trim().toLowerCase() === words[current].english.trim().toLowerCase();
    } else if (questionType === 'story' && story) {
      correct = userAnswer.trim().toLowerCase() === story.answer.trim().toLowerCase();
    }
    if (correct) setScore(s => s + 1);
    if (current + 1 < words.length) {
      setCurrent(c => c + 1);
    } else {
      setFinished(true);
      if (correct && score + 1 === words.length) setShowAdvance(true);
      else if (score === words.length) setShowAdvance(true);
    }
  };

  if (!started) return <Button onClick={() => setStarted(true)}>Start Exam</Button>;
  if (finished) return (
    <Box>
      <Typography variant="h6">Exam Complete!</Typography>
      <Typography>Your score: {score} / {words.length}</Typography>
      {showAdvance ? (
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={onAdvanceLevel}>Advance to Next Level</Button>
          <Button sx={{ ml: 2 }} variant="outlined" onClick={() => setShowAdvance(false)}>Decline</Button>
        </Box>
      ) : (
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => { setStarted(false); setFinished(false); setScore(0); setCurrent(0); }}>Retake Exam</Button>
      )}
    </Box>
  );

  const word = words[current];
  return (
    <Box>
      <Typography variant="subtitle1">Question {current + 1} of {words.length}</Typography>
      {questionType === 'mc' && (
        <>
          <Typography variant="h6">What is the meaning of "{word.japanese}"?</Typography>
          <Box sx={{ mt: 2 }}>
            {options.map(opt => (
              <Button key={opt} variant={userAnswer === opt ? 'contained' : 'outlined'} sx={{ mr: 1, mb: 1 }} onClick={() => setUserAnswer(opt)}>{opt}</Button>
            ))}
          </Box>
        </>
      )}
      {questionType === 'writing' && (
        <>
          <Typography variant="h6">Type the English meaning for "{word.japanese}"</Typography>
          <Box sx={{ mt: 2 }}>
            <input value={userAnswer} onChange={e => setUserAnswer(e.target.value)} style={{ fontSize: 18, padding: 8, width: 300 }} />
          </Box>
        </>
      )}
      {questionType === 'story' && story && (
        <>
          <Typography variant="h6">Story:</Typography>
          <Typography sx={{ mb: 2 }}>{story.context}</Typography>
          <Typography>{story.question}</Typography>
          <Box sx={{ mt: 2 }}>
            <input value={userAnswer} onChange={e => setUserAnswer(e.target.value)} style={{ fontSize: 18, padding: 8, width: 300 }} />
          </Box>
        </>
      )}
      <Button sx={{ mt: 3 }} variant="contained" onClick={handleSubmit} disabled={!userAnswer}>Submit</Button>
    </Box>
  );
} 