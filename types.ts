export enum InterviewType {
  SoftwareEngineer = 'Software Engineer',
  ProductManager = 'Product Manager',
  UXDesigner = 'UI/UX Designer',
  DataScientist = 'Data Scientist',
}

export enum PreparationCategory {
  Technical = 'Technical',
  Behavioral = 'Behavioral',
}

export enum View {
  Home = 'home',
  Practice = 'practice',
  Chat = 'chat',
  History = 'history',
}

export interface Feedback {
  positive: string;
  improvement: string;
  exampleAnswer: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface PracticeSessionRecord {
  id: number;
  date: string;
  interviewType: InterviewType;
  category: PreparationCategory;
  question: string;
  answer: string;
  feedback: Feedback;
}
