import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ShieldCheckIcon } from '../../components/icons/Icons';
import { storageService } from '../../services/storageService';
import { EmergencyContact } from '../../types';
import { useLocalization } from '../../contexts/LocalizationContext';

export const EmergencyContactPage: React.FC = () => {
  const [contact, setContact] = useState<EmergencyContact>({ name: '', phone: '' });
  const [savedContact, setSavedContact] = useState<EmergencyContact | null>(() => storageService.getItem('emergencyContact', null));
  const [isSaved, setIsSaved] = useState(false);
  const { t } = useLocalization();

  useEffect(() => {
    if (savedContact) {
      setContact(savedContact);
    }
  }, []);

  const handleSave = () => {
    storageService.setItem('emergencyContact', contact);
    setSavedContact(contact);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000); // Hide confirmation message after 3 seconds
  };

  const handleNotify = () => {
    if (savedContact) {
      alert(`Simulating notification to ${savedContact.name} at ${savedContact.phone}.\n\nIn a real emergency, please use a phone to call for help.`);
    } else {
      alert('No emergency contact is set. Please save a contact first.');
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-lg">
        <div className="flex items-center space-x-4 mb-6">
            <ShieldCheckIcon className="w-10 h-10 text-red-500"/>
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('emergencyContactTitle')}</h1>
                <p className="text-slate-500 dark:text-slate-400">{t('emergencyContactSetup')}</p>
            </div>
        </div>

        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('contactName')}</label>
                <input
                    type="text"
                    name="name"
                    value={contact.name}
                    onChange={handleInputChange}
                    placeholder={t('contactNameExample')}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('phoneNumber')}</label>
                <input
                    type="tel"
                    name="phone"
                    value={contact.phone}
                    onChange={handleInputChange}
                    placeholder={t('phoneNumberExample')}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
                />
            </div>
            <div className="text-right">
                <Button onClick={handleSave} disabled={!contact.name || !contact.phone}>
                    {isSaved ? t('saved') : t('saveContact')}
                </Button>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('emergencyAction')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">{t('emergencyActionDesc')}</p>
            <Button variant="danger" className="w-full" onClick={handleNotify} disabled={!savedContact}>
                {t('notifyContactNow', { name: savedContact?.name || 'Contact' })}
            </Button>
        </div>

        <div className="text-center mt-6">
            <Link to="/parent/dashboard">
                <Button variant="secondary">{t('backToDashboard')}</Button>
            </Link>
        </div>
      </Card>
    </div>
  );
};