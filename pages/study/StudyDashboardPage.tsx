import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LockClosedIcon } from '../../components/icons/Icons';
import { useLocalization } from '../../contexts/LocalizationContext';

interface StudyDashboardPageProps {
  onStartLockdown: (duration: number) => void;
}

export const StudyDashboardPage: React.FC<StudyDashboardPageProps> = ({ onStartLockdown }) => {
  const ncertUrl = 'https://ncert.nic.in/';
  const { t } = useLocalization();

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('studyDashboard')}</h2>
      
      <Card>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <LockClosedIcon className="w-12 h-12 text-primary-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('focusWithLockdown')}</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {t('lockdownDesc')}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => onStartLockdown(5 * 60)}>{t('minutes', { count: 5 })}</Button>
              <Button onClick={() => onStartLockdown(10 * 60)}>{t('minutes', { count: 10 })}</Button>
              <Button onClick={() => onStartLockdown(15 * 60)}>{t('minutes', { count: 15 })}</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
         <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('externalResources')}</h3>
         <p className="text-slate-500 dark:text-slate-400 mt-1 mb-4">
            {t('ncertDesc')}
         </p>
         <a href={ncertUrl} target="_blank" rel="noopener noreferrer">
            <Button>{t('visitNCERT')}</Button>
         </a>
      </Card>
    </div>
  );
};