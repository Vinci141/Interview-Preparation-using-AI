
import React from 'react';
import { InterviewType, PreparationCategory } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import { CodeIcon } from './icons/CodeIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';

interface HomeProps {
  selectedType: InterviewType;
  onSelectType: (type: InterviewType) => void;
  onStartPractice: (category: PreparationCategory) => void;
  onStartChat: () => void;
}

const Home: React.FC<HomeProps> = ({ selectedType, onSelectType, onStartPractice, onStartChat }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Welcome to Your Interview Coach</h2>
        <p className="text-lg text-slate-600">Select your role and how you'd like to prepare.</p>
      </div>

      <Card>
        <div className="p-6">
          <label htmlFor="interview-type" className="block text-sm font-medium text-slate-700 mb-2">
            1. Select Interview Type
          </label>
          <select
            id="interview-type"
            value={selectedType}
            onChange={(e) => onSelectType(e.target.value as InterviewType)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
          >
            {Object.values(InterviewType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="mt-8">
        <h3 className="text-center text-lg font-medium text-slate-700 mb-6">2. Choose Your Preparation Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable={true}>
            <div className="p-6 text-center flex flex-col items-center">
              <CodeIcon className="h-12 w-12 text-indigo-500 mb-4"/>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">Technical Practice</h4>
              <p className="text-slate-500 mb-6 flex-grow">Hone your skills with targeted technical questions and get instant feedback.</p>
              <Button onClick={() => onStartPractice(PreparationCategory.Technical)} fullWidth>Start Practice</Button>
            </div>
          </Card>
          <Card hoverable={true}>
            <div className="p-6 text-center flex flex-col items-center">
              <UserGroupIcon className="h-12 w-12 text-emerald-500 mb-4"/>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">Behavioral Practice</h4>
              <p className="text-slate-500 mb-6 flex-grow">Master STAR method questions and perfect your storytelling.</p>
              <Button onClick={() => onStartPractice(PreparationCategory.Behavioral)} variant="secondary" fullWidth>Start Practice</Button>
            </div>
          </Card>
          <Card hoverable={true}>
            <div className="p-6 text-center flex flex-col items-center">
              <ChatBubbleIcon className="h-12 w-12 text-sky-500 mb-4"/>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">Mock Interview</h4>
              <p className="text-slate-500 mb-6 flex-grow">Engage in a full-length mock interview with an AI to simulate the real experience.</p>
              <Button onClick={onStartChat} variant="tertiary" fullWidth>Start Interview</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
