import React from 'react';

export interface User {
  name: string;
  avatar: string; // e.g., 'UserCircleIcon', 'RobotIcon'
  email?: string;
  points: number;
  streak: number;
  lastActivityDate: string; // ISO Date string e.g., '2023-10-27'
  grade: number | null;
  role: 'student' | 'parent';
  childName?: string;
  language?: string;
  bio?: string;
  status?: string;
}

export interface NavLinkItem {
  to: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface Sound {
  id: string;
  name: string;
  type: 'file' | 'youtube';
  url: string; // file path or youtube video ID
}

export interface Question {
    questionText: string;
    options: string[];
    correctAnswer: string;
}

export interface Quiz {
    id:string;
    title: string;
    topic: string;
    questions: Question[];
}

export interface SportActivity {
  name: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
}

export type ChatMessageContent = 
  | { type: 'text'; value: string } 
  | { type: 'audio'; value: string } // base64 data URL
  | { type: 'video'; value: string }; // data URL

export interface ChatMessage {
  id: number;
  sender: 'child' | 'parent'; // Assuming a simple 2-party chat
  content: ChatMessageContent;
  timestamp: number;
}

export interface Goal {
  id: string;
  text: string;
  type: 'quiz' | 'focus' | 'wellness';
  target: number;
  progress: number;
  points: number;
  completed: boolean;
}