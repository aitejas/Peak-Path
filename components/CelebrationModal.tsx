import React from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import * as Icons from './icons/Icons';
import { RANKS } from '../constants';
import { useLocalization } from '../contexts/LocalizationContext';

interface CelebrationModalProps {
    rank: string | null;
    onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({ rank, onClose }) => {
    const { t } = useLocalization();
    if (!rank) return null;

    const rankInfo = RANKS.find(r => r.name === rank);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <Card className="w-full max-w-md text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <Icons.SparklesIcon className="w-full h-full text-yellow-400" />
                </div>
                 <div className="relative z-10 p-6">
                    <Icons.SparklesIcon className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-pulse" />
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('congratulations')}</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        {t('rankUpMessage', { rank: rank })}
                    </p>
                    {rankInfo && (
                        <div className="mt-4 p-4 rounded-lg text-white" style={rankInfo.bgStyle}>
                            <h3 className="font-bold text-2xl drop-shadow-md">{rankInfo.name}</h3>
                        </div>
                    )}
                    <Button onClick={onClose} className="mt-6 w-full">{t('keepGoing')}</Button>
                </div>
            </Card>
        </div>
    );
}
