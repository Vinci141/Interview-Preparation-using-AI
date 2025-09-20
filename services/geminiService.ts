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

    const instructionText = `You are an expert interviewer conducting a practice session. Your goal is to help the candidate by providing immediate, question-by-question feedback.

The interview topic is: ${topicName}.
The broader category is: ${config.topic.name}.
Your description for the topic is: "${topicDescription}".

**Interaction Flow:**
1.  Start by greeting the candidate and asking the first question. Ask only one question at a time.
2.  After the candidate provides their answer, you MUST evaluate it and respond with two things:
    *   **Feedback:** A brief, constructive critique of their answer (1-2 sentences).
    *   **Example Answer:** A concise, well-structured example of a strong answer to the question you just asked.
3.  After providing both the feedback and the example answer, you MUST end your entire response with the exact phrase: 'READY_FOR_NEXT_QUESTION'
4.  Do not ask the next question until the user indicates they are ready. They will send a message like "next question" to proceed.
5.  If the user says they are ready to end the interview, respond with only "SESSION_END". Do not add any other text.`;
    
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
        You are an expert career coach providing a final summary on a mock interview practice session. The user has already received per-question feedback.
        Here is the transcript of the interview:
        ${transcript.map(msg => `${msg.role === 'user' ? 'Candidate' : 'Interviewer/Feedback'}: ${msg.content.replace('READY_FOR_NEXT_QUESTION', '')}`).join('\n\n')}

        Please provide a high-level summary of the candidate's performance based on the entire session.
        Structure your feedback with the following sections:
        1.  **Overall Summary:** A brief overview of the candidate's performance across all questions.
        2.  **Key Strengths:** 1-2 bullet points on consistent strengths you observed.
        3.  **Themes for Improvement:** 1-2 bullet points on recurring patterns or areas for improvement.

        Keep it concise and encouraging. Address the candidate directly.
    `;
    
    // Fix: Use ai.models.generateContent for non-chat generation.
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: feedbackPrompt,
        config: {
          systemInstruction: "You are an expert career coach providing a final summary."
        }
    });

    return response.text;
};