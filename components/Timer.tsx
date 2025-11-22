import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ClockIcon } from './icons/Icons';

interface TimerProps {
    initialSeconds?: number;
    onComplete?: () => void;
    title?: string;
}

export const Timer: React.FC<TimerProps> = ({ initialSeconds = 300, onComplete, title = "Timer" }) => {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        setIsRunning(false);
                        if (onComplete) onComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning, timeLeft, onComplete]);

    const toggleTimer = () => setIsRunning(!isRunning);
    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(initialSeconds);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <Card className="text-center p-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
                <ClockIcon className="w-6 h-6 text-primary-500" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
            </div>
            <div className="text-5xl font-mono font-bold text-slate-800 dark:text-slate-100 mb-6">
                {formatTime(timeLeft)}
            </div>
            <div className="flex justify-center space-x-4">
                <Button onClick={toggleTimer}>
                    {isRunning ? 'Pause' : 'Start'}
                </Button>
                <Button variant="secondary" onClick={resetTimer}>
                    Reset
                </Button>
            </div>
        </Card>
    );
};