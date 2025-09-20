import React from 'react';
import { HistoryIcon } from './icons/HistoryIcon';

interface HeaderProps {
  onGoHome: () => void;
  onGoToHistory: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome, onGoToHistory }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onGoHome}>
          <div className="bg-indigo-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            Interview Prep AI
          </h1>
        </div>
        <button
          onClick={onGoToHistory}
          className="flex items-center space-x-2 text-base font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <HistoryIcon className="h-5 w-5" />
          <span>History</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
