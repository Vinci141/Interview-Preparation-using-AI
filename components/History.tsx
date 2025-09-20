import React, { useState, useEffect } from 'react';
import { PracticeSessionRecord } from '../types';
import * as historyService from '../services/historyService';
import Card from './common/Card';
import Button from './common/Button';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface HistoryProps {
  onBack: () => void;
}

const History: React.FC<HistoryProps> = ({ onBack }) => {
  const [history, setHistory] = useState<PracticeSessionRecord[]>([]);
  const [selectedSession, setSelectedSession] = useState<PracticeSessionRecord | null>(null);

  useEffect(() => {
    setHistory(historyService.getHistory());
  }, []);
  
  if (selectedSession) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8">
            <Button onClick={() => setSelectedSession(null)}>
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to History
            </Button>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Session Details
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
            {new Date(selectedSession.date).toLocaleString()} - {selectedSession.config.topic.name} {selectedSession.config.subTopic ? `(${selectedSession.config.subTopic.name})` : ''}
        </p>

        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Feedback Received</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap">
              {selectedSession.feedback || "No feedback was generated for this session."}
            </div>
          </Card>
          <Card className="p-6">
             <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Transcript</h2>
             <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {selectedSession.transcript.map((msg, index) => (
                    <div key={index}>
                        <p className={`font-bold ${msg.role === 'user' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            {msg.role === 'user' ? 'You' : 'Interviewer'}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{msg.content}</p>
                    </div>
                ))}
             </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
          Session History
        </h1>
        <Button onClick={onBack}>
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Home
        </Button>
      </div>

      {history.length === 0 ? (
        <Card className="p-8 text-center">
            <p className="text-slate-600 dark:text-slate-300">You have no past interview sessions.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {history.map((session) => (
            <Card
              key={session.id}
              className="p-4 md:p-6 cursor-pointer"
              hoverable
              onClick={() => setSelectedSession(session)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{session.config.subTopic?.name || session.config.topic.name}</h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    {session.config.subTopic && <span className="font-medium">{session.config.topic.name}</span>}
                    {session.config.subTopic && ' - '}
                    {new Date(session.date).toLocaleString()}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">View Details &rarr;</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
