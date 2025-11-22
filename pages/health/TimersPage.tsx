import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useLocalization } from '../../contexts/LocalizationContext';

const formatTime = (time: number) => {
    const milliseconds = `00${time % 1000}`.slice(-3,-1);
    const seconds = `0${Math.floor(time / 1000) % 60}`.slice(-2);
    const minutes = `0${Math.floor(time / 60000) % 60}`.slice(-2);
    return `${minutes}:${seconds}.${milliseconds}`;
};

const Stopwatch = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const timerRef = useRef<number | null>(null);
    const { t } = useLocalization();

    useEffect(() => {
        if (isRunning) {
            const startTime = Date.now() - time;
            timerRef.current = window.setInterval(() => {
                setTime(Date.now() - startTime);
            }, 10);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning]);

    const handleStartPause = () => setIsRunning(!isRunning);
    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
        setLaps([]);
    };
    const handleLap = () => setLaps([time, ...laps]);

    return (
        <Card>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('stopwatch')}</h2>
            <p className="text-5xl font-mono text-center my-4 text-slate-800 dark:text-slate-100">{formatTime(time)}</p>
            <div className="flex justify-center gap-2">
                <Button onClick={handleStartPause}>{isRunning ? t('pause') : t('start')}</Button>
                <Button onClick={handleReset} variant="secondary">{t('reset')}</Button>
                <Button onClick={handleLap} variant="secondary" disabled={!isRunning}>{t('lap')}</Button>
            </div>
            <ul className="mt-4 space-y-1 max-h-40 overflow-y-auto">
                {laps.map((lap, i) => (
                    <li key={i} className="text-sm text-slate-500 dark:text-slate-400 text-center font-mono">
                        {t('lapProgress', { count: laps.length - i, time: formatTime(lap) })}
                    </li>
                ))}
            </ul>
        </Card>
    );
};

const Timer = () => {
    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);
    const [timeLeft, setTimeLeft] = useState(minutes * 60 * 1000);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef<number | null>(null);
    const { t } = useLocalization();

    useEffect(() => {
        if (!isRunning) {
            setTimeLeft(minutes * 60000 + seconds * 1000);
        }
    }, [minutes, seconds, isRunning]);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            const endTime = Date.now() + timeLeft;
            timerRef.current = window.setInterval(() => {
                const newTimeLeft = endTime - Date.now();
                if (newTimeLeft <= 0) {
                    setTimeLeft(0);
                    setIsRunning(false);
                    if (timerRef.current) clearInterval(timerRef.current);
                    alert("Time's up!");
                } else {
                    setTimeLeft(newTimeLeft);
                }
            }, 100);
        } else if (timeLeft === 0 && isRunning) {
             setIsRunning(false);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning]);
    
    const handleStartPause = () => setIsRunning(!isRunning);
    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(minutes * 60000 + seconds * 1000);
    };
    
    return (
         <Card>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('timer')}</h2>
            <div className="flex justify-center gap-2 mb-4 items-center">
                 <input type="number" value={minutes} onChange={e => setMinutes(Math.max(0, parseInt(e.target.value, 10)) || 0)} className="w-24 p-2 rounded bg-slate-100 dark:bg-slate-700 text-center" disabled={isRunning} />
                 <span className="font-bold">:</span>
                 <input type="number" value={seconds} onChange={e => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value, 10))) || 0)} className="w-24 p-2 rounded bg-slate-100 dark:bg-slate-700 text-center" disabled={isRunning} />
            </div>
            <p className="text-5xl font-mono text-center my-4 text-slate-800 dark:text-slate-100">{formatTime(timeLeft)}</p>
            <div className="flex justify-center gap-2">
                <Button onClick={handleStartPause}>{isRunning ? t('pause') : t('start')}</Button>
                <Button onClick={handleReset} variant="secondary">{t('reset')}</Button>
            </div>
        </Card>
    )
}

const Alarm = () => {
    const [alarmTime, setAlarmTime] = useState('08:00');
    const [isAlarmSet, setIsAlarmSet] = useState(false);
    const { t } = useLocalization();
    
    const triggerAlarm = () => {
        // Vibrate the device
        if ('vibrate' in navigator) {
            navigator.vibrate([500, 200, 500, 200, 500]);
        }

        // Play an audible tone
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 2); // Play for 2 seconds
        } catch (error) {
            console.error("Could not play alarm sound:", error);
        }

        // Display an alert
        alert(`Alarm! It's ${alarmTime}.`);
    };
    
    useEffect(() => {
        let interval: number;
        if(isAlarmSet) {
            interval = window.setInterval(() => {
                const now = new Date();
                const [hours, minutes] = alarmTime.split(':');
                if(now.getHours() === parseInt(hours) && now.getMinutes() === parseInt(minutes) && now.getSeconds() === 0) {
                    triggerAlarm();
                    setIsAlarmSet(false);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isAlarmSet, alarmTime]);

    return (
        <Card>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('alarm')}</h2>
            <div className="flex justify-center items-center gap-4">
                <input type="time" value={alarmTime} onChange={e => setAlarmTime(e.target.value)} className="p-2 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100" disabled={isAlarmSet} />
                <Button onClick={() => setIsAlarmSet(prev => !prev)}>
                    {isAlarmSet ? t('cancelAlarm') : t('setAlarm')}
                </Button>
            </div>
            {isAlarmSet && <p className="text-center mt-2 text-green-500">{t('alarmSetFor', { time: alarmTime })}</p>}
        </Card>
    );
};

export const TimersPage: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <Stopwatch />
            <div className="space-y-6">
                <Timer />
                <Alarm />
            </div>
        </div>
    );
};