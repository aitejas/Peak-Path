import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import * as Icons from '../icons/Icons';
import { User } from '../../types';
import { useLocalization } from '../../contexts/LocalizationContext';

interface HeaderProps {
  title: string;
  user: User;
  onMenuClick: () => void;
  onProfileClick: () => void;
}

const AVATAR_MAP: { [key: string]: React.ComponentType<{ className?: string }> } = {
    UserCircleIcon: Icons.UserCircleIcon,
    RobotIcon: Icons.RobotIcon,
    OwlIcon: Icons.OwlIcon,
    BrainIcon: Icons.BrainIcon,
    AcademicCapIcon: Icons.AcademicCapIcon,
    RocketLaunchIcon: Icons.RocketLaunchIcon,
    BeakerIcon: Icons.BeakerIcon,
    GlobeAmericasIcon: Icons.GlobeAmericasIcon,
    MusicalNoteIcon: Icons.MusicalNoteIcon,
    PuzzlePieceIcon: Icons.PuzzlePieceIcon,
    PaintBrushIcon: Icons.PaintBrushIcon,
    BoltIcon: Icons.BoltIcon,
    StarIcon: Icons.StarIcon,
    TrophyIcon: Icons.TrophyIcon,
    FaceSmileIcon: Icons.FaceSmileIcon,
    CloudIcon: Icons.CloudIcon,
    GiftIcon: Icons.GiftIcon,
    BriefcaseIcon: Icons.BriefcaseIcon,
    ComputerDesktopIcon: Icons.ComputerDesktopIcon,
};

const getRank = (points: number): { name: string; color: string } => {
    if (points < 100) return { name: 'Novice', color: 'text-slate-400' };
    if (points < 500) return { name: 'Apprentice', color: 'text-lime-500' };
    if (points < 1000) return { name: 'Scholar', color: 'text-sky-500' };
    if (points < 2000) return { name: 'Prodigy', color: 'text-indigo-500' };
    if (points < 5000) return { name: 'Master', color: 'text-amber-500' };
    return { name: 'Grandmaster', color: 'text-red-500' };
}


export const Header: React.FC<HeaderProps> = ({ title, user, onMenuClick, onProfileClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLocalization();
  const AvatarComponent = AVATAR_MAP[user.avatar] || Icons.UserCircleIcon;
  const rank = getRank(user.points);

  return (
    <header className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10 p-4 sm:p-6 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center space-x-4">
        <button 
            onClick={onMenuClick} 
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 md:hidden"
            aria-label={t('openNavMenu')}
        >
            <Icons.MenuIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
          {theme === 'light' ? <Icons.MoonIcon className="w-6 h-6" /> : <Icons.SunIcon className="w-6 h-6 text-yellow-400" />}
        </button>
        <button onClick={onProfileClick} className="flex items-center space-x-3 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="hidden sm:flex flex-col items-end">
                <span className="font-medium text-sm text-slate-700 dark:text-slate-200">{user.name}</span>
                <span className={`text-xs font-bold ${rank.color}`}>{rank.name} - {user.points} pts</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center font-bold text-white">
                <AvatarComponent className="w-6 h-6" />
            </div>
        </button>
      </div>
    </header>
  );
};