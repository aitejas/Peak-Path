import { GoogleGenAI, Type } from "@google/genai";
import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PlusCircleIcon } from '../../components/icons/Icons';
import { Quiz } from '../../types';
import { useLocalization } from '../../contexts/LocalizationContext';

interface QuizCreatorPageProps {
  onSaveQuiz: (quiz: Quiz) => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const QuizCreatorPage: React.FC<QuizCreatorPageProps> = ({ onSaveQuiz }) => {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocalization();

  const handleGenerateQuiz = async () => {
    if (!topic.trim() || !title.trim()) {
        setError('Please fill in all fields.');
        return;
    }
    setIsLoading(true);
    setError(null);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using pro for better reasoning on quiz generation
            contents: `Generate a multiple-choice quiz with ${numQuestions} questions about "${topic}". For each question, provide four options and indicate the correct answer.`,
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
                                    options: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    },
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

        const newQuiz: Quiz = {
            id: `quiz-${Date.now()}`,
            title,
            topic,
            questions: quizData.questions,
        };
        onSaveQuiz(newQuiz);

    } catch (err: unknown) {
        console.error("Error generating quiz with Gemini:", err);
        setError(t('errorQuizGeneration'));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <PlusCircleIcon className="w-8 h-8 text-green-500" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('createQuiz')}</h1>
      </div>
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('quizTitle')}</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('quizTitleExample')} className="mt-1 w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('topicLabel')}</label>
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t('topicExample')} className="mt-1 w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('numQuestions')}</label>
            <select value={numQuestions} onChange={(e) => setNumQuestions(parseInt(e.target.value))} className="mt-1 w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600">
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
            </select>
          </div>
          <Button onClick={handleGenerateQuiz} disabled={isLoading} className="w-full">
            {isLoading ? t('generatingQuiz') : t('generateQuiz')}
          </Button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </Card>
    </div>
  );
};