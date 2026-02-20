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
        return { text: "System standby... (Optimizing neural pathways)", type: 'system' };
    }
};

export const analyzeCommand = async (command: string): Promise<AIResponse> => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `${SYSTEM_PROMPT}\n\nTask: Analyze the user command. Response MUST be a JSON object with keys: 'thought' (technical response to user), 'taskType' (Security, Yield, Audit, or General), and 'priority' (High/Medium/Low). Do NOT use Markdown.`
                },
                {
                    role: 'user',
                    content: command
                }
            ],
            model: 'llama3-70b-8192', // Switched to 70B for better JSON adherence
            temperature: 0.2, // Lower temperature for structured output
            max_tokens: 150,
            response_format: { type: 'json_object' } // Enforce JSON mode
        });

        const content = chatCompletion.choices[0]?.message?.content || "{}";
        return { text: content, type: 'system' }; // Caller must JSON.parse(text)
    } catch (error) {
        console.error("Command Analysis Error:", error);
        return { text: JSON.stringify({ thought: "Command Processing Failed.", taskType: "General", priority: "Low" }), type: 'error' };
    }
};
