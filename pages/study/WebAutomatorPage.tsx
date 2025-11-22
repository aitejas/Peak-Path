import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SparklesIcon } from '../../components/icons/Icons';
import { automateWebTask } from '../../services/geminiService';
import { useLocalization } from '../../contexts/LocalizationContext';

export const WebAutomatorPage: React.FC = () => {
    const [task, setTask] = useState('');
    const [content, setContent] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { t } = useLocalization();

    const handlePerformTask = async () => {
        if (!task.trim() || !content.trim()) {
            setError('Please provide both a task and content.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult('');
        try {
            const response = await automateWebTask(task, content);
            setResult(response);
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <SparklesIcon className="w-8 h-8 text-yellow-500" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('aiWebAutomator')}</h1>
            </div>
            <Card>
                 <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-300">
                        {t('automatorDesc')}
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('task')}</label>
                        <input 
                            type="text" 
                            value={task} 
                            onChange={e => setTask(e.target.value)} 
                            placeholder={t('taskExample')}
                            className="mt-1 w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('content')}</label>
                        <textarea 
                            value={content} 
                            onChange={e => setContent(e.target.value)} 
                            placeholder={t('contentPlaceholder')}
                            rows={10} 
                            className="mt-1 w-full p-2 border rounded-md bg-white text-slate-900 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"
                        ></textarea>
                    </div>
                    <Button onClick={handlePerformTask} disabled={isLoading} className="w-full">
                        {isLoading ? t('processing') : t('performAITask')}
                    </Button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
            </Card>

            {isLoading && (
                <Card className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">{t('aiIsWorking')}</p>
                </Card>
            )}

            {result && (
                <Card>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('result')}</h3>
                    <div className="mt-2 p-4 bg-slate-100 dark:bg-slate-700 rounded-md whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto">
                        {result}
                    </div>
                </Card>
            )}
        </div>
    );
};