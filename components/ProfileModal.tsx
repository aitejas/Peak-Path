import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Button } from './ui/Button';
import * as Icons from './icons/Icons';
import { useLocalization } from '../contexts/LocalizationContext';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onSave: (user: User) => void;
    onStartTutorial: () => void;
    onLogout: () => void;
}

const AVATARS = {
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
const AVATAR_KEYS = Object.keys(AVATARS) as (keyof typeof AVATARS)[];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onSave, onStartTutorial, onLogout }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email || '');
    const [avatar, setAvatar] = useState(user.avatar);
    const [bio, setBio] = useState(user.bio || '');
    const [status, setStatus] = useState(user.status || '');
    const { t } = useLocalization();

    useEffect(() => {
        if (isOpen) {
            setName(user.name);
            setEmail(user.email || '');
            setAvatar(user.avatar);
            setBio(user.bio || '');
            setStatus(user.status || '');
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSaveProfile = () => {
        onSave({ ...user, name, email, avatar, bio, status });
        onClose();
    };

    const handleLogout = () => {
        if (window.confirm(t('confirmLogout'))) {
            onLogout();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('profile')}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Icons.XMarkIcon className="w-6 h-6 text-slate-500" />
                    </button>
                </header>

                <div className="p-6 overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('displayName')}</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('email')}</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('emailPlaceholder')} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"/>
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('bioLabel')}</label>
                             <textarea
                                 value={bio}
                                 onChange={e => setBio(e.target.value)}
                                 placeholder={t('bioPlaceholder')}
                                 className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"
                                 rows={3}
                             />
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('statusLabel')}</label>
                             <input
                                 type="text"
                                 value={status}
                                 onChange={e => setStatus(e.target.value)}
                                 placeholder={t('statusPlaceholder')}
                                 className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"
                             />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('avatar')}</label>
                            <div className="flex flex-wrap gap-4 max-h-48 overflow-y-auto p-1">
                                {AVATAR_KEYS.map(avatarKey => {
                                    const AvatarIcon = AVATARS[avatarKey];
                                    return (
                                        <button key={avatarKey} type="button" onClick={() => setAvatar(avatarKey)} className={`p-3 rounded-full transition-all ${avatar === avatarKey ? 'bg-primary-500/30 ring-2 ring-primary-500' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                            <AvatarIcon className="w-10 h-10 text-slate-700 dark:text-slate-200" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="text-right">
                            <Button onClick={handleSaveProfile}>{t('saveChanges')}</Button>
                        </div>

                         <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600 space-y-2">
                            <Button variant="secondary" onClick={onStartTutorial} className="w-full">
                                {t('showAppTutorial')}
                            </Button>
                             <Button variant="danger" onClick={handleLogout} className="w-full">
                                {t('logOut')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};