import React, { useState, useCallback } from 'react';
import { InterviewType, PreparationCategory, View } from './types';
import Header from './components/Header';
import Home from './components/Home';
import PracticeSession from './components/PracticeSession';
import MockInterviewChat from './components/MockInterviewChat';
import History from './components/History';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Home);
  const [interviewType, setInterviewType] = useState<InterviewType>(InterviewType.SoftwareEngineer);
  const [category, setCategory] = useState<PreparationCategory>(PreparationCategory.Technical);

  const startPractice = useCallback((cat: PreparationCategory) => {
    setCategory(cat);
    setView(View.Practice);
  }, []);

  const startChat = useCallback(() => {
    setView(View.Chat);
  }, []);

  const goHome = useCallback(() => {
    setView(View.Home);
  }, []);

  const goToHistory = useCallback(() => {
    setView(View.History);
  }, []);

  const renderContent = () => {
    switch (view) {
      case View.Practice:
        return (
          <PracticeSession
            interviewType={interviewType}
            category={category}
            onBack={goHome}
          />
        );
      case View.Chat:
        return (
            <MockInterviewChat 
                interviewType={interviewType}
                onBack={goHome} 
            />
        );
      case View.History:
        return <History onBack={goHome} />;
      case View.Home:
      default:
        return (
          <Home
            selectedType={interviewType}
            onSelectType={setInterviewType}
            onStartPractice={startPractice}
            onStartChat={startChat}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header onGoHome={goHome} onGoToHistory={goToHistory} />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
