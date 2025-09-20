import React, { useState, useEffect, useCallback } from 'react';
import { PracticeSessionConfig, ChatMessage, PracticeSessionRecord } from '../types';
import * as geminiService from '../services/geminiService';
import * as historyService from '../services/historyService';
import MockInterviewChat from './MockInterviewChat';
import LoadingSpinner from './common/LoadingSpinner';
import Button from './common/Button';
import Card from './common/Card';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface PracticeSessionProps {
  config: PracticeSessionConfig;
  onBack: () => void;
}

const PracticeSession: React.FC<PracticeSessionProps> = ({ config, onBack }) => {
  const [transcript, setTranscript] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const firstMessage = await geminiService.startInterview(config);
      setTranscript([{ role: 'model', content: firstMessage }]);
    } catch (e) {
      console.error(e);
      setError("Failed to start the interview session. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  useEffect(() => {
    start();
  }, [start]);

  const handleSendMessage = async (message: string) => {
    const newTranscript = [...transcript, { role: 'user', content: message } as ChatMessage];
    setTranscript(newTranscript);
    setIsLoading(true);

    try {
      const response = await geminiService.sendMessage(message);
      if (response.trim() === 'SESSION_END') {
        handleEndSession(newTranscript);
      } else {
        setTranscript(prev => [...prev, { role: 'model', content: response }]);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to get a response from the AI. Please try again.");
      setTranscript(transcript); // revert transcript
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async (finalTranscript?: ChatMessage[]) => {
    const transcriptToUse = finalTranscript || transcript;
    if (transcriptToUse.length <= 1) { // Only model's first message
        onBack(); // If user ends immediately, just go back.
        return;
    }

    setSessionEnded(true);
    setIsLoading(true);
    try {
      const feedbackText = await geminiService.getInterviewFeedback(transcriptToUse);
      setFeedback(feedbackText);
      
      const sessionRecord: PracticeSessionRecord = {
        id: new Date().toISOString(),
        config,
        transcript: transcriptToUse,
        date: new Date().toISOString(),
        feedback: feedbackText,
      };
      historyService.saveSessionToHistory(sessionRecord);

    } catch (e) {
      console.error(e);
      setError("Failed to generate feedback for the session.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (sessionEnded) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-8">
          Interview Feedback
        </h1>
        <Card className="p-6">
          {isLoading && <LoadingSpinner text="Generating your feedback..." />}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {feedback && (
            <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap">
              {feedback}
            </div>
          )}
        </Card>
        <div className="mt-8 text-center">
          <Button onClick={onBack}>
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading && transcript.length === 0) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <LoadingSpinner text="Starting your interview session..." />
      </div>
    );
  }

  if (error && transcript.length === 0) {
      return (
          <div className="container mx-auto px-4 py-8 md:px-8 md:py-12 text-center">
              <Card className="p-6">
                  <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">An Error Occurred</h2>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
                  <Button onClick={onBack}>
                      <ArrowLeftIcon className="h-5 w-5 mr-2" />
                      Go Back
                  </Button>
              </Card>
          </div>
      );
  }

  return (
    <div className="h-[calc(100vh-150px)] p-4">
      <MockInterviewChat
        transcript={transcript}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onEndSession={() => handleEndSession()}
        topicName={config.subTopic?.name || config.topic.name}
      />
    </div>
  );
};

export default PracticeSession;
