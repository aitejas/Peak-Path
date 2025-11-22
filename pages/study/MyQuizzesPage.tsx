import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { QuestionMarkCircleIcon, PlusCircleIcon, TrashIcon } from '../../components/icons/Icons';
import { Quiz } from '../../types';
import { useLocalization } from '../../contexts/LocalizationContext';

interface MyQuizzesPageProps {
  quizzes: Quiz[];
  deleteQuiz: (quizId: string) => void;
}

export const MyQuizzesPage: React.FC<MyQuizzesPageProps> = ({ quizzes, deleteQuiz }) => {
  const { t } = useLocalization();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <QuestionMarkCircleIcon className="w-8 h-8 text-indigo-500" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('myQuizzes')}</h1>
        </div>
        <Link to="/study/create-quiz">
            <Button>
                <PlusCircleIcon className="w-5 h-5 mr-2"/>
                {t('createQuiz')}
            </Button>
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <Card className="text-center py-12">
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">{t('noQuizzes')}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{t('noQuizzesDesc')}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => (
            <Card key={quiz.id} className="flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{quiz.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('topic', { topic: quiz.topic })}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('questionsCount', { count: quiz.questions.length })}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Link to={`/study/quiz/${quiz.id}`}>
                  <Button>{t('startQuiz')}</Button>
                </Link>
                <Button variant="danger" onClick={() => deleteQuiz(quiz.id)}>
                    <TrashIcon className="w-5 h-5"/>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};