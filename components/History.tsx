import React, { useState, useEffect } from 'react';
import { PracticeSessionRecord } from '../types';
import { getHistory } from '../services/historyService';
import Card from './common/Card';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

const SessionDetails: React.FC<{ session: PracticeSessionRecord; onBack: () => void }> = ({ session, onBack }) => {
    return (
        <div>
            <button onClick={onBack} className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors duration-200 mb-6">
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to History</span>
            </button>
            <Card>
                <div className="p-6 md:p-8">
                    <p className="text-sm text-slate-500 mb-4">
                        {new Date(session.date).toLocaleString()} - {session.interviewType} - {session.category}
                    </p>
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Question:</h3>
                    <p className="bg-slate-50 p-4 rounded-lg text-slate-700 mb-6">{session.question}</p>

                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Your Answer:</h3>
                    <p className="bg-slate-50 p-4 rounded-lg text-slate-700 mb-6 whitespace-pre-wrap">{session.answer}</p>

                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Feedback:</h3>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-semibold text-emerald-700">What Went Well</h4>
                            <p className="text-slate-600 mt-1">{session.feedback.positive}</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-amber-700">Areas for Improvement</h4>
                            <p className="text-slate-600 mt-1">{session.feedback.improvement}</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-indigo-700">Example Answer</h4>
                            <p className="text-slate-600 mt-1 whitespace-pre-wrap font-mono bg-slate-100 p-3 rounded-md">{session.feedback.exampleAnswer}</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

interface HistoryProps {
    onBack: () => void;
}

const History: React.FC<HistoryProps> = ({ onBack }) => {
    const [history, setHistory] = useState<PracticeSessionRecord[]>([]);
    const [selectedSession, setSelectedSession] = useState<PracticeSessionRecord | null>(null);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    if (selectedSession) {
        return <SessionDetails session={selectedSession} onBack={() => setSelectedSession(null)} />;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors duration-200 mb-6">
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Home</span>
            </button>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Practice History</h2>

            {history.length === 0 ? (
                <Card>
                    <div className="p-8 text-center text-slate-500">
                        <p>You haven't completed any practice sessions yet.</p>
                        <p>Go back home to start practicing!</p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    {history.map((session) => (
                        <Card key={session.id} hoverable={true} className="cursor-pointer" onClick={() => setSelectedSession(session)}>
                            <div className="p-5 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-slate-700 truncate md:max-w-xl max-w-xs">{session.question}</p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {new Date(session.date).toLocaleDateString()} - {session.category}
                                    </p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
