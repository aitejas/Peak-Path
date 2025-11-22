import React from 'react';
import { BookOpenIcon, HeartIcon, ShieldCheckIcon, ChartBarIcon, FlameIcon, DumbbellIcon, LungsIcon, ClockIcon, HomeIcon, QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, ClipboardDocumentCheckIcon, BrainIcon, SparklesIcon, MapPinIcon, RobotIcon, UserCircleIcon } from './components/icons/Icons';
import { NavLinkItem, Sound, SportActivity } from './types';

export const MAIN_CHOICES = [
    {
      to: '/study',
      icon: BookOpenIcon,
      text: 'Study Zone',
      description: 'Access textbooks, quizzes, and focus tools.'
    },
    {
      to: '/health',
      icon: HeartIcon,
      text: 'Health Hub',
      description: 'Wellness tools for body and mind.'
    },
    {
      to: '/parent',
      icon: ShieldCheckIcon,
      text: 'Parent Zone',
      description: 'Monitor activity and location.'
    }
];

export const PARENT_DASHBOARD_LINKS = [
    {
      to: '/parent/location',
      icon: MapPinIcon,
      text: 'Track Location',
      description: "View your child's real-time location."
    },
    {
      to: '/parent/communication',
      icon: ChatBubbleLeftRightIcon,
      text: 'Communication',
      description: 'Send messages, audio, and video.'
    },
    {
      to: '/parent/emergency',
      icon: ShieldCheckIcon,
      text: 'Emergency Contact',
      description: 'Set up an emergency contact person.'
    },
    {
      to: '/parent/goals',
      icon: ClipboardDocumentCheckIcon,
      text: 'Goal Setting',
      description: 'Set and track learning goals.'
    }
];

export interface Rank {
  name: string;
  pointsRequired: number;
  bgStyle: React.CSSProperties;
  color: string;
}

export const RANKS: Rank[] = [
  { 
    name: 'Base', 
    pointsRequired: 0,
    color: 'text-slate-400',
    bgStyle: {
        background: 'radial-gradient(circle, rgba(63,63,70,1) 0%, rgba(30,30,39,1) 100%)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23999' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }
  },
  { 
    name: 'Silver', 
    pointsRequired: 500,
    color: 'text-gray-500',
    bgStyle: { 
        background: 'linear-gradient(145deg, #e0e0e0 0%, #a7a7a7 100%)',
        backgroundImage: `linear-gradient(rgba(255,255,255,.2) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.2) 2px, transparent 2px), linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
        backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
        backgroundPosition:'-2px -2px, -2px -2px, -1px -1px, -1px -1px'
     }
  },
  { 
    name: 'Gold', 
    pointsRequired: 1500,
    color: 'text-amber-500',
    bgStyle: { 
        background: 'linear-gradient(145deg, #FFD700 0%, #FFAA00 100%)',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'18\' viewBox=\'0 0 100 18\'%3E%3Cpath fill=\'%23DAA520\' fill-opacity=\'0.2\' d=\'M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 82.34 3.37 87.18 0H61.82zM100 18V0h-7.82c-3.47 1.45-6.86 3.78-11.3 7.34-4.57 3.68-8.9 7.07-13.74 10.66H100zM38.18 0c-3.47 1.45-6.86 3.78-11.3 7.34C22 11.24 17.66 14.63 12.82 18H38.18zM0 0v18h7.82c3.47-1.45 6.86-3.78 11.3-7.34C23.55 6.98 27.9 3.6 32.74 0H0z\'/%3E%3C/svg%3E")'
    }
  },
  { 
    name: 'Platinum', 
    pointsRequired: 4000,
    color: 'text-slate-300',
    bgStyle: { 
        background: 'linear-gradient(145deg, #e5e4e2 0%, #babcbf 100%)',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")'
    }
  },
  { 
    name: 'Diamond', 
    pointsRequired: 10000,
    color: 'text-sky-400',
    bgStyle: { 
        background: 'linear-gradient(145deg, #b9f2ff 0%, #82c2ff 100%)',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.15\'%3E%3Cpath opacity=\'.5\' d=\'M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z\'/%3E%3Cpath d=\'M6 5V0h1v5h5v1H6v5H5V6H0V5h5z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
    }
  },
];


export const HEALTH_NAV_LINKS: NavLinkItem[] = [
    { to: '/health', text: 'Dashboard', icon: HomeIcon, end: true },
    { to: '/health/achievements', text: 'My Progress', icon: SparklesIcon },
    { to: '/health/calories', text: 'Calorie Lookup', icon: FlameIcon },
    { to: '/health/sports', text: 'Sports Calculator', icon: DumbbellIcon },
    { to: '/health/breathing', text: 'Breathing', icon: LungsIcon },
    { to: '/health/mental-health', text: 'Mental Health Test', icon: ClipboardDocumentCheckIcon },
    { to: '/health/timers', text: 'Timers', icon: ClockIcon },
];

export const SPORT_ACTIVITIES: SportActivity[] = [
    { name: 'Running' },
    { name: 'Cycling' },
    { name: 'Swimming' },
    { name: 'Weight Lifting' },
    { name: 'Yoga' },
    { name: 'Walking' },
    { name: 'Dancing' },
];

export const DEFAULT_SOUNDS: Sound[] = [
    { id: 'rain', name: 'Rain', type: 'file', url: '/sounds/rain.mp3' },
    { id: 'forest', name: 'Forest', type: 'file', url: '/sounds/forest.mp3' },
    { id: 'waves', name: 'Ocean Waves', type: 'file', url: '/sounds/waves.mp3' },
    { id: 'fireplace', name: 'Fireplace', type: 'file', url: '/sounds/fireplace.mp3' },
];

export const STUDY_NAV_LINKS: NavLinkItem[] = [
    { to: '/study', text: 'Dashboard', icon: HomeIcon, end: true },
    { to: '/study/goals', text: 'My Goals', icon: ClipboardDocumentCheckIcon },
    { to: '/study/achievements', text: 'My Progress', icon: SparklesIcon },
    { to: '/study/my-quizzes', text: 'My Quizzes', icon: QuestionMarkCircleIcon },
    { to: '/study/buddy', text: 'AI Study Buddy', icon: BrainIcon },
    { to: '/study/automator', text: 'Web Automator', icon: RobotIcon },
    { to: '/study/daily-challenge', text: 'Daily Challenge', icon: ClipboardDocumentCheckIcon },
    { to: '/study/ranking', text: 'Ranking', icon: ChartBarIcon },
];

export const GOAL_PRESETS = [
  { text: 'Complete 3 quizzes', type: 'quiz' as const, target: 3, points: 50 },
  { text: 'Complete 5 quizzes', type: 'quiz' as const, target: 5, points: 100 },
  { text: 'Complete a 30 minute focus session', type: 'focus' as const, target: 30, points: 75 },
  { text: 'Use 2 wellness tools', type: 'wellness' as const, target: 2, points: 40 },
];

export const INDIAN_LANGUAGES = [
    'English', 'Hindi', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Gujarati', 
    'Urdu', 'Kannada', 'Odia', 'Malayalam', 'Punjabi', 'Assamese', 'Maithili', 
    'Santali', 'Kashmiri', 'Nepali', 'Sindhi', 'Konkani', 'Dogri', 'Manipuri', 'Bodo'
];

export const LANGUAGE_CODE_MAP: { [key: string]: string } = {
    'English': 'en-US',
    'Hindi': 'hi-IN',
    'Bengali': 'bn-IN',
    'Marathi': 'mr-IN',
    'Telugu': 'te-IN',
    'Tamil': 'ta-IN',
    'Gujarati': 'gu-IN',
    'Urdu': 'ur-IN',
    'Kannada': 'kn-IN',
    'Odia': 'or-IN',
    'Malayalam': 'ml-IN',
    'Punjabi': 'pa-IN',
    'Assamese': 'as-IN',
    'Maithili': 'mai-IN',
    'Santali': 'sat-IN',
    'Kashmiri': 'ks-IN',
    'Nepali': 'ne-NP',
    'Sindhi': 'sd-IN',
    'Konkani': 'kok-IN',
    'Dogri': 'dgo-IN',
    'Manipuri': 'mni-IN',
    'Bodo': 'brx-IN'
};