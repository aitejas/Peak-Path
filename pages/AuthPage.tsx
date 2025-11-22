import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BookOpenIcon, UserCircleIcon, ClipboardDocumentCheckIcon, ShieldCheckIcon, ChatBubbleLeftRightIcon } from '../components/icons/Icons';
import { INDIAN_LANGUAGES } from '../constants';
import { useLocalization } from '../contexts/LocalizationContext';

interface AuthPageProps {
  onLogin: (data: {
    name: string;
    grade?: number;
    role: 'student' | 'parent';
    childName?: string;
    email?: string;
    language?: string;
  }) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('English');
  const [grade, setGrade] = useState(0);
  const [childName, setChildName] = useState('');
  const [credential, setCredential] = useState('');
  const { t } = useLocalization();

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStep(2);
    }
  };

  const handleLanguageSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setStep(3);
  }

  const handleRoleSelect = (role: 'student' | 'parent') => {
    if (role === 'student') {
        setStep(4);
    } else {
        setStep(5);
    }
  };

  const handleGradeSelect = (selectedGrade: number) => {
    setGrade(selectedGrade);
  };
  
  const handleFinalSubmit = () => {
      if (name.trim() && grade > 0) {
          onLogin({ name: name.trim(), grade, role: 'student', language });
      }
  }

  const handleParentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && childName.trim() && credential.trim()) {
        localStorage.setItem('childName', childName.trim());
        onLogin({
            name: name.trim(),
            role: 'parent',
            childName: childName.trim(),
            email: credential.trim(),
            language,
        });
    }
  }
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="flex flex-col items-center">
                <BookOpenIcon className="w-16 h-16 text-primary-600 mb-4"/>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('welcomeToPeakPath')}</h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">{t('personalLearningJourney')}</p>
            </div>
            <form onSubmit={handleNameSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('whatShouldWeCallYou')}
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('enterYourName')}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-slate-800 dark:text-slate-200"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {t('next')}
              </Button>
            </form>
          </>
        );
      case 2:
        return (
            <>
                <div className="flex flex-col items-center">
                    <ChatBubbleLeftRightIcon className="w-16 h-16 text-primary-600 mb-4"/>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('chooseYourLanguage')}</h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">{t('selectPreferredLanguage')}</p>
                </div>
                <form onSubmit={handleLanguageSubmit} className="mt-8 space-y-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-2">
                        {INDIAN_LANGUAGES.map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                onClick={() => setLanguage(lang)}
                                className={`p-2 text-center rounded-lg font-semibold transition-colors text-sm ${language === lang ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                    <Button type="submit" className="w-full">
                        {t('next')}
                    </Button>
                </form>
            </>
        );
      case 3:
        return (
            <>
                <div className="flex flex-col items-center">
                    <UserCircleIcon className="w-16 h-16 text-primary-600 mb-4"/>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('welcomeUser', { name })}</h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">{t('tellUsWhoYouAre')}</p>
                </div>
                <div className="mt-8 space-y-4">
                    <Button onClick={() => handleRoleSelect('student')} className="w-full flex items-center justify-center text-lg py-3">
                        <UserCircleIcon className="w-6 h-6 mr-2" />
                        {t('imAStudent')}
                    </Button>
                    <Button onClick={() => handleRoleSelect('parent')} variant="secondary" className="w-full flex items-center justify-center text-lg py-3">
                        <ShieldCheckIcon className="w-6 h-6 mr-2" />
                        {t('imAParent')}
                    </Button>
                </div>
            </>
        );
      case 4:
        return (
            <>
                <div className="flex flex-col items-center">
                    <ClipboardDocumentCheckIcon className="w-16 h-16 text-primary-600 mb-4"/>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('helloUser', { name })}</h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">{t('selectYourGrade')}</p>
                </div>
                <div className="mt-8 space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                            <button
                                key={g}
                                onClick={() => handleGradeSelect(g)}
                                className={`p-3 text-center rounded-lg font-semibold transition-colors ${grade === g ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                    <Button onClick={handleFinalSubmit} disabled={grade === 0} className="w-full">
                        {t('getStarted')}
                    </Button>
                </div>
            </>
        );
    case 5:
        return (
             <>
                <div className="flex flex-col items-center">
                    <ShieldCheckIcon className="w-16 h-16 text-primary-600 mb-4"/>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('parentSetup')}</h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">{t('parentSetupDetails')}</p>
                </div>
                <form onSubmit={handleParentLogin} className="mt-8 space-y-6">
                  <div>
                    <label htmlFor="childName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t('yourChildsName')}
                    </label>
                    <input
                      id="childName"
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder={t('enterChildsName')}
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="credential" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t('yourContactInfo')}
                    </label>
                    <input
                      id="credential"
                      type="text"
                      value={credential}
                      onChange={(e) => setCredential(e.target.value)}
                      placeholder={t('enterContactInfo')}
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-200"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {t('completeSetup')}
                  </Button>
                </form>
             </>
        );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <Card className="w-full max-w-md">
        {renderStep()}
      </Card>
    </div>
  );
};