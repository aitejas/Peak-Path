import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ChatMessage, ChatMessageContent } from '../../types';
import { storageService } from '../../services/storageService';
import { MicrophoneIcon, PaperAirplaneIcon, TrashIcon, VideoCameraIcon, XMarkIcon } from '../../components/icons/Icons';
import { useLocalization } from '../../contexts/LocalizationContext';

const fileToDataUrl = (file: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const CommunicationPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>(() => storageService.getItem('chatMessages', []));
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { t } = useLocalization();

    useEffect(() => {
        storageService.setItem('chatMessages', messages);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const addMessage = (content: ChatMessageContent) => {
        const newMessage: ChatMessage = {
            id: Date.now(),
            sender: 'parent', // For this simulation, parent is always the sender
            content,
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const handleSendText = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            addMessage({ type: 'text', value: input.trim() });
            setInput('');
        }
    };

    const handleToggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.ondataavailable = e => audioChunksRef.current.push(e.data);
                mediaRecorderRef.current.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const audioUrl = await fileToDataUrl(audioBlob);
                    addMessage({ type: 'audio', value: audioUrl });
                    audioChunksRef.current = [];
                    // Stop all media tracks to release microphone
                    stream.getTracks().forEach(track => track.stop());
                };
                mediaRecorderRef.current.start();
                setIsRecording(true);
            } catch (err) {
                console.error("Microphone access denied:", err);
                alert("Microphone access was denied. Please allow microphone permissions in your browser settings.");
            }
        }
    };
    
    const handleVideoAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const videoUrl = await fileToDataUrl(file);
                addMessage({ type: 'video', value: videoUrl });
            } catch (err) {
                console.error("Error reading video file:", err);
                alert("Sorry, there was an error processing the video file.");
            }
        }
    };

    const renderMessageContent = (content: ChatMessageContent) => {
        switch (content.type) {
            case 'text':
                return <p>{content.value}</p>;
            case 'audio':
                return <audio controls src={content.value} className="w-full" />;
            case 'video':
                return <video controls src={content.value} className="w-full rounded-md max-w-xs" />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
            <Card className="w-full max-w-lg h-[80vh] flex flex-col p-0">
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('communicationHub')}</h1>
                     <Link to="/parent/dashboard">
                        <XMarkIcon className="w-6 h-6 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200" />
                    </Link>
                </header>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-slate-500 dark:text-slate-400 h-full flex items-center justify-center">
                            {t('noMessages')}
                        </div>
                    )}
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'parent' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'parent' ? 'bg-primary-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'}`}>
                                {renderMessageContent(msg.content)}
                            </div>
                            <span className="text-xs text-slate-400 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                
                <footer className="p-2 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <form onSubmit={handleSendText} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder={isRecording ? t('recordingAudio') : t('typeAMessage')}
                            className="flex-grow px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full"
                            disabled={isRecording}
                        />
                        
                        <input type="file" accept="video/*" ref={fileInputRef} onChange={handleVideoAttachment} className="hidden" />

                        <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} className="rounded-full !p-3">
                            <VideoCameraIcon className="w-5 h-5" />
                        </Button>
                        <Button type="button" variant={isRecording ? 'danger' : 'secondary'} onClick={handleToggleRecording} className="rounded-full !p-3">
                            <MicrophoneIcon className="w-5 h-5" />
                        </Button>
                        <Button type="submit" className="rounded-full !p-3">
                            <PaperAirplaneIcon className="w-5 h-5"/>
                        </Button>
                    </form>
                </footer>
            </Card>
        </div>
    );
};