import React from 'react';
import { BookOpenIcon, BrainIcon, HeartIcon, ShieldCheckIcon, SparklesIcon, UserCircleIcon, ChartBarIcon } from '../components/icons/Icons';

export interface TutorialStep {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    icon: BookOpenIcon,
    title: 'Welcome to PeakPath!',
    description: "Ready for a quick tour? I'll show you the main features to get you started on your personalized learning journey.",
  },
  {
    icon: SparklesIcon,
    title: 'Three Core Zones',
    description: "The app has three main sections: the Study Zone for learning, the Health Hub for wellness, and the Parent Zone for safety and collaboration.",
  },
  {
    icon: BookOpenIcon,
    title: 'Power-Up Your Studies',
    description: "In the Study Zone, you can create quizzes on any topic with AI, tackle a Daily Challenge, and chat with your AI Study Buddy for help with tricky subjects.",
  },
  {
    icon: HeartIcon,
    title: 'Focus on Your Wellness',
    description: "The Health Hub is packed with tools! Look up calories in food, practice mindful breathing, or talk things out with our supportive wellness check-in.",
  },
  {
    icon: ShieldCheckIcon,
    title: 'Safety & Teamwork',
    description: "Parents can securely log in to view real-time location, send messages, set goals with you, and configure an emergency contact.",
  },
  {
    icon: ChartBarIcon,
    title: 'Climb the Ranks',
    description: "Everything you do earns you points! Complete goals and quizzes to improve your rank from Novice to Grandmaster and see how you stack up on the daily leaderboards.",
  },
  {
    icon: BrainIcon,
    title: 'Your AI Assistant',
    description: "See the floating brain icon? Tap it to control the app with your voice. Try saying, 'Navigate to my quizzes' or 'Start a 10-minute focus session'.",
  },
  {
    icon: UserCircleIcon,
    title: "You're in Control",
    description: "Click your avatar in the top-right to personalize your profile or restart this tutorial. You're all set to begin your adventure on PeakPath!",
  },
];
