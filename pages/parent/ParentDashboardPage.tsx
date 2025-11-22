import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PARENT_DASHBOARD_LINKS } from '../../constants';
import { ShieldCheckIcon } from '../../components/icons/Icons';
import { useLocalization } from '../../contexts/LocalizationContext';

const LINK_KEYS: { [key: string]: string } = {
    '/parent/location': 'trackLocation',
    '/parent/communication': 'communication',
    '/parent/emergency': 'emergencyContact',
    '/parent/goals': 'goalSetting',
};

export const ParentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLocalization();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
      <div className="text-center w-full max-w-4xl">
        <div className="flex flex-col items-center mb-12">
            <ShieldCheckIcon className="w-20 h-20 text-primary-600 mb-4"/>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">{t('parentDashboard')}</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">{t('parentDashboardDesc')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PARENT_DASHBOARD_LINKS.map(choice => {
              const textKey = LINK_KEYS[choice.to];
              return (
                <Link to={choice.to} key={choice.to} className="block group">
                  <Card className="hover:scale-105 hover:shadow-2xl transition-all duration-300 p-8 h-full group-hover:bg-primary-50 dark:group-hover:bg-slate-700">
                    <choice.icon className="w-16 h-16 text-primary-600 mx-auto mb-4"/>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t(textKey)}</h2>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">{t(`${textKey}Desc`)}</p>
                  </Card>
                </Link>
              )
          })}
        </div>
        <div className="mt-12">
            <Button variant="secondary" onClick={() => navigate('/')}>{t('backToMainApp')}</Button>
        </div>
      </div>
    </div>
  );
};