
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { InterviewType, ChatMessage } from '../types';
import { createChatSession, sendChatMessage } from '../services/geminiService';
import { Chat } from '@google/genai';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface MockInterviewChatProps {
    interviewType: InterviewType;
    onBack: () => void;
}

const MockInterviewChat: React.FC<MockInterviewChatProps> = ({ interviewType, onBack }) => {
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const initializeChat = useCallback(async () => {
        setIsLoading(true);
        const session = createChatSession(interviewType);
        setChatSession(session);

        // Send an initial empty message to get the AI's greeting
        const initialResponse = await sendChatMessage(session, "Hello");
        setMessages([{ sender: 'ai', text: initialResponse.text }]);
        setIsLoading(false);
    }, [interviewType]);

    useEffect(() => {
        initializeChat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chatSession || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        const response = await sendChatMessage(chatSession, userInput);
        const aiMessage: ChatMessage = { sender: 'ai', text: response.text };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };
    
    return (
        <div className="max-w-3xl mx-auto">
            <button onClick={onBack} className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors duration-200 mb-4">
                <ArrowLeftIcon className="h-5 w-5" />
                <span>End Interview</span>
            </button>
            <div className="bg-white rounded-lg shadow-lg border border-slate-200 flex flex-col h-[75vh]">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Mock Interview</h2>
                    <p className="text-sm text-slate-500">{interviewType}</p>
                </div>
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                             {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>}
                            <div className={`rounded-lg px-4 py-2 max-w-sm md:max-w-md lg:max-w-lg ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && messages.length > 0 && (
                        <div className="flex items-end gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>
                            <div className="rounded-lg px-4 py-2 bg-slate-100 text-slate-800">
                                <LoadingSpinner text="Thinking..." isButton />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-lg">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Type your response..."
                            className="flex-1 w-full p-3 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition"
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading || !userInput.trim()}>Send</Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MockInterviewChat;
