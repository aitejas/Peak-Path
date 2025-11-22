import React, { useState } from 'react';
import { getSportsCalories } from '../../services/geminiService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DumbbellIcon } from '../../components/icons/Icons';
import { SPORT_ACTIVITIES } from '../../constants';
import { SportActivity } from '../../types';
import { useLocalization } from '../../contexts/LocalizationContext';

export const SportsCalculatorPage: React.FC = () => {
  const [activity, setActivity] = useState<SportActivity>(SPORT_ACTIVITIES[0]);
  const [duration, setDuration] = useState(30); // in minutes
  const [weight, setWeight] = useState(70); // in kg
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocalization();

  const handleCalculate = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const calorieInfo = await getSportsCalories(activity.name, duration, weight);
      setResult(calorieInfo);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <DumbbellIcon className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('sportsCalorieCalculator')}</h1>
      </div>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('activity')}</label>
            <select
              value={activity.name}
              onChange={(e) => setActivity(SPORT_ACTIVITIES.find(a => a.name === e.target.value)!)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
            >
              {SPORT_ACTIVITIES.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('durationMinutes')}</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Math.max(0, parseInt(e.target.value, 10)))}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('weightKg')}</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Math.max(0, parseInt(e.target.value, 10)))}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-slate-100"
            />
          </div>
          <Button onClick={handleCalculate} disabled={isLoading} className="h-10">
            {isLoading ? t('calculating') : t('calculate')}
          </Button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </Card>

      {result !== null && (
        <Card>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('estimatedResult')}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300"
            dangerouslySetInnerHTML={{
                __html: t('caloriesBurned', { calories: `<span class="font-bold text-2xl text-primary-600 dark:text-primary-400">${result}</span>` })
            }}
          />
        </Card>
      )}
    </div>
  );
};