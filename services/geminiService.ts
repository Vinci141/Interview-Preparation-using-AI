import { GoogleGenAI, Chat, GenerateContentResponse, Content } from "@google/genai";
import { ChatMessage, PracticeSessionConfig } from '../types';

// Fix: Initialize GoogleGenAI with named apiKey parameter as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chat: Chat | null = null;

// Fix: The function was returning a string, which did not match the 'Content' return type.
// It now returns a valid Content object to satisfy the type signature.
const createSystemInstruction = (config: PracticeSessionConfig): Content => {
    const topicName = config.subTopic ? config.subTopic.name : config.topic.name;
    const topicDescription = config.subTopic ? config.subTopic.description : config.topic.description;

    const instructionText = `You are an expert interviewer conducting a mock interview for a job candidate.
The interview topic is: ${topicName}.
The broader category is: ${config.topic.name}.
Your description for the topic is: "${topicDescription}".

Instructions:
1. Start by greeting the candidate and asking the first question related to the specific topic.
2. Ask one question at a time.
3. Your questions should be relevant to the chosen topic: ${topicName}.
4. Keep your responses concise and professional.
5. After the candidate answers, provide a brief acknowledgment and then ask the next question. Do not provide feedback on their answer during the interview.
6. If the user says they are ready to end the interview, respond with only "SESSION_END". Do not add any other text.`;
    
    return { parts: [{ text: instructionText }] };
};

export const startInterview = async (config: PracticeSessionConfig): Promise<string> => {
    chat = ai.chats.create({
        // Fix: Use 'gemini-2.5-flash' model.
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: createSystemInstruction(config),
        },
    });

    // Fix: Use chat.sendMessage to interact with the chat session.
    const response: GenerateContentResponse = await chat.sendMessage({ message: "Hello, I'm ready to start the interview." });
    // Fix: Access response text directly via the .text property.
    return response.text;
};

export const sendMessage = async (message: string): Promise<string> => {
    if (!chat) {
        throw new Error("Interview session not started. Please call startInterview first.");
    }
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text;
};

export const getInterviewFeedback = async (transcript: ChatMessage[]): Promise<string> => {
    const feedbackPrompt = `
        You are an expert career coach providing feedback on a mock interview.
        Here is the transcript of the interview:
        ${transcript.map(msg => `${msg.role === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.content}`).join('\n\n')}

        Please provide constructive feedback for the candidate. The feedback should be encouraging and actionable.
        Structure your feedback with the following sections:
        1.  **Overall Summary:** A brief overview of the candidate's performance.
        2.  **Strengths:** 2-3 bullet points on what the candidate did well.
        3.  **Areas for Improvement:** 2-3 bullet points on specific areas where the candidate could improve, with suggestions on how to do so.

        Address the candidate directly (e.g., "You did a great job at...").
    `;
    
    // Fix: Use ai.models.generateContent for non-chat generation.
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: feedbackPrompt,
        config: {
          systemInstruction: "You are an expert career coach."
        }
    });

    return response.text;
};