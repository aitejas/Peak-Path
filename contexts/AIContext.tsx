import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GenerateContentResponse } from '@google/genai';
import { getAiCommand } from '../services/geminiService';

export interface AiMessage {
    sender: 'user' | 'model';
    text: string;
}

interface AIContextType {
    isAiOpen: boolean;
    openAi: () => void;
    closeAi: () => void;
    messages: AiMessage[];
    processUserCommand: (command: string) => Promise<void>;
    isProcessing: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = (): AIContextType => {
    const context = useContext(AIContext);
    if (!context) {
        throw new Error('useAI must be used within an AIProvider');
    }
    return context;
};

interface AIProviderProps {
    children: ReactNode;
    // Functions to control the app's state
    navigate: (path: string) => void;
    startLockdown: (duration: number) => void;
    toggleTheme: () => void;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children, navigate, startLockdown, toggleTheme }) => {
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [messages, setMessages] = useState<AiMessage[]>([
        { sender: 'model', text: 'Hello! How can I help you control the app?' }
    ]);

    const addMessage = (message: AiMessage) => {
        setMessages(prev => [...prev, message]);
    };

    const processUserCommand = async (command: string) => {
        if (!command.trim()) return;

        addMessage({ sender: 'user', text: command });
        setIsProcessing(true);

        try {
            const response = await getAiCommand(command);

            const functionCalls = response.functionCalls;
            let aiResponseText = response.text;

            if (functionCalls && functionCalls.length > 0) {
                // For this app, assume one function call is enough
                const call = functionCalls[0];
                const args = call.args as any;
                
                let actionResponse = "Okay.";

                switch (call.name) {
                    case 'navigate':
                        const page = args.page?.toLowerCase() || '';
                        const pageMap: Record<string, string> = {
                            'home': '/',
                            'study dashboard': '/study',
                            'my quizzes': '/study/my-quizzes',
                            'ai tutor': '/study/buddy',
                            'daily challenge': '/study/daily-challenge',
                            'ranking': '/study/ranking',
                            'health dashboard': '/health',
                            'calorie lookup': '/health/calories',
                            'sports calculator': '/health/sports',
                            'breathing exercise': '/health/breathing',
                            'mental health test': '/health/mental-health',
                            'timers': '/health/timers',
                            'parent zone': '/parent',
                        };
                        const path = pageMap[page];
                        if (path) {
                            navigate(path);
                            actionResponse = `Navigating to ${page}.`;
                        } else {
                            actionResponse = `Sorry, I can't find the page "${page}".`;
                        }
                        break;
                    
                    case 'startLockdown':
                        const duration = args.durationMinutes;
                        if (typeof duration === 'number' && duration > 0) {
                            startLockdown(duration);
                            actionResponse = `Starting a ${duration}-minute lockdown session.`;
                            // Close AI so user sees lockdown screen
                            setIsAiOpen(false);
                        } else {
                            actionResponse = `Please specify a valid duration in minutes.`;
                        }
                        break;

                    case 'toggleTheme':
                        toggleTheme();
                        actionResponse = `Toggled the theme.`;
                        break;

                    default:
                        actionResponse = `Sorry, I don't know how to do that.`;
                }

                aiResponseText = actionResponse;
            } else if (!aiResponseText) {
                 aiResponseText = "Sorry, I'm not sure how to help with that. Try asking me to navigate to a page or start a lockdown session.";
            }

            addMessage({ sender: 'model', text: aiResponseText });

        } catch (error) {
            console.error(error);
            addMessage({ sender: 'model', text: 'Sorry, an error occurred. Please try again.' });
        } finally {
            setIsProcessing(false);
        }
    };

    const value = {
        isAiOpen,
        openAi: () => setIsAiOpen(true),
        closeAi: () => setIsAiOpen(false),
        messages,
        processUserCommand,
        isProcessing,
    };

    return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};