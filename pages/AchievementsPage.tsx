import React, { useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { User } from '../types';
import { RANKS, Rank } from '../constants';
import * as Icons from '../components/icons/Icons';
import { useLocalization } from '../contexts/LocalizationContext';
import { ProgressChart } from '../components/ProgressChart';

const MastercardLogo = () => (
    <div className="relative h-12 w-20">
        <div className="absolute h-12 w-12 rounded-full bg-red-500 opacity-90 top-0 left-0"></div>
        <div className="absolute h-12 w-12 rounded-full bg-yellow-500 opacity-80 top-0 left-8"></div>
    </div>
);

const AchievementCard: React.FC<{ rank: Rank, user: User, isUnlocked: boolean }> = ({ rank, user, isUnlocked }) => {
    const { t } = useLocalization();

    const balanceDisplay = isUnlocked 
        ? `$${user.points.toLocaleString('en-US')}` 
        : `${rank.pointsRequired.toLocaleString('en-US')} PTS`;

    const cardHolderName = isUnlocked ? user.name.toUpperCase() : "LOCKED";

    return (
        <div className={`relative rounded-2xl p-6 text-white shadow-lg w-full max-w-sm aspect-[1.586] flex flex-col justify-between overflow-hidden transition-all duration-300 ${!isUnlocked ? 'grayscale opacity-60' : 'hover:scale-105 hover:shadow-2xl'}`} style={rank.bgStyle}>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-16 -left-10 w-40 h-40 rounded-full bg-white/5"></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-light text-sm opacity-80">{rank.name}</p>
                    </div>
                    <MastercardLogo />
                </div>
            </div>
             <div className="relative z-10">
                <p className="font-light text-xs opacity-80">{isUnlocked ? 'Balance' : t('pointsRequired', { count: '' })}</p>
                <p className="font-bold text-4xl tracking-wider -ml-1">
                    {balanceDisplay}
                </p>
            </div>
            <div className="relative z-10 flex justify-between items-end">
                <div className="font-mono text-lg tracking-wider">
                     <p>{isUnlocked ? '**** **** **** 7439' : '**** **** **** ****'}</p>
                </div>
                 <div className="text-right">
                    <p className="text-xs opacity-80">VALID THRU</p>
                    <p className="font-medium text-sm">05/26</p>
                 </div>
            </div>
        </div>
    );
};


interface AchievementsPageProps {
    user: User;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({ user }) => {
    const { t } = useLocalization();
    const currentRank = RANKS.slice().reverse().find(r => user.points >= r.pointsRequired)!;
    
    // Mock data for the chart - in a real app, this would come from user history
    const chartData = useMemo(() => [
        { day: 'Mon', points: Math.floor(user.points * 0.1) },
        { day: 'Tue', points: Math.floor(user.points * 0.15) },
        { day: 'Wed', points: Math.floor(user.points * 0.2) },
        { day: 'Thu', points: Math.floor(user.points * 0.1) },
        { day: 'Fri', points: Math.floor(user.points * 0.25) },
        { day: 'Sat', points: Math.floor(user.points * 0.1) },
        { day: 'Sun', points: Math.floor(user.points * 0.1) },
    ], [user.points]);

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-3">
                <Icons.SparklesIcon className="w-8 h-8 text-yellow-500" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('myProgress')}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <ProgressChart data={chartData} title={t('weeklyActivity')} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                     <Card className="text-center flex flex-col justify-center">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('currentRank')}</h2>
                        <p className={`text-4xl font-bold my-2 ${currentRank.color}`}>{currentRank.name}</p>
                        <p className="text-xl text-slate-800 dark:text-slate-100">{t('points', { count: user.points.toLocaleString() })}</p>
                    </Card>
                    <Card className="text-center flex flex-col justify-center">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('activityStreak')}</h2>
                        <p className="text-5xl font-bold my-2 text-orange-500 flex items-center justify-center">
                            <Icons.FlameIcon className="w-12 h-12 mr-2"/>
                            {user.streak}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400">{t('consecutiveDays')}</p>
                    </Card>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">{t('myCards')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {RANKS.map(rank => (
                         <AchievementCard 
                            key={rank.name} 
                            rank={rank} 
                            user={user} 
                            isUnlocked={user.points >= rank.pointsRequired} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};