import { GoogleGenAI, Chat } from "@google/genai";
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ClipboardDocumentCheckIcon } from '../../components/icons/Icons';
import { getMentalHealthSummary } from '../../services/geminiService';
import { useLocalization } from '../../contexts/LocalizationContext';

const MENTAL_HEALTH_QUESTIONS = [
  {
    id: 'q1',
    text: 'Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
  {
    id: 'q2',
    text: 'Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
  {
    id: 'q3',
    text: 'Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
  {
    id: 'q4',
    text: 'Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
   {
    id: 'q5',
    text: 'Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  },
];

interface Message {
    sender: 'user' | 'model';
    text: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface MentalHealthTestPageProps {
    awardPoints: (points: number) => void;
    updateGoalProgress: (type: 'wellness', value?: number) => void;
}

export const MentalHealthTestPage: React.FC<MentalHealthTestPageProps> = ({ awardPoints, updateGoalProgress }) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useLocalization();

    // State for the new chat feature
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers(prev => ({...prev, [questionId]: answer }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        setShowChat(false);
        
        const questionTexts: Record<string, string> = MENTAL_HEALTH_QUESTIONS.reduce((acc, q) => {
            acc[q.id] = q.text;
            return acc;
        }, {} as Record<string, string>);

        const answersWithFullText = Object.entries(answers).reduce((acc, [qId, ans]) => {
            acc[questionTexts[qId]] = ans;
            return acc;
        }, {} as Record<string, string>);

        try {
            const summary = await getMentalHealthSummary(answersWithFullText);
            setResult(summary);
            setShowChat(true);
            awardPoints(30); // Award points for completing the check-in
            updateGoalProgress('wellness');

            // Initialize a new chat session
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-pro',
                config: {
                    systemInstruction: "You are a compassionate and reassuring AI companion. Your role is to listen to the user vent their feelings, such as anger, frustration, or sadness. Your tone must always be positive, supportive, and non-judgmental. Acknowledge their feelings, validate them, and reassure the user that it's okay to feel that way and that things will be alright. Do NOT provide medical advice, diagnoses, or specific solutions. Instead, offer gentle encouragement and create a safe space for them to express themselves. Keep your responses concise and comforting.",
                }
            });
            setChatMessages([{ sender: 'model', text: "Thank you for sharing. If you'd like to talk more about what's on your mind, I'm here to listen." }]);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSendChatMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isChatLoading || !chatRef.current) return;

        const userMessage: Message = { sender: 'user', text: chatInput.trim() };
        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            const result = await chatRef.current.sendMessage({ message: userMessage.text });
            const modelMessage: Message = { sender: 'model', text: result.text };
            setChatMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            setChatMessages(prev => [...prev, { sender: 'model', text: "I'm sorry, I'm having a little trouble at the moment. Please try again in a bit." }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const allQuestionsAnswered = Object.keys(answers).length === MENTAL_HEALTH_QUESTIONS.length;

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <ClipboardDocumentCheckIcon className="w-8 h-8 text-cyan-500" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('wellnessCheckIn')}</h1>
            </div>
            
            {!result && (
                <Card>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">{t('wellnessCheckInDesc')}</p>
                    <div className="space-y-6">
                        {MENTAL_HEALTH_QUESTIONS.map((q, index) => (
                            <div key={q.id}>
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{index + 1}. {q.text}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {q.options.map(opt => (
                                        <button 
                                            key={opt} 
                                            onClick={() => handleAnswerChange(q.id, opt)}
                                            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${answers[q.id] === opt ? 'bg-primary-600 text-white' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-right">
                        <Button onClick={handleSubmit} disabled={!allQuestionsAnswered || isLoading}>
                            {isLoading ? t('analyzing') : t('getMySummary')}
                        </Button>
                    </div>
                </Card>
            )}

            {isLoading && !result && (
                <div className="text-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-slate-500 dark:text-slate-400">{t('analyzingSummary')}</p>
                </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            {result && (
                <Card>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('yourSummary')}</h2>
                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">{result}</p>
                </Card>
            )}

            {showChat && (
                <Card className="flex flex-col h-[500px]">
                     <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 border-b pb-2 dark:border-slate-600">{t('aSpaceToTalk')}</h3>
                     <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {chatMessages.map((msg, index) => (
                             <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-md px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                         {isChatLoading && (
                            <div className="flex justify-start">
                                 <div className="max-w-md px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100">
                                    <span className="animate-pulse">...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                     </div>
                     <form onSubmit={handleSendChatMessage} className="mt-4 flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder={t('tellMeFeeling')}
                            className="flex-grow px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
                            disabled={isChatLoading}
                        />
                        <Button type="submit" disabled={isChatLoading}>{t('send')}</Button>
                     </form>
                </Card>
            )}
        </div>
    );
};