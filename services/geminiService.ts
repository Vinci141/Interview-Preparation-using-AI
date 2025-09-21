import { GoogleGenAI, Chat, GenerateContentResponse, Content, Type } from "@google/genai";
import { ChatMessage, PracticeSessionConfig } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chat: Chat | null = null;

const createSystemInstruction = (config: PracticeSessionConfig): Content => {
    const { topic, subTopic, difficulty } = config;
    const topicName = subTopic ? subTopic.name : topic.name;
    const topicDescription = subTopic ? subTopic.description : topic.description;

    let difficultyInstruction = '';
    switch (difficulty) {
        case 'easy':
            difficultyInstruction = `The difficulty level for this interview is EASY. Ask foundational, straightforward questions. The expected answers are concise and test basic knowledge. Avoid multi-part questions or complex scenarios.`;
            break;
        case 'hard':
            difficultyInstruction = `The difficulty level for this interview is HARD. Ask challenging, in-depth questions that may involve multiple parts, edge cases, or complex scenarios. Expect detailed, well-structured answers that demonstrate deep expertise.`;
            break;
        case 'medium':
        default:
            difficultyInstruction = `The difficulty level for this interview is MEDIUM. Ask standard interview questions that cover common scenarios and require a solid understanding of the topic.`;
            break;
    }

    const instructionText = `You are an expert interviewer conducting a practice session. Your goal is to help the candidate by providing immediate, question-by-question feedback.

The interview topic is: ${topicName}.
The broader category is: ${topic.name}.
Your description for the topic is: "${topicDescription}".

**Difficulty Level:**
${difficultyInstruction}

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
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: createSystemInstruction(config),
        },
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message: "Hello, I'm ready to start the interview." });
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
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: feedbackPrompt,
        config: {
          systemInstruction: "You are an expert career coach providing a final summary."
        }
    });

    return response.text;
};


export const generatePracticeQuestions = async (config: PracticeSessionConfig): Promise<string[]> => {
    const { topic, subTopic, difficulty } = config;
    const topicName = subTopic ? subTopic.name : topic.name;

    const prompt = `You are an expert curriculum developer and interview coach. Your task is to generate a list of 7 high-quality practice interview questions for the following topic:

Topic: ${topicName}
Broader Category: ${topic.name}
Difficulty Level: ${difficulty}

The questions should be insightful, relevant to a real-world interview, and tailored to the specified difficulty level. Ensure the questions cover a good range of concepts within the topic.

Return your response as a JSON array of strings, where each string is a single, complete interview question.`;

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.STRING,
            description: "A single interview question."
        }
    };
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonText = response.text.trim();
        if (jsonText.startsWith('[') && jsonText.endsWith(']')) {
            const questions = JSON.parse(jsonText);
            return Array.isArray(questions) ? questions : [];
        } else {
             throw new Error("Received an invalid non-JSON response from the model.");
        }

    } catch (error) {
        console.error("Error generating practice questions:", error);
        throw new Error("Failed to generate practice questions due to an API error or invalid response format.");
    }
};