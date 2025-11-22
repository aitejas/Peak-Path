import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Quiz } from '../../types';
import { useLocalization } from '../../contexts/LocalizationContext';

interface CustomQuizRunnerPageProps {
  quizzes: Quiz[];
  awardPoints: (points: number) => void;
  updateGoalProgress: (type: 'quiz' | 'focus' | 'wellness', value?: number) => void;
}

export const CustomQuizRunnerPage: React.FC<CustomQuizRunnerPageProps> = ({ quizzes, awardPoints, updateGoalProgress }) => {
  const { quizId } = useParams<{ quizId: string }>();
  const quiz = useMemo(() => quizzes.find(q => q.id === quizId), [quizzes, quizId]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const { t } = useLocalization();

  useEffect(() => {
    if (showResult && quiz) {
      const basePoints = 50;
      const scorePercentage = score / quiz.questions.length;
      let bonusPoints = 0;
      if (scorePercentage > 0.8) {
          bonusPoints = 100;
      } else if (scorePercentage > 0.6) {
          bonusPoints = 50;
      }
      awardPoints(basePoints + bonusPoints);
      updateGoalProgress('quiz');
    }
  }, [showResult, quiz, score, awardPoints, updateGoalProgress]);


  if (!quiz) {
    return (
      <Card className="text-center p-8">
        <h2 className="text-2xl font-bold">{t('quizNotFound')}</h2>
        <p className="mt-2">{t('quizNotFoundDesc')}</p>
        <Link to="/study/my-quizzes" className="mt-4 inline-block">
          <Button>{t('backToMyQuizzes')}</Button>
        </Link>
      </Card>
    );
  }

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === quiz.questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
        return 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200';
    }
    const isCorrect = option === quiz.questions[currentQuestionIndex].correctAnswer;
    const isSelected = option === selectedAnswer;

    if (isCorrect) {
        return 'bg-green-500 text-white';
    }
    if (isSelected && !isCorrect) {
        return 'bg-red-500 text-white';
    }
    return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 opacity-70';
  }

  if (showResult) {
    return (
      <Card className="text-center p-8">
        <h2 className="text-3xl font-bold mb-4">{t('quizComplete')}</h2>
        <p className="text-xl mb-6">{t('youScored', { score, total: quiz.questions.length })}</p>
        <Link to="/study/my-quizzes">
          <Button>{t('finish')}</Button>
        </Link>
      </Card>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{quiz.title}</h1>
        <Card>
            <div className="mb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('questionProgress', { current: currentQuestionIndex + 1, total: quiz.questions.length })}</p>
                <h2 className="text-xl font-semibold mt-1 text-slate-800 dark:text-slate-100">{currentQuestion.questionText}</h2>
            </div>
            <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                    <button 
                        key={index}
                        onClick={() => handleAnswerSelect(option)}
                        className={`w-full text-left p-4 rounded-lg transition-colors ${getButtonClass(option)}`}
                        disabled={isAnswered}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {isAnswered && (
                <div className="mt-6 text-right">
                    <Button onClick={handleNextQuestion}>
                        {currentQuestionIndex < quiz.questions.length - 1 ? t('nextQuestion') : t('showResults')}
                    </Button>
                </div>
            )}
        </Card>
    </div>
  );
};