import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';

interface MockInterviewChatProps {
  transcript: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onEndSession: () => void;
  topicName: string;
  isWaitingForNext: boolean;
  onNextQuestion: () => void;
}

const MockInterviewChat: React.FC<MockInterviewChatProps> = ({
  transcript,
  onSendMessage,
  isLoading,
  onEndSession,
  topicName,
  isWaitingForNext,
  onNextQuestion,
}) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcript, isLoading]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim() && !isLoading) {
      onSendMessage(currentMessage.trim());
      setCurrentMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Mock Interview: {topicName}
        </h2>
        <Button onClick={onEndSession} variant="secondary" disabled={isLoading}>
          End Session
        </Button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {transcript.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-prose px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && !isWaitingForNext && (
            <div className="flex justify-start">
              <div className="max-w-prose px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                <LoadingSpinner text="Typing..." />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        {isWaitingForNext ? (
          <div className="flex justify-center">
            <Button onClick={onNextQuestion} disabled={isLoading}>
              Next Question &rarr;
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your answer..."
              className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !currentMessage.trim()}>
              {isLoading ? <LoadingSpinner isButton={true} /> : 'Send'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MockInterviewChat;