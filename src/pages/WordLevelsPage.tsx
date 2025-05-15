import React, { useState } from 'react';
import { WordLevelProvider, useWordLevel } from '../context/WordLevelContext';
import WordLevelManager from '../components/WordLevelManager';
import WordLevelPractice from '../components/WordLevelPractice';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper
} from '@mui/material';
import { ExamSection } from '../components/ExamSection';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`word-level-tabpanel-${index}`}
      aria-labelledby={`word-level-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const WordLevelsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { userProgress, updateUserProgress } = useWordLevel();
  const [currentLevel, setCurrentLevel] = useState(userProgress.currentLevel || 1);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleLevelUp = (newLevel: number) => {
    updateUserProgress({
      currentLevel: newLevel,
      levels: userProgress.levels.map(level => 
        level.level === newLevel
          ? { ...level, unlockedAt: new Date() }
          : level
      )
    });
    setCurrentLevel(newLevel);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Word Levels" />
          <Tab label="Practice" />
          <Tab label="Exam" />
        </Tabs>
      </Paper>

      <TabPanel value={activeTab} index={0}>
        <WordLevelManager 
          userProgress={userProgress}
          onLevelUp={handleLevelUp}
        />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <WordLevelPractice />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <ExamSection
          level={currentLevel}
          onAdvanceLevel={() => handleLevelUp(currentLevel + 1)}
        />
      </TabPanel>
    </Box>
  );
};

const WordLevelsPage: React.FC = () => {
  return (
    <WordLevelProvider>
      <WordLevelsContent />
    </WordLevelProvider>
  );
};

export default WordLevelsPage; 