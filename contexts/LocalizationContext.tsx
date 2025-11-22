import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { translationService } from '../services/translationService';

interface LocalizationContextType {
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
  language: string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

interface LocalizationProviderProps {
  children: ReactNode;
  language: string;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children, language }) => {
  const [englishStrings, setEnglishStrings] = useState<Record<string, string> | null>(null);
  const [translations, setTranslations] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to load the base english file
  useEffect(() => {
    const fetchEnglishStrings = async () => {
      try {
        const response = await fetch('/locales/en.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEnglishStrings(data);
      } catch (error) {
        console.error("Failed to load base English translations:", error);
        setEnglishStrings({}); // Set to empty to avoid infinite loading on error
      }
    };
    fetchEnglishStrings();
  }, []);

  // Effect to fetch translations for the selected language
  useEffect(() => {
    // Only run if we have the base english strings
    if (englishStrings === null) {
      return;
    }

    const fetchTranslations = async () => {
      setIsLoading(true);
      try {
        const newTranslations = await translationService.getTranslations(language, englishStrings);
        setTranslations(newTranslations);
      } catch (error) {
        console.error("Failed to fetch translations:", error);
        // Fallback to English strings in case of error
        setTranslations(englishStrings);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, [language, englishStrings]);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    // Use loaded translations, fallback to english, then to the key itself
    const strings = translations || englishStrings;
    if (!strings) return key; // Return key if nothing is loaded yet

    let translation = strings[key] || (englishStrings ? englishStrings[key] : '') || key;

    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
        });
    }
    return translation;
  }, [translations, englishStrings]);

  return (
    <LocalizationContext.Provider value={{ t, language }}>
      {children}
    </LocalizationContext.Provider>
  );
};
