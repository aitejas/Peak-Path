import React from 'react';
import { Card } from './ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

interface ProgressChartProps {
    data: { day: string; points: number }[];
    title?: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, title = "Weekly Progress" }) => {
    const { theme } = useTheme();
    
    const textColor = theme === 'dark' ? '#cbd5e1' : '#475569';
    const barColor = '#3b82f6'; // primary-500

    return (
        <Card className="h-80 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">{title}</h3>
            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis 
                            dataKey="day" 
                            stroke={textColor} 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <YAxis 
                            stroke={textColor} 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ 
                                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                                borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                                color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                                borderRadius: '0.5rem',
                                fontSize: '14px'
                            }}
                        />
                        <Bar dataKey="points" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={barColor} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};