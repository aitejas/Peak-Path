import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AIProvider, useAI } from './contexts/AIContext';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { storageService } from './services/storageService';
import { User, Goal } from './types';
import { RANKS } from './constants';
import { INITIAL_GOALS } from './data/mockData';

import { AuthPage } from './pages/AuthPage';
import { ChoicePage } from './pages/ChoicePage';

import { StudyAppLayout } from './components/layout/StudyAppLayout';
import { HealthAppLayout } from './components/layout/HealthAppLayout';

import { LocationPage } from './pages/parent/LocationPage';
import { ParentDashboardPage } from './pages/parent/ParentDashboardPage';
import { EmergencyContactPage } from './pages/parent/EmergencyContactPage';
import { CommunicationPage } from './pages/parent/CommunicationPage';
import { GoalSettingPage } from './pages/parent/GoalSettingPage';
import { AchievementsPage } from './pages/AchievementsPage';

import { AIAssistant } from './components/AIAssistant';
import { BrainIcon } from './components/icons/Icons';
import { LockdownPage } from './pages/study/LockdownPage';
import { ProfileModal } from './components/ProfileModal';
import { Tutorial } from './components/Tutorial';
import { CelebrationModal } from './components/CelebrationModal';


// This component will contain the main app structure after login
const MainApp: React.FC<{
    user: User;
    onUserUpdate: (updatedUser: User) => void;
    onOpenProfile: () => void;
    goals: Goal[];
    addGoal: (goal: Omit<Goal, 'id' | 'progress' | 'completed'>) => void;
    deleteGoal: (goalId: string) => void;
    updateGoalProgress: (type: 'quiz' | 'focus' | 'wellness', value?: number) => void;
    awardPoints: (points: number) => void;
}> = ({ user, onUserUpdate, onOpenProfile, goals, addGoal, deleteGoal, updateGoalProgress, awardPoints }) => {
    const navigate = useNavigate();
    const { toggleTheme } = useTheme();
    const [lockdownDuration, setLockdownDuration] = useState<number | null>(null);

    const startLockdown = (durationMinutes: number) => {
        setLockdownDuration(durationMinutes * 60);
    };

    const finishLockdown = () => {
        if (lockdownDuration) {
            const durationMinutes = Math.floor(lockdownDuration / 60);
            updateGoalProgress('focus', durationMinutes);

            const pointsPer5Min = 10;
            const points = Math.floor(durationMinutes / 5) * pointsPer5Min;
            if (points > 0) {
                 awardPoints(points);
            }
        }
        setLockdownDuration(null);
    }

    if (lockdownDuration !== null) {
        return <LockdownPage duration={lockdownDuration} onFinish={finishLockdown} />;
    }

    return (
        <AIProvider
            navigate={navigate}
            startLockdown={startLockdown}
            toggleTheme={toggleTheme}
        >
            <Routes>
                <Route path="/" element={<ChoicePage user={user} />} />
                <Route path="/study/*" element={<StudyAppLayout user={user} onStartLockdown={startLockdown} onOpenProfile={onOpenProfile} awardPoints={awardPoints} goals={goals} updateGoalProgress={updateGoalProgress} />} />
                <Route path="/health/*" element={<HealthAppLayout user={user} onOpenProfile={onOpenProfile} awardPoints={awardPoints} updateGoalProgress={updateGoalProgress} />} />
                
                {/* Parent Routes */}
                <Route path="/parent" element={<Navigate to="/parent/dashboard" />} />
                <Route path="/parent/dashboard" element={<ParentDashboardPage />} />
                <Route path="/parent/location" element={<LocationPage />} />
                <Route path="/parent/communication" element={<CommunicationPage />} />
                <Route path="/parent/emergency" element={<EmergencyContactPage />} />
                <Route path="/parent/goals" element={<GoalSettingPage goals={goals} addGoal={addGoal} deleteGoal={deleteGoal} />} />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <AIAssistant />
            <AIAssistantButton />
        </AIProvider>
    );
};

const AIAssistantButton: React.FC = () => {
    const { openAi } = useAI();
    return (
        <button
            onClick={openAi}
            className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg z-30 transition-transform hover:scale-110"
            aria-label="Open AI Assistant"
        >
            <BrainIcon className="w-8 h-8" />
        </button>
    );
};

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(() => storageService.getItem('user', null));
    const [goals, setGoals] = useState<Goal[]>(() => storageService.getItem('goals', INITIAL_GOALS));
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const [newRankAchieved, setNewRankAchieved] = useState<string | null>(null);
    
    // Sync user state to localStorage
    useEffect(() => {
        if (user) {
            storageService.setItem('user', user);
        } else {
            storageService.removeItem('user');
        }
    }, [user]);

    // Sync goals state to localStorage
    useEffect(() => {
        storageService.setItem('goals', goals);
    }, [goals]);

    useEffect(() => {
        if (user) {
            const hasSeenTutorial = storageService.getItem('hasSeenTutorial', false);
            if (!hasSeenTutorial) {
                setIsTutorialOpen(true);
            }
        }
    }, [user?.name]);


    const handleLogin = (loginData: {
        name: string;
        grade?: number;
        role: 'student' | 'parent';
        childName?: string;
        email?: string;
        language?: string;
    }) => {
        const newUser: User = {
            name: loginData.name,
            avatar: 'UserCircleIcon',
            email: loginData.email || '',
            points: 0,
            streak: 0,
            lastActivityDate: '',
            grade: loginData.role === 'student' ? loginData.grade! : null,
            role: loginData.role,
            childName: loginData.childName,
            language: loginData.language,
            bio: '',
            status: '',
        };
        setUser(newUser);
    };

    const handleUserUpdate = (updatedUser: User) => {
        setUser(updatedUser);
    };

    const handleLogout = () => {
        // Clear all persisted data from localStorage to ensure a clean slate on next visit.
        const keysToRemove = [
            'user', 'goals', 'quizzes', 'studyBuddy', 
            'dailyChallenge', 'emergencyContact', 'chatMessages', 
            'childName', 'hasSeenTutorial', 'theme'
        ];
        keysToRemove.forEach(key => storageService.removeItem(key));
        
        // Clear session storage as well (for translations)
        sessionStorage.clear();

        // Reset all component state to its initial value.
        setUser(null);
        setGoals(INITIAL_GOALS);
        setIsProfileModalOpen(false);
        setIsTutorialOpen(false);
    };

    const handleCloseTutorial = () => {
        setIsTutorialOpen(false);
        storageService.setItem('hasSeenTutorial', true);
    };

    const handleStartTutorial = () => {
        setIsProfileModalOpen(false); // Close profile if open
        setIsTutorialOpen(true);
    };

    const awardPoints = (points: number) => {
        setUser(prevUser => {
            if (!prevUser) return null;

            // Streak Logic
            const today = new Date().toISOString().split('T')[0];
            let newStreak = prevUser.streak;
            if (prevUser.lastActivityDate !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];
                
                if (prevUser.lastActivityDate === yesterdayStr) {
                    newStreak += 1; // Increment streak
                } else {
                    newStreak = 1; // Reset streak
                }
            }
            
            // Rank up logic
            const currentPoints = prevUser.points;
            const newPoints = currentPoints + points;
            
            const currentRank = RANKS.slice().reverse().find(r => currentPoints >= r.pointsRequired);
            const newRank = RANKS.slice().reverse().find(r => newPoints >= r.pointsRequired);

            if (newRank && currentRank && newRank.name !== currentRank.name) {
                setNewRankAchieved(newRank.name);
            }

            return { 
                ...prevUser, 
                points: newPoints,
                streak: newStreak,
                lastActivityDate: today
            };
        });
    };

    const addGoal = (goalData: Omit<Goal, 'id' | 'progress' | 'completed'>) => {
        const newGoal: Goal = {
            id: `goal-${Date.now()}`,
            progress: 0,
            completed: false,
            ...goalData,
        };
        setGoals(prev => [...prev, newGoal]);
    };

    const deleteGoal = (goalId: string) => {
        setGoals(prev => prev.filter(g => g.id !== goalId));
    };

    const updateGoalProgress = (type: 'quiz' | 'focus' | 'wellness', value: number = 1) => {
        setGoals(prevGoals => {
            let goalCompletedInThisUpdate = false;
            const updatedGoals = prevGoals.map(goal => {
                const newGoal = { ...goal };
                if (newGoal.type === type && !newGoal.completed) {
                    const newProgress = newGoal.progress + value;
                    if (newProgress >= newGoal.target) {
                        newGoal.completed = true;
                        newGoal.progress = newGoal.target;
                        if (!goal.completed) { // ensure we only award points once
                           goalCompletedInThisUpdate = true;
                           awardPoints(newGoal.points);
                        }
                    } else {
                        newGoal.progress = newProgress;
                    }
                }
                return newGoal;
            });
            // Only return a new array if something has actually changed
            return JSON.stringify(prevGoals) !== JSON.stringify(updatedGoals) ? updatedGoals : prevGoals;
        });
         // Also update streak for any wellness goal
        if(type === 'wellness') {
            awardPoints(0); // This will trigger streak check without adding points
        }
    };

    return (
        <ThemeProvider>
            <LocalizationProvider language={user?.language || 'English'}>
                <HashRouter>
                    {user ? (
                        <>
                            <MainApp 
                                user={user} 
                                onUserUpdate={handleUserUpdate} 
                                onOpenProfile={() => setIsProfileModalOpen(true)}
                                goals={goals}
                                addGoal={addGoal}
                                deleteGoal={deleteGoal}
                                updateGoalProgress={updateGoalProgress}
                                awardPoints={awardPoints}
                            />
                            <CelebrationModal 
                                rank={newRankAchieved} 
                                onClose={() => setNewRankAchieved(null)} 
                            />
                            <ProfileModal 
                                isOpen={isProfileModalOpen}
                                onClose={() => setIsProfileModalOpen(false)}
                                user={user}
                                onSave={handleUserUpdate}
                                onStartTutorial={handleStartTutorial}
                                onLogout={handleLogout}
                            />
                            <Tutorial isOpen={isTutorialOpen} onClose={handleCloseTutorial} />
                        </>
                    ) : <AuthPage onLogin={handleLogin} />}
                </HashRouter>
            </LocalizationProvider>
        </ThemeProvider>
    );
};


export default App;