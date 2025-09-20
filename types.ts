// Fix: Corrected the React import statement. React is a default export.
import React from 'react';

export interface InterviewTopic {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subTopics?: SubTopic[];
}

export interface SubTopic {
    id: string;
    name: string;
    description: string;
}

export interface PracticeSessionConfig {
  topic: InterviewTopic;
  subTopic?: SubTopic;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface PracticeSessionRecord {
  id: string;
  config: PracticeSessionConfig;
  transcript: ChatMessage[];
  date: string; // ISO string
  feedback?: string;
}