import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LungsIcon } from '../../components/icons/Icons';
import { useLocalization } from '../../contexts/LocalizationContext';

type Speed = 'Slow' | 'Medium' | 'Fast';

const SPEEDS: Record<Speed, { in: number, out: number }> = {
  Slow: { in: 5000, out: 7000 },
  Medium: { in: 4000, out: 4000 },
  Fast: { in: 2500, out: 2500 },
};

interface BreathingPageProps {
    awardPoints: (points: number) => void;
    updateGoalProgress: (type: 'wellness', value?: number) => void;
}

export const BreathingPage: React.FC<BreathingPageProps> = ({ awardPoints, updateGoalProgress }) => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [speed, setSpeed] = useState<Speed>('Medium');
  const [text, setText] = useState('Get Ready...');
  const [animationClass, setAnimationClass] = useState('');
  const sessionStartTime = useRef<number | null>(null);
  const { t } = useLocalization();

  useEffect(() => {
    setText(t('getReady'));
  }, [t]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isBreathing) {
      const cycle = () => {
        setText(t('breatheIn'));
        setAnimationClass('scale-125');
        timeout = setTimeout(() => {
          setText(t('breatheOut'));
          setAnimationClass('scale-100');
          timeout = setTimeout(cycle, SPEEDS[speed].out);
        }, SPEEDS[speed].in);
      };
      cycle();
    } else {
      setText(t('getReady'));
      setAnimationClass('');
    }
    return () => clearTimeout(timeout);
  }, [isBreathing, speed, t]);

  const handleToggleSession = () => {
      if (!isBreathing) {
          sessionStartTime.current = Date.now();
          setIsBreathing(true);
      } else {
          setIsBreathing(false);
          if (sessionStartTime.current) {
              const durationSeconds = (Date.now() - sessionStartTime.current) / 1000;
              if (durationSeconds > 30) { // Award points if session is longer than 30s
                  awardPoints(15);
                  updateGoalProgress('wellness');
              }
          }
      }
  };
  
  const speedKeys: Speed[] = ['Slow', 'Medium', 'Fast'];
  const speedTKeys: { [key in Speed]: string } = {
    'Slow': 'slow',
    'Medium': 'medium',
    'Fast': 'fast',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <LungsIcon className="w-8 h-8 text-teal-500" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('breathingExercise')}</h1>
      </div>
      <Card className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <div className={`relative w-48 h-48 rounded-full bg-primary-500/20 dark:bg-primary-500/30 flex items-center justify-center transition-transform duration-[3000ms] ease-in-out ${animationClass}`}>
          <div className="absolute w-full h-full rounded-full bg-primary-500/50 dark:bg-primary-500/60 animate-pulse"></div>
          <p className="text-xl font-semibold text-slate-800 dark:text-slate-100 z-10">{text}</p>
        </div>

        <div className="mt-8">
            <Button onClick={handleToggleSession}>
                {isBreathing ? t('stopSession') : t('startSession')}
            </Button>
        </div>
      </Card>
      <Card>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{t('pace')}</h3>
          <div className="flex justify-center gap-2">
            {speedKeys.map(s => (
                <Button key={s} variant={speed === s ? 'primary' : 'secondary'} onClick={() => setSpeed(s)} disabled={isBreathing}>
                    {t(speedTKeys[s])}
                </Button>
            ))}
          </div>
      </Card>
    </div>
  );
};