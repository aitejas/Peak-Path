import { Chat } from "@google/genai";
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BrainIcon, RobotIcon, OwlIcon } from '../../components/icons/Icons';
import { createStudyBuddyChat, getStudyBuddyResponse } from '../../services/geminiService';
import { storageService } from '../../services/storageService';
import { Quiz } from '../../types';
import { useLocalization } from '../../contexts/LocalizationContext';

interface Message {
    sender: 'user' | 'model';
    text: string;
}

interface StudyBuddyInfo {
    name: string;
    avatar: 'Robot' | 'Owl' | 'Brain';
}

const AVATARS = {
    Robot: RobotIcon,
    Owl: OwlIcon,
    Brain: BrainIcon,
};

interface StudyBuddyPageProps {
  onStartLockdown: (durationMinutes: number) => void;
}

export const StudyBuddyPage: React.FC<StudyBuddyPageProps> = ({ onStartLockdown }) => {
    const [buddyInfo, setBuddyInfo] = useState<StudyBuddyInfo | null>(() => storageService.getItem('studyBuddy', null));
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const { t } = useLocalization();

    useEffect(() => {
        if (buddyInfo && !chatRef.current) {
            chatRef.current = createStudyBuddyChat();
            setIsLoading(true);

            const quizzes: Quiz[] = storageService.getItem('quizzes', []);
            let performanceSummary = "The user has not taken any quizzes yet.";
            if (quizzes.length > 0) {
                // For demonstration, let's just find the first quiz with a low score. A real app might average scores.
                 performanceSummary = "Based on recent quizzes, the user seems to have a good grasp of the material.";
                 // This part could be enhanced with actual score tracking. For now, we'll let the AI imagine performance.
            }
            
            getStudyBuddyResponse(chatRef.current, `Hello! Please introduce yourself based on your system instructions. Here is a summary of the user's recent performance: ${performanceSummary}`, performanceSummary)
                .then(intro => {
                    setMessages([{ sender: 'model', text: intro }]);
                })
                .catch(err => {
                    setMessages([{ sender: 'model', text: "Hello! I'm your new Study Buddy. I seem to be having a little trouble connecting to my full memory, but I'm here to help! What can we learn today?" }]);
                    console.error(err);
                })
                .finally(() => setIsLoading(false));
        }
    }, [buddyInfo]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chatRef.current) return;

        const userMessage: Message = { sender: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const modelResponse = await getStudyBuddyResponse(chatRef.current, userMessage.text);
            const modelMessage: Message = { sender: 'model', text: modelResponse };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("AI Tutor Error:", error);
            const errorMessage: Message = { sender: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSetupBuddy = (name: string, avatar: 'Robot' | 'Owl' | 'Brain') => {
        const newBuddyInfo = { name, avatar };
        setBuddyInfo(newBuddyInfo);
        storageService.setItem('studyBuddy', newBuddyInfo);
    };

    if (!buddyInfo) {
        return <OnboardingScreen onSetup={handleSetupBuddy} />;
    }
    
    const AvatarComponent = AVATARS[buddyInfo.avatar];

    return (
        <div className="space-y-6 flex flex-col h-full">
             <div className="flex items-center space-x-3">
                <AvatarComponent className="w-10 h-10 text-primary-500" />
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{buddyInfo.name}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('yourAIStudyBuddy')}</p>
                </div>
            </div>
            <Card className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'model' && <AvatarComponent className="w-8 h-8 text-primary-500 flex-shrink-0" />}
                            <div className={`max-w-lg px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'}`}>
                                {msg.text.split(/(\*\*|`|\[\[.*?\]\])/).map((part, i) => {
                                    if (part.startsWith('[[') && part.endsWith(']]')) {
                                        const buttonText = part.slice(2, -2);
                                        if (buttonText.includes('breathing exercise')) {
                                            return <Link key={i} to="/health/breathing"><Button className="my-1 px-2 py-1 text-sm">{buttonText}</Button></Link>;
                                        } else if (buttonText.includes('focus session')) {
                                            const duration = parseInt(buttonText.match(/\d+/)?.[0] || '15', 10);
                                            return <Button key={i} className="my-1 px-2 py-1 text-sm" onClick={() => onStartLockdown(duration)}>{buttonText}</Button>;
                                        }
                                    }
                                    return <span key={i}>{part}</span>;
                                })}
                            </div>
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex items-end gap-2 justify-start">
                             <AvatarComponent className="w-8 h-8 text-primary-500" />
                             <div className="max-w-lg px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100">
                                <span className="animate-pulse">...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('chatWithBuddy', { name: buddyInfo.name })}
                        className="flex-grow px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading}>{t('send')}</Button>
                </form>
            </Card>
        </div>
    );
};


const OnboardingScreen: React.FC<{ onSetup: (name: string, avatar: 'Robot' | 'Owl' | 'Brain') => void }> = ({ onSetup }) => {
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<'Robot' | 'Owl' | 'Brain'>('Robot');
    const { t } = useLocalization();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSetup(name, selectedAvatar);
        }
    }

    return (
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-lg text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('meetYourBuddy')}</h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">{t('setupBuddyDesc')}</p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('chooseAvatar')}</label>
                        <div className="flex justify-center gap-4">
                            {Object.keys(AVATARS).map(avatarKey => {
                                const Avatar = AVATARS[avatarKey as keyof typeof AVATARS];
                                return (
                                    <button
                                        key={avatarKey}
                                        type="button"
                                        onClick={() => setSelectedAvatar(avatarKey as 'Robot' | 'Owl' | 'Brain')}
                                        className={`p-4 rounded-full transition-all duration-200 ${selectedAvatar === avatarKey ? 'bg-primary-500/30 ring-2 ring-primary-500' : 'bg-slate-100 dark:bg-slate-700'}`}
                                    >
                                        <Avatar className="w-12 h-12 text-slate-700 dark:text-slate-200" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                     <div>
                        <label htmlFor="buddyName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('giveBuddyAName')}</label>
                        <input
                          id="buddyName"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t('buddyNameExample')}
                          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">{t('startLearning')}</Button>
                </form>
            </Card>
        </div>
    );
}