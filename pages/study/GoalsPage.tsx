import React from 'react';
import { Card } from '../../components/ui/Card';
import { Goal } from '../../types';
import { ClipboardDocumentCheckIcon } from '../../components/icons/Icons';
import { useLocalization } from '../../contexts/LocalizationContext';

interface GoalsPageProps {
  goals: Goal[];
}

const GoalItem: React.FC<{ goal: Goal }> = ({ goal }) => {
  const { t } = useLocalization();
  const progressPercentage = Math.min((goal.progress / goal.target) * 100, 100);
  return (
    <Card className={`transition-opacity ${goal.completed ? 'opacity-60' : ''}`}>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{goal.text}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        {t('reward', { points: goal.points })}
      </p>
      <div className="mt-3">
        <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
          <span>{t('progress')}</span>
          <span>{goal.progress} / {goal.target}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
          <div
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      {goal.completed && (
        <p className="text-center font-semibold text-green-500 mt-3">{t('completed')}</p>
      )}
    </Card>
  );
};

export const GoalsPage: React.FC<GoalsPageProps> = ({ goals }) => {
  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);
  const { t } = useLocalization();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <ClipboardDocumentCheckIcon className="w-8 h-8 text-indigo-500" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('myGoals')}</h1>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">{t('activeGoals')}</h2>
        {activeGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGoals.map(goal => <GoalItem key={goal.id} goal={goal} />)}
          </div>
        ) : (
          <Card className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400">{t('noActiveGoals')}</p>
          </Card>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">{t('completedGoals')}</h2>
         {completedGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedGoals.map(goal => <GoalItem key={goal.id} goal={goal} />)}
          </div>
        ) : (
          <Card className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400">{t('noCompletedGoals')}</p>
          </Card>
        )}
      </div>

    </div>
  );
};