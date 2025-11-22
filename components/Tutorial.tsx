import React, { useState, useEffect } from 'react';
import { TUTORIAL_STEPS } from '../data/tutorialData';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { XMarkIcon } from './icons/Icons';
import { useLocalization } from '../contexts/LocalizationContext';
import { LANGUAGE_CODE_MAP } from '../constants';

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialKeys = [
    'tutorialWelcome',
    'tutorialThreeZones',
    'tutorialPowerUpStudies',
    'tutorialFocusWellness',
    'tutorialSafetyTeamwork',
    'tutorialClimbRanks',
    'tutorialAIAssistant',
    'tutorialYouInControl'
];

export const Tutorial: React.FC<TutorialProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const { t, language } = useLocalization();

  // This effect ensures the tutorial always starts from the first step
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const loadVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
    };
    // Voices are loaded asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // Initial attempt

    return () => {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel(); // Cleanup speech on unmount
    };
  }, []);
  
  useEffect(() => {
    if (isOpen && voices.length > 0) {
        const stepKey = tutorialKeys[currentStep];
        const title = t(`${stepKey}`);
        const description = t(`${stepKey}Desc`);
        const textToSpeak = `${title}. ${description}`;

        window.speechSynthesis.cancel(); // Stop any previous speech
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        const languageCode = LANGUAGE_CODE_MAP[language] || 'en-US';
        utterance.lang = languageCode;

        // Find a suitable voice
        let selectedVoice = voices.find(voice => voice.lang === languageCode && voice.name.toLowerCase().includes('female'));
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang === languageCode);
        }
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        
        utterance.pitch = 1.2;
        utterance.rate = 0.95;

        window.speechSynthesis.speak(utterance);
    }
  }, [currentStep, isOpen, voices, t, language]);

  const handleClose = () => {
      window.speechSynthesis.cancel();
      onClose();
  };

  if (!isOpen) {
    return null;
  }

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose(); // Finish on the last step
        }
        setIsAnimating(false);
    }, 200);
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
        setIsAnimating(false);
    }, 200)
  };
  
  const handleSkip = () => {
    handleClose();
  }

  const step = TUTORIAL_STEPS[currentStep];
  const stepKey = tutorialKeys[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-lg relative transition-transform duration-200 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
        <button onClick={handleSkip} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
          <XMarkIcon className="w-6 h-6 text-slate-500" />
        </button>
        
        <div className="text-center p-4">
          <step.icon className="w-20 h-20 text-primary-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t(stepKey)}</h2>
          <p className="text-slate-600 dark:text-slate-300 min-h-[72px]">{t(`${stepKey}Desc`)}</p>
        </div>

        <div className="flex justify-between items-center p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-500">
                {t('tutorialStep', { current: currentStep + 1, total: TUTORIAL_STEPS.length })}
            </div>
            <div className="flex gap-2">
                 {currentStep > 0 && (
                    <Button variant="secondary" onClick={handlePrev}>{t('previous')}</Button>
                )}
                <Button onClick={handleNext}>
                    {isLastStep ? t('finishTour') : t('gotIt')}
                </Button>
            </div>
        </div>
        <div className="text-center pb-4">
            <button onClick={handleSkip} className="text-sm text-slate-500 hover:underline">
                {t('skipTutorial')}
            </button>
        </div>
      </Card>
    </div>
  );
};