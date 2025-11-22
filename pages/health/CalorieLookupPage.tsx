import React, { useState, useRef } from 'react';
import { getFoodCalories } from '../../services/geminiService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FlameIcon, CameraIcon, XMarkIcon } from '../../components/icons/Icons';
import { useLocalization } from '../../contexts/LocalizationContext';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

export const CalorieLookupPage: React.FC = () => {
  const [dish, setDish] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLocalization();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleLookup = async () => {
    if (!dish.trim() && !imageFile) {
      setError('Please enter a dish name or upload an image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult('');
    try {
      let imagePayload;
      if (imageFile) {
        const base64 = await fileToBase64(imageFile);
        imagePayload = { base64, mimeType: imageFile.type };
      }
      const calorieInfo = await getFoodCalories(dish, imagePayload);
      setResult(calorieInfo);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FlameIcon className="w-8 h-8 text-orange-500" />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('foodCalorieLookup')}</h1>
      </div>
      <Card>
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300">{t('calorieLookupDesc')}</p>
          
          {imagePreview && (
            <div className="relative w-full max-w-sm mx-auto">
              <img src={imagePreview} alt="Food preview" className="rounded-lg w-full h-auto" />
              <button onClick={clearImage} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/75">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={dish}
              onChange={(e) => setDish(e.target.value)}
              placeholder={t('dishExample')}
              className="flex-grow px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-slate-100"
            />
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center">
                <CameraIcon className="w-5 h-5 mr-2" />
                {t('uploadPhoto')}
            </Button>
          </div>
           <Button onClick={handleLookup} disabled={isLoading} className="w-full">
              {isLoading ? t('calculating') : t('getCalories')}
            </Button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </Card>
      
      {isLoading && (
        <div className="text-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-slate-500 dark:text-slate-400">{t('aiIsCalculating')}</p>
        </div>
      )}

      {result && (
        <Card>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('result')} {dish && t('resultFor', { dish })}</h2>
          <p className="text-lg text-primary-600 dark:text-primary-400 font-semibold">{result}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">{t('calorieEstimateNote')}</p>
        </Card>
      )}
    </div>
  );
};