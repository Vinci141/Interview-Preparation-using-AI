import React, { useState, useEffect } from 'react';
import { PracticeSessionConfig } from '../types';
import * as geminiService from '../services/geminiService';
import Card from './common/Card';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface QuestionGeneratorProps {
  config: PracticeSessionConfig;
  onBack: () => void;
}

const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({ config, onBack }) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const generatedQuestions = await geminiService.generatePracticeQuestions(config);
        setQuestions(generatedQuestions);
      } catch (e) {
        console.error(e);
        setError("Failed to generate questions. This might be due to a network issue or an API configuration problem. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [config]);

  const topicName = config.subTopic?.name || config.topic.name;
  const difficultyName = config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1);

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8">
        <Button onClick={onBack} variant="secondary">
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </Button>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
          Practice Questions
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          {topicName} - {difficultyName}
        </p>
      </div>

      <Card className="p-6 md:p-8 min-h-[20rem] flex items-center justify-center">
        {isLoading && <LoadingSpinner text="Generating your questions..." />}
        {error && <p className="text-red-500 text-center max-w-md">{error}</p>}
        {!isLoading && !error && (
          <ol className="list-decimal list-inside space-y-4 text-slate-700 dark:text-slate-200 text-lg w-full">
            {questions.map((q, index) => (
              <li key={index} className="pl-2">{q}</li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
};

export default QuestionGenerator;