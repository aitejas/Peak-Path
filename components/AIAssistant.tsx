import React, { useState, useEffect, useRef } from 'react';
import { useAI } from '../contexts/AIContext';
import { XMarkIcon, MicrophoneIcon } from './icons/Icons';
import { Button } from './ui/Button';
import { useLocalization } from '../contexts/LocalizationContext';
import { LANGUAGE_CODE_MAP } from '../constants';

// Check for browser support
// @ts-ignore
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const isSpeechSupported = !!SpeechRecognition;

export const AIAssistant: React.FC = () => {
    const { isAiOpen, closeAi, messages, processUserCommand, isProcessing } = useAI();
    const { t, language } = useLocalization();
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null); // Using any because SpeechRecognition types can be tricky
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [micError, setMicError] = useState<string | null>(null);

    useEffect(() => {
        const loadVoices = () => {
            setVoices(window.speechSynthesis.getVoices());
        };
        // Voices are loaded asynchronously
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices(); // Initial attempt

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    useEffect(() => {
        if (!isAiOpen) {
            stopListening();
        }
    }, [isAiOpen]);

    const handleSpeech = () => {
        if (isListening || !isSpeechSupported) return;
        setMicError(null); // Clear previous errors

        const languageCode = LANGUAGE_CODE_MAP[language] || 'en-US';
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = languageCode;

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => {
            setIsListening(false);
            recognitionRef.current = null;
        };
        recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                setMicError(t('micErrorDenied'));
            } else {
                setMicError(t('micErrorGeneric', { error: event.error }));
            }
            setIsListening(false);
        };
        recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript); // Set text in input for confirmation
            processUserCommand(transcript); // Process command immediately
        };
        
        recognitionRef.current.start();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        processUserCommand(input);
        setInput('');
    };
    
    // Speak the latest AI message
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.sender === 'model' && isAiOpen && voices.length > 0) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(lastMessage.text);
            const languageCode = LANGUAGE_CODE_MAP[language] || 'en-US';
            utterance.lang = languageCode;

            // Find a suitable voice for the selected language
            let selectedVoice = voices.find(voice => voice.lang === languageCode && voice.name.toLowerCase().includes('female'));
            if (!selectedVoice) {
                selectedVoice = voices.find(voice => voice.lang === languageCode);
            }
            
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            utterance.pitch = 1.1; 
            utterance.rate = 0.9;  
            
            window.speechSynthesis.speak(utterance);
        }
    }, [messages, isAiOpen, voices, language]);

    if (!isAiOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col relative">
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('aiAssistant')}</h2>
                    <button onClick={closeAi} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <XMarkIcon className="w-6 h-6 text-slate-500" />
                    </button>
                </header>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-lg px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                     {isProcessing && (
                        <div className="flex justify-start">
                             <div className="max-w-lg px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <footer className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isListening ? t('listening') : t('typeOrSayCommand')}
                            className="flex-grow px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                            disabled={isProcessing || isListening}
                        />
                         {isSpeechSupported && (
                            <button
                                type="button"
                                onClick={handleSpeech}
                                className={`p-2 rounded-md transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'}`}
                                disabled={isProcessing}
                            >
                                <MicrophoneIcon className="w-6 h-6" />
                            </button>
                        )}
                        <Button type="submit" disabled={isProcessing || !input.trim()}>{t('send')}</Button>
                    </form>
                    {micError && (
                        <p className="text-red-500 text-xs mt-2 text-center">{micError}</p>
                    )}
                </footer>
            </div>
        </div>
    );
};