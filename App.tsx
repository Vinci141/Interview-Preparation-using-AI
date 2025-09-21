import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import PracticeSession from './components/PracticeSession';
import History from './components/History';
import { PracticeSessionConfig } from './types';
import QuestionGenerator from './components/QuestionGenerator';

type View = 'home' | 'session' | 'history' | 'question-generator';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [sessionConfig, setSessionConfig] = useState<PracticeSessionConfig | null>(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleStartSession = (config: PracticeSessionConfig) => {
    setSessionConfig(config);
    setView('session');
  };

  const handleStartQuestionGeneration = (config: PracticeSessionConfig) => {
    setSessionConfig(config);
    setView('question-generator');
  };
  
  const handleGoHome = () => {
    setSessionConfig(null);
    setView('home');
  };

  const renderContent = () => {
    switch (view) {
      case 'session':
        if (sessionConfig) {
          return <PracticeSession config={sessionConfig} onBack={handleGoHome} />;
        }
        setView('home'); // Fallback
        return <Home onStartSession={handleStartSession} onStartQuestionGeneration={handleStartQuestionGeneration} />;
      case 'history':
        return <History onBack={handleGoHome} />;
      case 'question-generator':
        if (sessionConfig) {
          return <QuestionGenerator config={sessionConfig} onBack={handleGoHome} />;
        }
        setView('home'); // Fallback
        return <Home onStartSession={handleStartSession} onStartQuestionGeneration={handleStartQuestionGeneration} />;
      case 'home':
      default:
        return <Home onStartSession={handleStartSession} onStartQuestionGeneration={handleStartQuestionGeneration} />;
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <Header 
        onGoHome={handleGoHome}
        onGoToHistory={() => setView('history')}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;