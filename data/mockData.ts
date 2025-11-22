import { Goal, Quiz } from '../types';

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-init-1',
    text: 'Complete the General Science Quiz',
    type: 'quiz',
    target: 1,
    progress: 0,
    points: 100,
    completed: false,
  },
  {
    id: 'goal-init-2',
    text: 'Try a 5-minute Focus Session',
    type: 'focus',
    target: 5,
    progress: 0,
    points: 50,
    completed: false,
  },
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-sample-1',
    title: 'General Science Basics',
    topic: 'Science',
    questions: [
      {
        questionText: 'What is the chemical symbol for Water?',
        options: ['O2', 'H2O', 'CO2', 'NaCl'],
        correctAnswer: 'H2O',
      },
      {
        questionText: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 'Mars',
      },
      {
        questionText: 'What gas do plants absorb from the atmosphere?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Helium'],
        correctAnswer: 'Carbon Dioxide',
      },
      {
        questionText: 'What is the hardest natural substance on Earth?',
        options: ['Gold', 'Iron', 'Diamond', 'Platinum'],
        correctAnswer: 'Diamond',
      },
      {
        questionText: 'How many bones are in the adult human body?',
        options: ['206', '208', '210', '205'],
        correctAnswer: '206',
      }
    ],
  },
];
