import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ChartBarIcon, SparklesIcon } from '../../components/icons/Icons';
import { User } from '../../types';
import { getLeaderboardData } from '../../services/geminiService';
import { useLocalization } from '../../contexts/LocalizationContext';

interface RankingPageProps {
    user: User;
}

const getRank = (points: number): { name: string; color: string } => {
    if (points < 100) return { name: 'Novice', color: 'text-slate-400' };
    if (points < 500) return { name: 'Apprentice', color: 'text-lime-500' };
    if (points < 1000) return { name: 'Scholar', color: 'text-sky-500' };
    if (points < 2000) return { name: 'Prodigy', color: 'text-indigo-500' };
    if (points < 5000) return { name: 'Master', color: 'text-amber-500' };
    return { name: 'Grandmaster', color: 'text-red-500' };
}

export const RankingPage: React.FC<RankingPageProps> = ({ user }) => {
    const [leaderboard, setLeaderboard] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const rank = getRank(user.points);
    const { t } = useLocalization();

    const handleGenerateLeaderboard = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const leaderboardText = await getLeaderboardData(user.name, user.points);
            setLeaderboard(leaderboardText);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Could not generate leaderboard.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <ChartBarIcon className="w-8 h-8 text-purple-500" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('dailyRanking')}</h1>
            </div>

            <Card className="text-center">
                <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-300">{t('yourRank')}</h2>
                <p className={`text-5xl font-bold my-2 ${rank.color}`}>{rank.name}</p>
                <p className="text-2xl text-slate-800 dark:text-slate-100">{t('points', { count: user.points })}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('rankClimb')}</p>
            </Card>

            <Card>
                 <h3 className="text-xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <SparklesIcon className="w-6 h-6 text-yellow-400"/>
                    {t('simulatedLeaderboard')}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 my-2">
                    {t('leaderboardDesc')}
                </p>
                <Button onClick={handleGenerateLeaderboard} disabled={isLoading}>
                    {isLoading ? t('generating') : t('showMyRank')}
                </Button>

                {isLoading && (
                     <div className="text-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">{t('calculatingRanks')}</p>
                    </div>
                )}
                
                {error && <p className="text-red-500 mt-4">{error}</p>}

                {leaderboard && (
                     <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-md whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto">
                        {leaderboard}
                    </div>
                )}
            </Card>

        </div>
    );
};