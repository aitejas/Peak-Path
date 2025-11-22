import { GoogleGenAI, Type } from "@google/genai";
import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ClipboardDocumentCheckIcon, SparklesIcon, ClockIcon } from '../../components/icons/Icons';
import { Quiz, User } from '../../types';
import { storageService } from '../../services/storageService';
import { useLocalization } from '../../contexts/LocalizationContext';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getDayOfYear = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

const TOPICS = ["World History", "Indian Geography", "Basic Algebra", "Biology: The Cell", "Chemistry: The Periodic Table", "Physics: Motion", "Literature: Famous Authors", "Civics: Indian Constitution"];

interface DailyChallenge {
    day: number;
    year: number;
    quiz: Quiz;
    score: number | null;
    completed: boolean;
}

interface DailyChallengePageProps {
    user: User;
    awardPoints: (points: number) => void;
}

export const DailyChallengePage: React.FC<DailyChallengePageProps> = ({ user, awardPoints }) => {
    const [challenge, setChallenge] = useState<DailyChallenge | null>(() => storageService.getItem('dailyChallenge', null));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useLocalization();

    const currentYear = new Date().getFullYear();
    const currentDay = getDayOfYear(new Date());

    const generateNewChallenge = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const topic = TOPICS[(currentDay - 1) % TOPICS.length];
            const numQuestions = 40;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: `Generate a multiple-choice quiz with ${numQuestions} questions about "${topic}" suitable for a student in standard/grade ${user.grade} based on the NCERT curriculum. Ensure the questions are relevant to that grade level. For each question, provide four options and indicate the correct answer.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            questions: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        questionText: { type: Type.STRING },
                                        options: { type: Type.ARRAY, items: { type: 'STRING' } },
                                        correctAnswer: { type: Type.STRING }
                                    },
                                    required: ['questionText', 'options', 'correctAnswer']
                                }
                            }
                        },
                        required: ['questions']
                    }
                }
            });

            const quizData = JSON.parse(response.text.trim());
            if (!quizData.questions || !Array.isArray(quizData.questions)) {
                throw new Error("AI response did not contain a valid 'questions' array.");
            }

            const newChallenge: DailyChallenge = {
                day: currentDay,
                year: currentYear,
                quiz: {
                    id: `daily-${currentYear}-${currentDay}`,
                    title: `Daily Challenge: ${topic}`,
                    topic: topic,
                    questions: quizData.questions,
                },
                score: null,
                completed: false,
            };

            setChallenge(newChallenge);
            storageService.setItem('dailyChallenge', newChallenge);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to generate this week's challenge.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        const needsNewChallenge = !challenge || challenge.day !== currentDay || challenge.year !== currentYear;
        if (needsNewChallenge) {
            generateNewChallenge();
        }
    }, []);

    const handleQuizSubmit = (finalScore: number) => {
        if (!challenge) return;
        const scorePercentage = finalScore / challenge.quiz.questions.length;
        let points = 50; // Base points for completion
        if (scorePercentage >= 0.9) points += 200;
        else if (scorePercentage >= 0.75) points += 150;
        else if (scorePercentage >= 0.5) points += 100;
        
        awardPoints(points);

        const updatedChallenge = {
            ...challenge,
            score: finalScore,
            completed: true,
        };
        setChallenge(updatedChallenge);
        storageService.setItem('dailyChallenge', updatedChallenge);
    };

    if (isLoading && !challenge) {
        return (
            <Card className="text-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-slate-500 dark:text-slate-400">{t('generatingChallenge', { grade: user.grade })}</p>
            </Card>
        );
    }
    
    if (error) {
         return (
            <Card className="text-center p-8 bg-red-50 dark:bg-red-900/20">
                <p className="font-semibold text-red-600 dark:text-red-400">{t('error')}</p>
                <p className="mt-2 text-slate-600 dark:text-slate-400">{error}</p>
                 <Button onClick={generateNewChallenge} className="mt-4">{t('tryAgain')}</Button>
            </Card>
        );
    }

    if (!challenge) return null;

    if (!challenge.completed) {
        return (
            <>
                <div className="flex items-center space-x-3 mb-6">
                    <ClipboardDocumentCheckIcon className="w-8 h-8 text-purple-500" />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('dailyChallenge')}</h1>
                </div>
                <DailyQuizRunner quiz={challenge.quiz} onComplete={handleQuizSubmit} userGrade={user.grade!} />
            </>
        );
    }
    
    return (
        <Card className="text-center p-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('challengeComplete')}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mt-4" dangerouslySetInnerHTML={{
                __html: t('challengeScore', { 
                    score: challenge.score, 
                    total: challenge.quiz.questions.length 
                }).replace('<1>', '<span class="font-bold text-primary-500">').replace('</1>', '</span>')
            }} />
            <p className="mt-2 text-slate-500 dark:text-slate-400">
                {t('comeBackTomorrow')}
            </p>
        </Card>
    );

};

const DailyQuizRunner: React.FC<{ quiz: Quiz; onComplete: (score: number) => void; userGrade: number }> = ({ quiz, onComplete, userGrade }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 minutes in seconds
    const { t } = useLocalization();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (timeLeft <= 0) {
                onComplete(score);
            } else {
                setTimeLeft(timeLeft - 1);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, onComplete, score]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleAnswerSelect = (answer: string) => {
        if (isAnswered) return;
        setSelectedAnswer(answer);
        setIsAnswered(true);
        if (answer === quiz.questions[currentQuestionIndex].correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            onComplete(score);
        }
    };
    
    const getButtonClass = (option: string) => {
        if (!isAnswered) return 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200';
        const isCorrect = option === quiz.questions[currentQuestionIndex].correctAnswer;
        const isSelected = option === selectedAnswer;
        if (isCorrect) return 'bg-green-500 text-white';
        if (isSelected && !isCorrect) return 'bg-red-500 text-white';
        return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 opacity-70';
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <Card>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('dailyChallengeTitle', { topic: quiz.topic, grade: userGrade })}</h2>
                <div className="flex items-center gap-2 font-mono text-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-lg">
                    <ClockIcon className="w-6 h-6"/>
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </div>
            <div className="mb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('questionProgress', { current: currentQuestionIndex + 1, total: quiz.questions.length })}</p>
                <h3 className="text-xl font-semibold mt-1 text-slate-800 dark:text-slate-100">{currentQuestion.questionText}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, index) => (
                    <button key={index} onClick={() => handleAnswerSelect(option)} className={`w-full text-left p-4 rounded-lg transition-colors ${getButtonClass(option)}`} disabled={isAnswered}>
                        {option}
                    </button>
                ))}
            </div>
            {isAnswered && (
                <div className="mt-6 text-right">
                    <Button onClick={handleNextQuestion}>
                        {currentQuestionIndex < quiz.questions.length - 1 ? t('nextQuestion') : t('submitTest')}
                    </Button>
                </div>
            )}
        </Card>
    );
};