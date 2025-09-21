import React, { useState } from 'react';
import { InterviewTopic, PracticeSessionConfig, SubTopic } from '../types';
import Card from './common/Card';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { CodeIcon } from './icons/CodeIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { AiIcon } from './icons/AiIcon';

const interviewTopics: InterviewTopic[] = [
  {
    id: 'behavioral',
    name: 'Behavioral Questions',
    description: 'Practice answering questions about your past experiences, teamwork, and how you handle workplace situations.',
    icon: UserGroupIcon,
    subTopics: [
      { id: 'leadership', name: 'Leadership & Teamwork', description: 'Questions about leading projects, collaborating with others, and being a team player.' },
      { id: 'conflict', name: 'Conflict Resolution', description: 'Scenarios involving disagreements with colleagues or managers and how you handled them.' },
      { id: 'star', name: 'Situational (STAR)', description: 'Practice structuring your answers using the STAR (Situation, Task, Action, Result) method.' },
    ],
  },
  {
    id: 'technical',
    name: 'Technical Challenge',
    description: 'Tackle technical questions, data structures, and algorithms related to your field.',
    icon: CodeIcon,
    subTopics: [
        { id: 'dsa', name: 'Data Structures & Algorithms', description: 'Solve problems related to arrays, strings, linked lists, trees, graphs, and sorting.' },
        { id: 'system-design', name: 'System Design', description: 'Discuss how to design scalable and reliable systems, like a social media feed or a URL shortener.' },
        { id: 'databases', name: 'Databases', description: 'Answer questions about SQL, NoSQL, database design, and query optimization.' },
        { id: 'programming', name: 'Programming Concepts', description: 'Questions on paradigms like OOP, functional programming, and general language-agnostic principles.' },
        { id: 'os', name: 'Operating Systems', description: 'Explore topics like processes, threads, memory management, and file systems.' },
        { id: 'networking', name: 'Computer Networking', description: 'Discuss network protocols (TCP/IP), the OSI model, and common web technologies.' },
    ]
  },
  {
    id: 'ai-ml',
    name: 'AI / Machine Learning',
    description: 'Prepare for AI/ML roles, from foundational concepts to advanced model architecture and system design.',
    icon: AiIcon,
    subTopics: [
        { id: 'ml-fundamentals', name: 'AI/ML Fundamentals', description: 'Core concepts like supervised/unsupervised learning, evaluation metrics, and classic algorithms (e.g., decision trees, SVMs).' },
        { id: 'math-stats', name: 'Math & Statistics', description: 'Questions on probability, linear algebra, and calculus concepts that form the bedrock of machine learning.' },
        { id: 'deep-learning', name: 'Deep Learning', description: 'Dive into neural networks, activation functions, backpropagation, and architectures like CNNs, RNNs, and Transformers.' },
        { id: 'nlp-cv', name: 'NLP & Computer Vision', description: 'Specialized questions on topics like text processing, embeddings, object detection, and image segmentation.' },
        { id: 'ml-system-design', name: 'ML System Design', description: 'Design end-to-end machine learning systems, from data ingestion and feature engineering to deployment and monitoring (MLOps).' },
    ]
  },
  {
    id: 'general',
    name: 'General Conversation',
    description: 'A friendly chat to warm up and practice general communication skills for any type of interview.',
    icon: ChatBubbleIcon,
  },
];

interface HomeProps {
  onStartSession: (config: PracticeSessionConfig) => void;
}

const Home: React.FC<HomeProps> = ({ onStartSession }) => {
  const [selectedTopic, setSelectedTopic] = useState<InterviewTopic | null>(null);

  const handleTopicSelect = (topic: InterviewTopic) => {
    if (topic.subTopics && topic.subTopics.length > 0) {
      setSelectedTopic(topic);
    } else {
      onStartSession({ topic });
    }
  };
  
  const handleSubTopicSelect = (subTopic: SubTopic) => {
    if (selectedTopic) {
      onStartSession({ topic: selectedTopic, subTopic });
    }
  };

  const handleBack = () => {
    setSelectedTopic(null);
  };

  if (selectedTopic) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8">
            <button onClick={handleBack} className="flex items-center text-base font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to All Topics
            </button>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
            {selectedTopic.name}
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Choose a specific area to focus on.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedTopic.subTopics?.map((subTopic) => (
            <Card
              key={subTopic.id}
              hoverable
              className="p-6 cursor-pointer flex flex-col"
              onClick={() => handleSubTopicSelect(subTopic)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSubTopicSelect(subTopic)}
            >
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{subTopic.name}</h2>
              <p className="text-slate-600 dark:text-slate-400 flex-grow">{subTopic.description}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
          Welcome to Interview Prep AI
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          Choose a topic to start your mock interview. Our AI will act as your interviewer, helping you sharpen your skills and build confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {interviewTopics.map((topic) => (
          <Card 
            key={topic.id}
            hoverable
            className="p-6 cursor-pointer flex flex-col"
            onClick={() => handleTopicSelect(topic)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleTopicSelect(topic)}
          >
            <div className="flex-shrink-0 mb-4">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
                <topic.icon className="h-7 w-7" aria-hidden="true" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{topic.name}</h2>
            <p className="text-slate-600 dark:text-slate-400 flex-grow">{topic.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;