import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ShieldCheckIcon } from '../../components/icons/Icons';

export const ParentLoginPage: React.FC = () => {
  const [childName, setChildName] = useState('');
  const [credential, setCredential] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (childName.trim() && credential.trim()) {
      // In a real app, you'd send an OTP here. We'll simulate it.
      localStorage.setItem('childName', childName.trim());
      navigate('/parent/otp');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center">
            <ShieldCheckIcon className="w-16 h-16 text-primary-600 mb-4"/>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Parent Zone</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Please authenticate to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="childName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Your Child's Name
            </label>
            <input
              id="childName"
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Enter your child's name"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
              required
            />
          </div>
          <div>
            <label htmlFor="credential" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Your Phone Number or Email
            </label>
            <input
              id="credential"
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              placeholder="Enter your contact info"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Send One-Time Password
          </Button>
        </form>
         <div className="text-center mt-4">
            <Link to="/" className="text-sm text-primary-600 hover:underline dark:text-primary-400">
                Go Back
            </Link>
        </div>
      </Card>
    </div>
  );
};