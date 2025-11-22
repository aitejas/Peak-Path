import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { MAIN_CHOICES } from '../constants';
import { User } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';

interface ChoicePageProps {
  user: User;
}

export const ChoicePage: React.FC<ChoicePageProps> = ({ user }) => {
  const { t } = useLocalization();

  const choices = [
    { key: 'studyZone', to: '/study', icon: MAIN_CHOICES[0].icon },
    { key: 'healthHub', to: '/health', icon: MAIN_CHOICES[1].icon },
    { key: 'parentZone', to: '/parent', icon: MAIN_CHOICES[2].icon },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
      <div className="text-center w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('helloUser', { name: user.name })}</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-12">{t('whatToDoToday')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {choices.map(choice => (
            <Link to={choice.to} key={choice.to} className="block">
              <Card className="hover:scale-105 hover:shadow-2xl transition-all duration-300 p-8 h-full">
                <choice.icon className="w-16 h-16 text-primary-600 mx-auto mb-4"/>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t(choice.key)}</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">{t(`${choice.key}Desc`)}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};