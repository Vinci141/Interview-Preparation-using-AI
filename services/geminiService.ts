
import { GoogleGenAI, Chat, Type, GenerateContentResponse } from "@google/genai";
import { InterviewType, PreparationCategory, Feedback } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestion = async (type: InterviewType, category: PreparationCategory): Promise<string> => {
  try {
    const prompt = `You are an expert interviewer. Generate one realistic ${category} interview question for a ${type} role. The question should be concise and typical for a mid-level candidate. Do not add any preamble, explanation, or quotation marks, just the raw question text itself.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating question:", error);
    return "Sorry, I couldn't generate a question right now. Please try again.";
  }
};

export const getFeedbackOnAnswer = async (question: string, answer: string): Promise<Feedback> => {
    try {
        const prompt = `You are an expert interview coach. A candidate was asked the following question:
        "Question: ${question}"

        They provided this answer:
        "Answer: ${answer}"

        Provide constructive feedback on their answer.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        positive: {
                            type: Type.STRING,
                            description: "A string detailing what was good about the answer."
                        },
                        improvement: {
                            type: Type.STRING,
                            description: "A string with specific, actionable suggestions for improvement."
                        },
                        exampleAnswer: {
                            type: Type.STRING,
                            description: "A string providing a well-structured, ideal answer to the original question."
                        }
                    }
                }
            }
        });
        
        const jsonText = response.text;
        return JSON.parse(jsonText) as Feedback;

    } catch (error) {
        console.error("Error getting feedback:", error);
        return {
            positive: "Could not analyze the feedback.",
            improvement: "There was an error communicating with the AI. Please check your connection and try again.",
            exampleAnswer: "N/A"
        };
    }
};


export const createChatSession = (interviewType: InterviewType): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are an AI interviewer named Alex conducting a mock interview for a ${interviewType} position. Start by greeting the candidate and asking an introductory behavioral question like "Tell me about yourself". Then, proceed with a mix of technical and behavioral questions relevant to the role. Keep your questions concise. Wait for the candidate's response before asking the next question. Your goal is to simulate a real interview experience. Do not break character. Keep your responses conversational and engaging.`,
        },
    });
};

export const sendChatMessage = async (chat: Chat, message: string): Promise<GenerateContentResponse> => {
    return await chat.sendMessage({ message });
};
