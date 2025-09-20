import React, { useState, useEffect, useCallback } from 'react';
import { InterviewType, PreparationCategory, Feedback, PracticeSessionRecord } from '../types';
import { generateQuestion, getFeedbackOnAnswer } from '../services/geminiService';
import { saveSessionToHistory } from '../services/historyService';
import Card from './common/Card';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface PracticeSessionProps {
  interviewType: InterviewType;
  category: PreparationCategory;
  onBack: () => void;
}

const FeedbackDisplay: React.FC<{ feedback: Feedback }> = ({ feedback }) => (
    <div className="space-y-6 mt-6">
        <div>
            <h4 className="text-lg font-semibold text-emerald-700">What Went Well</h4>
            <p className="text-slate-600 mt-1">{feedback.positive}</p>
        </div>
        <div>
            <h4 className="text-lg font-semibold text-amber-700">Areas for Improvement</h4>
            <p className="text-slate-600 mt-1">{feedback.improvement}</p>
        </div>
        <div>
            <h4 className="text-lg font-semibold text-indigo-700">Example Answer</h4>
            <p className="text-slate-600 mt-1 whitespace-pre-wrap font-mono bg-slate-100 p-3 rounded-md">{feedback.exampleAnswer}</p>
        </div>
    </div>
);


const PracticeSession: React.FC<PracticeSessionProps> = ({ interviewType, category, onBack }) => {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState<boolean>(true);
  const [isGettingFeedback, setIsGettingFeedback] = useState<boolean>(false);

  const fetchQuestion = useCallback(async () => {
    setIsLoadingQuestion(true);
    setFeedback(null);
    setAnswer('');
    const newQuestion = await generateQuestion(interviewType, category);
    setQuestion(newQuestion);
    setIsLoadingQuestion(false);
  }, [interviewType, category]);

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetFeedback = async () => {
    if (!answer.trim()) return;
    setIsGettingFeedback(true);
    const feedbackResult = await getFeedbackOnAnswer(question, answer);
    setFeedback(feedbackResult);
    setIsGettingFeedback(false);

    if (feedbackResult.positive !== "Could not analyze the feedback.") {
        const sessionRecord: PracticeSessionRecord = {
          id: Date.now(),
          date: new Date().toISOString(),
          interviewType,
          category,
          question,
          answer,
          feedback: feedbackResult,
        };
        saveSessionToHistory(sessionRecord);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors duration-200 mb-6">
        <ArrowLeftIcon className="h-5 w-5" />
        <span>Back to Home</span>
      </button>

      <Card>
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{category} Practice</h2>
          <p className="text-slate-500 mb-6">For a {interviewType} role.</p>
          
          <div className="bg-slate-50 p-4 rounded-lg min-h-[100px] flex items-center justify-center">
            {isLoadingQuestion ? (
              <LoadingSpinner text="Generating question..."/>
            ) : (
              <p className="text-lg text-slate-700 font-medium text-center">{question}</p>
            )}
          </div>

          {!feedback && (
            <div className="mt-6">
              <label htmlFor="answer" className="block text-sm font-medium text-slate-700 mb-2">Your Answer</label>
              <textarea
                id="answer"
                rows={8}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Structure your answer here..."
                disabled={isLoadingQuestion || isGettingFeedback}
              />
            </div>
          )}

          {feedback && <FeedbackDisplay feedback={feedback} />}

          <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {feedback ? (
                <Button onClick={fetchQuestion} disabled={isLoadingQuestion} fullWidth>
                    Next Question
                </Button>
            ) : (
                <Button onClick={handleGetFeedback} disabled={!answer.trim() || isLoadingQuestion || isGettingFeedback} fullWidth>
                    {isGettingFeedback ? <LoadingSpinner text="Getting Feedback..." isButton /> : 'Get Feedback'}
                </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PracticeSession;
