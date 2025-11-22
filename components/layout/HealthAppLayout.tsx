import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { User } from '../../types';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { HealthDashboardPage } from '../../pages/health/HealthDashboardPage';
import { CalorieLookupPage } from '../../pages/health/CalorieLookupPage';
import { SportsCalculatorPage } from '../../pages/health/SportsCalculatorPage';
import { BreathingPage } from '../../pages/health/BreathingPage';
import { MentalHealthTestPage } from '../../pages/health/RelaxationSoundsPage';
import { TimersPage } from '../../pages/health/TimersPage';
import { AchievementsPage } from '../../pages/AchievementsPage';
import { HEALTH_NAV_LINKS } from '../../constants';
import { HeartIcon } from '../icons/Icons';
import { useLocalization } from '../../contexts/LocalizationContext';

interface HealthAppLayoutProps {
    user: User;
    onOpenProfile: () => void;
    awardPoints: (points: number) => void;
    updateGoalProgress: (type: 'quiz' | 'focus' | 'wellness', value?: number) => void;
}

export const HealthAppLayout: React.FC<HealthAppLayoutProps> = ({ user, onOpenProfile, awardPoints, updateGoalProgress }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { t } = useLocalization();

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                navLinks={HEALTH_NAV_LINKS}
                title={t('healthHub')}
                titleIcon={HeartIcon}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title={t('healthHub')} user={user} onMenuClick={() => setSidebarOpen(true)} onProfileClick={onOpenProfile} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <Routes>
                        <Route path="/" element={<HealthDashboardPage />} />
                        <Route path="/achievements" element={<AchievementsPage user={user} />} />
                        <Route path="/calories" element={<CalorieLookupPage />} />
                        <Route path="/sports" element={<SportsCalculatorPage />} />
                        <Route path="/breathing" element={<BreathingPage awardPoints={awardPoints} updateGoalProgress={updateGoalProgress} />} />
                        <Route path="/mental-health" element={<MentalHealthTestPage awardPoints={awardPoints} updateGoalProgress={updateGoalProgress} />} />
                        <Route path="/timers" element={<TimersPage />} />
                        <Route path="*" element={<Navigate to="/health" />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};