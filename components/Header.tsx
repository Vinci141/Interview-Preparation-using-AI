import React from 'react';
import { HistoryIcon } from './icons/HistoryIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface HeaderProps {
  onGoHome: () => void;
  onGoToHistory: () => void;
  theme: string;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome, onGoToHistory, theme, toggleTheme }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onGoHome}>
          <div className="bg-indigo-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200">
            Interview Prep AI
          </h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onGoToHistory}
            className="flex items-center space-x-2 text-base font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <HistoryIcon className="h-5 w-5" />
            <span className="hidden sm:inline">History</span>
          </button>
          <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-10 w-10 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
          >
              {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;