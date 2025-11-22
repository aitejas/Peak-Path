import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Goal } from '../../types';
import { GOAL_PRESETS } from '../../constants';
import { TrashIcon, PlusCircleIcon, ClipboardDocumentCheckIcon } from '../../components/icons/Icons';
import { useLocalization } from '../../contexts/LocalizationContext';

interface GoalSettingPageProps {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'progress' | 'completed'>) => void;
  deleteGoal: (goalId: string) => void;
}

export const GoalSettingPage: React.FC<GoalSettingPageProps> = ({ goals, addGoal, deleteGoal }) => {
  const activeGoals = goals.filter(g => !g.completed);
  const { t } = useLocalization();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <ClipboardDocumentCheckIcon className="w-10 h-10 text-primary-500"/>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('collaborativeGoalSetting')}</h1>
            <p className="text-slate-500 dark:text-slate-400">{t('collaborativeGoalSettingDesc')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">{t('addNewGoal')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {GOAL_PRESETS.map((preset, index) => (
              <Button key={index} variant="secondary" onClick={() => addGoal(preset)} className="justify-start text-left h-auto py-2">
                <PlusCircleIcon className="w-5 h-5 mr-2 flex-shrink-0"/>
                <span>{t('goalPresetText', { text: preset.text, points: preset.points })}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">{t('activeGoalsCount', { count: activeGoals.length })}</h2>
          {activeGoals.length > 0 ? (
            <ul className="space-y-3">
              {activeGoals.map(goal => (
                <li key={goal.id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{goal.text}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {goal.type === 'focus' 
                            ? t('progressMinutes', { progress: goal.progress, target: goal.target })
                            : t('progressGeneric', { progress: goal.progress, target: goal.target })
                        }
                    </p>
                  </div>
                  <Button variant="danger" onClick={() => deleteGoal(goal.id)} className="!p-2">
                    <TrashIcon className="w-5 h-5"/>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-4">{t('noActiveGoalsParent')}</p>
          )}
        </div>
        
        <div className="text-center mt-6">
          <Link to="/parent/dashboard">
            <Button variant="secondary">{t('backToDashboard')}</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};