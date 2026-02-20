import Groq from 'groq-sdk';
import { SYSTEM_PROMPT } from '../config/prompts';

// Load API Key safely
const apiKey = import.meta.env.VITE_GROQ_API_KEY;

if (!apiKey) {
    console.error("CRITICAL: Groq API Key Missing! Check .env file.");
}

const groq = new Groq({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Enabling for demo purposes since we call from client-side
});

export interface AIResponse {
    text: string;
    type: 'system' | 'info' | 'success' | 'warning' | 'error';
}

export const generateAIThought = async (context: string[]): Promise<AIResponse> => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT
                },
                ...context.map(msg => ({ role: 'user' as const, content: msg }))
            ],
            model: 'llama3-70b-8192', // Using Llama 3 70B for high intelligence/speed balance
            temperature: 0.7,
            max_tokens: 150,
            top_p: 1,
            stream: false,
            stop: null
        });

        const content = chatCompletion.choices[0]?.message?.content || "System idle...";

        // Simple heuristic to determine log type based on content tone/keywords
        let type: AIResponse['type'] = 'info';
        if (content.toLowerCase().includes('error') || content.toLowerCase().includes('failed')) type = 'error';
        if (content.toLowerCase().includes('success') || content.toLowerCase().includes('verified')) type = 'success';
        if (content.toLowerCase().includes('warning') || content.toLowerCase().includes('alert')) type = 'warning';

        return { text: content, type };

    } catch (error) {
        console.error("AI Generation Error:", error);
        return { text: "Neural Link Destabilized. Reconnecting...", type: 'error' };
    }
};

export const analyzeCommand = async (command: string): Promise<AIResponse> => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `${SYSTEM_PROMPT}\n\nTask: Analyze the user command and provide a technical response or delegation action.`
                },
                {
                    role: 'user',
                    content: command
                }
            ],
            model: 'llama3-8b-8192', // Faster model for quick command response
            temperature: 0.5,
            max_tokens: 100
        });

        const content = chatCompletion.choices[0]?.message?.content || "Command received. Processing...";

        return { text: content, type: 'system' };
    } catch (error) {
        return { text: "Command Processing Failed. Retry.", type: 'error' };
    }
};
