import React, { useState, useEffect } from 'react';
import { getMotivationalQuote } from '../../services/geminiService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface LockdownPageProps {
  duration: number; // in seconds
  onFinish: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const LockdownPage: React.FC<LockdownPageProps> = ({ duration, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [quote, setQuote] = useState('');
  const [breathingText, setBreathingText] = useState('Breathe In...');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onFinish]);
  
  useEffect(() => {
    const fetchQuote = async () => {
        try {
            const newQuote = await getMotivationalQuote();
            setQuote(newQuote);
        } catch (error) {
            setQuote("The secret to getting ahead is getting started.");
        }
    };
    fetchQuote();
    const quoteInterval = setInterval(fetchQuote, 20000); // Fetch a new quote every 20 seconds
    
    const breathingInterval = setInterval(() => {
        setBreathingText(prev => prev === 'Breathe In...' ? 'Breathe Out...' : 'Breathe In...');
    }, 4000); // Change every 4 seconds

    return () => {
        clearInterval(quoteInterval);
        clearInterval(breathingInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center p-4 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-widest">{formatTime(timeLeft)}</h1>
        <p className="text-2xl mt-4 text-slate-300 animate-pulse">{breathingText}</p>

        <div className="mt-16 h-24 flex items-center justify-center">
            {quote ? (
                 <p className="text-xl italic text-slate-400 max-w-2xl">"{quote}"</p>
            ): (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
            )}
        </div>
      </div>
      
      <div className="absolute bottom-10 text-center">
        <Card className="bg-slate-800/50">
            <h3 className="font-bold text-slate-200">Emergency Contact</h3>
            <p className="text-sm text-slate-400 my-2">
                This is a focus mode. For a real emergency, please use your phone's native dialer. Web applications cannot make emergency calls.
            </p>
            <Button variant='danger' onClick={() => alert("This is a simulated emergency call button. Use your phone's dialer for real emergencies.")}>
                Simulated Emergency Call
            </Button>
        </Card>
        <p className="text-xs text-slate-500 mt-4">
          Note: Lockdown mode can be exited by using browser controls (e.g., Back button, closing tab).
        </p>
      </div>
    </div>
  );
};
