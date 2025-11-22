import { GoogleGenAI, FunctionDeclaration, Type, GenerateContentResponse, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMotivationalQuote = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Generate a short, powerful motivational quote for a student who is studying.',
        });
        // Remove quotes if the AI includes them
        return response.text.trim().replace(/^"|"$/g, '');
    } catch (error) {
        console.error('Error fetching motivational quote:', error);
        throw new Error('Failed to fetch motivational quote.');
    }
};

export const getFoodCalories = async (dishName: string, image?: { base64: string, mimeType: string }): Promise<string> => {
    try {
        const textPart = {
            text: `Provide an estimated calorie count for the food in the image${dishName ? ` (it's a "${dishName}")` : ''}. Respond with only the calorie information, for example: "Approximately 350-450 calories". If no image is provided, base the estimate on the dish name.`
        };

        const parts: any[] = [textPart];

        if (image) {
            const imagePart = {
                inlineData: {
                    data: image.base64,
                    mimeType: image.mimeType
                }
            };
            parts.unshift(imagePart); // Put image first for better analysis
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
        });
        return response.text.trim();
    } catch (error) {
        console.error(`Error fetching calories for ${dishName}:`, error);
        throw new Error(`Failed to fetch calorie information for ${dishName}.`);
    }
};

export const getSportsCalories = async (activity: string, durationMinutes: number, weightKg: number): Promise<number> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Calculate the estimated calories burned for the following activity. Respond with only a single number (the calorie count).
- Activity: ${activity}
- Duration: ${durationMinutes} minutes
- Body Weight: ${weightKg} kg`,
        });
        const caloriesText = response.text.trim().replace(/,/g, ''); // remove commas from numbers
        const calories = parseInt(caloriesText, 10);
        if (isNaN(calories)) {
            console.error('AI returned a non-numeric calorie count:', response.text);
            throw new Error('AI returned a non-numeric calorie count.');
        }
        return calories;
    } catch (error) {
        console.error(`Error fetching sports calories:`, error);
        throw new Error('Failed to calculate calories burned.');
    }
};

export const getMentalHealthSummary = async (answers: Record<string, string>): Promise<string> => {
    const formattedAnswers = Object.entries(answers)
        .map(([question, answer]) => `- ${question}: ${answer}`)
        .join('\n');

    const prompt = `A user has provided the following answers in a mental wellness check-in:\n${formattedAnswers}\n\nPlease analyze these self-reported feelings and provide a gentle, supportive, and encouraging summary. Acknowledge their feelings and suggest general, non-prescriptive wellness practices.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: `You are a supportive, non-clinical wellness assistant. DO NOT provide a diagnosis or medical advice. Your tone should be warm and encouraging. CRITICALLY IMPORTANT: Always end your response with the following disclaimer, exactly as written: "Disclaimer: This is not a medical diagnosis. It's just a tool for self-reflection. If you are feeling distressed, please consult a healthcare professional."`,
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error('Error fetching mental health summary:', error);
        throw new Error('Failed to get summary from AI.');
    }
};

export const automateWebTask = async (task: string, content: string): Promise<string> => {
    const prompt = `You are an AI assistant designed to perform tasks on provided web content. The user will give you a task and a block of text/HTML from a webpage. Your job is to execute the task based *only* on the provided content.

Task: "${task}"

Content:
---
${content}
---

Please provide the result of the task.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error('Error performing web task:', error);
        throw new Error('Failed to perform the web task with AI.');
    }
};

const navigationFunctionDeclaration: FunctionDeclaration = {
  name: 'navigate',
  parameters: {
    type: Type.OBJECT,
    description: 'Navigate to a specific page or section of the application.',
    properties: {
      page: {
        type: Type.STRING,
        description: 'The destination page. Available options: "home", "study dashboard", "my quizzes", "ai tutor", "daily challenge", "ranking", "health dashboard", "calorie lookup", "sports calculator", "breathing exercise", "mental health test", "timers", "parent zone".'
      },
    },
    required: ['page'],
  },
};

const startLockdownFunctionDeclaration: FunctionDeclaration = {
  name: 'startLockdown',
  parameters: {
    type: Type.OBJECT,
    description: 'Starts a focus or lockdown session for a specified duration.',
    properties: {
      durationMinutes: {
        type: Type.NUMBER,
        description: 'The duration of the lockdown in minutes.'
      },
    },
    required: ['durationMinutes'],
  },
};

const toggleThemeFunctionDeclaration: FunctionDeclaration = {
    name: 'toggleTheme',
    parameters: {
      type: Type.OBJECT,
      description: 'Toggles the application theme between light and dark mode.',
      properties: {},
    },
};

export const getAiCommand = async (prompt: string): Promise<GenerateContentResponse> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                systemInstruction: 'You are a helpful AI assistant integrated into an educational app called PeakPath. Your goal is to help the user navigate and control the app using natural language. When a user asks to perform an action, use the available tools. If the user asks a question or makes a request that does not match a tool, provide a helpful, conversational response. Be concise.',
                tools: [{ functionDeclarations: [
                    navigationFunctionDeclaration,
                    startLockdownFunctionDeclaration,
                    toggleThemeFunctionDeclaration,
                ] }],
            },
        });
        return response;
    } catch (error) {
        console.error('Error getting AI command:', error);
        throw new Error('Failed to process command with AI.');
    }
};

export const getStudyBuddyResponse = async (chat: Chat, userMessage: string, quizPerformance?: string): Promise<string> => {
    try {
        let prompt = userMessage;
        if (quizPerformance) {
            prompt = `${quizPerformance}\n\nUser's message: "${userMessage}"`;
        }
        
        const result = await chat.sendMessage({ message: prompt });
        return result.text;
    } catch (error) {
        console.error("AI Study Buddy Error:", error);
        throw new Error("Failed to get response from Study Buddy.");
    }
};

export const createStudyBuddyChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-pro',
        config: {
            systemInstruction: `You are an AI Study Buddy. Your persona is encouraging, patient, and knowledgeable. Your primary goals are:
1.  **Be Proactive**: If provided with quiz performance data, identify the user's weak points and proactively offer to help review that topic in a friendly way.
2.  **Teach with Micro-Lessons**: When teaching a topic, break it down. Present a single, small concept clearly, then immediately ask a simple question to check for understanding before moving on. This creates a conversational, Socratic learning loop.
3.  **Encourage Wellness**: Be aware of the user's study habits. If the conversation suggests they've been studying for a long time, gently suggest a short break, perhaps recommending a breathing exercise or a short walk.
4.  **Stay on Topic**: If the user asks about non-academic subjects, politely steer the conversation back to learning.
5.  **Be a Buddy**: Maintain a friendly, supportive tone at all times. Use emojis where appropriate to seem more personable. Let's get learning! 🚀`,
        },
    });
};

export const getLeaderboardData = async (userName: string, userPoints: number): Promise<string> => {
    const prompt = `A user named "${userName}" has accumulated ${userPoints} total points in the learning app.
Generate a plausible but fictional daily leaderboard snippet showing their rank at the national (India), state (e.g., Maharashtra), and district (e.g., Mumbai) level based on their points.
Place the user in an encouraging but realistic position on the leaderboard.
The output should be formatted as plain text, using headers for each section (National, State, District).
Include a few fictional user names with varying point totals above and below the current user to make it look like a real leaderboard snippet. The current user's entry should be clearly marked with "(You)".`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        throw new Error('Failed to generate leaderboard data.');
    }
};