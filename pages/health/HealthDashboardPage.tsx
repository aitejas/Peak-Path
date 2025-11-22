import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { HEALTH_NAV_LINKS } from '../../constants';
import { useLocalization } from '../../contexts/LocalizationContext';

export const HealthDashboardPage: React.FC = () => {
  const featureLinks = HEALTH_NAV_LINKS.filter(link => link.to !== '/health');
  const { t } = useLocalization();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('healthDashboard')}</h1>
      <p className="text-lg text-slate-600 dark:text-slate-300">{t('healthDashboardDesc')}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureLinks.map(link => (
          <Link to={link.to} key={link.to} className="block hover:scale-105 transition-transform duration-200">
            <Card className="h-full flex flex-col items-center justify-center text-center p-6">
              <link.icon className="w-12 h-12 text-primary-500 mb-4" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{link.text}</h2>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};