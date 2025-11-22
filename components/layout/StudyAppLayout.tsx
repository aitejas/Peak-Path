import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, Quiz, Goal } from '../../types';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { StudyDashboardPage } from '../../pages/study/StudyDashboardPage';
import { MyQuizzesPage } from '../../pages/study/MyQuizzesPage';
import { QuizCreatorPage } from '../../pages/study/QuizCreatorPage';
import { CustomQuizRunnerPage } from '../../pages/study/CustomQuizRunnerPage';
import { StudyBuddyPage } from '../../pages/study/TutorPage';
import { WebAutomatorPage } from '../../pages/study/WebAutomatorPage';
import { DailyChallengePage } from '../../pages/study/DailyChallengePage';
import { RankingPage } from '../../pages/study/RankingPage';
import { GoalsPage } from '../../pages/study/GoalsPage';
import { AchievementsPage } from '../../pages/AchievementsPage';
import { STUDY_NAV_LINKS } from '../../constants';
import { BookOpenIcon } from '../icons/Icons';
import { storageService } from '../../services/storageService';
import { useLocalization } from '../../contexts/LocalizationContext';
import { INITIAL_QUIZZES } from '../../data/mockData';

interface StudyAppLayoutProps {
    user: User;
    onStartLockdown: (durationMinutes: number) => void;
    onOpenProfile: () => void;
    awardPoints: (points: number) => void;
    goals: Goal[];
    updateGoalProgress: (type: 'quiz' | 'focus' | 'wellness', value?: number) => void;
}

export const StudyAppLayout: React.FC<StudyAppLayoutProps> = ({ user, onStartLockdown, onOpenProfile, awardPoints, goals, updateGoalProgress }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [quizzes, setQuizzes] = useState<Quiz[]>(() => storageService.getItem('quizzes', INITIAL_QUIZZES));
    const navigate = useNavigate();
    const { t } = useLocalization();

    const saveQuizzes = (newQuizzes: Quiz[]) => {
        setQuizzes(newQuizzes);
        storageService.setItem('quizzes', newQuizzes);
    };

    const handleSaveQuiz = (newQuiz: Quiz) => {
        awardPoints(20); // Award points for creating a quiz
        saveQuizzes([...quizzes, newQuiz]);
        navigate('/study/my-quizzes');
    };

    const handleDeleteQuiz = (quizId: string) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            saveQuizzes(quizzes.filter(q => q.id !== quizId));
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                navLinks={STUDY_NAV_LINKS}
                title={t('studyZone')}
                titleIcon={BookOpenIcon}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title={t('studyZone')} user={user} onMenuClick={() => setSidebarOpen(true)} onProfileClick={onOpenProfile} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <Routes>
                        <Route path="/" element={<StudyDashboardPage onStartLockdown={(durationSeconds) => onStartLockdown(durationSeconds / 60)} />} />
                        <Route path="/goals" element={<GoalsPage goals={goals} />} />
                        <Route path="/achievements" element={<AchievementsPage user={user} />} />
                        <Route path="/my-quizzes" element={<MyQuizzesPage quizzes={quizzes} deleteQuiz={handleDeleteQuiz} />} />
                        <Route path="/create-quiz" element={<QuizCreatorPage onSaveQuiz={handleSaveQuiz} />} />
                        <Route path="/quiz/:quizId" element={<CustomQuizRunnerPage quizzes={quizzes} awardPoints={awardPoints} updateGoalProgress={updateGoalProgress} />} />
                        <Route path="/buddy" element={<StudyBuddyPage onStartLockdown={onStartLockdown} />} />
                        <Route path="/automator" element={<WebAutomatorPage />} />
                        <Route path="/daily-challenge" element={<DailyChallengePage user={user} awardPoints={awardPoints} />} />
                        <Route path="/ranking" element={<RankingPage user={user} />} />
                        <Route path="*" element={<Navigate to="/study" />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};