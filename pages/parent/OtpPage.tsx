import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    // Simulate OTP check
    if (enteredOtp.length === 4) {
      navigate('/parent/dashboard');
    } else {
      alert("Please enter a valid 4-digit OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <Card className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Enter OTP</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">A 4-digit code has been sent to you (Hint: any 4 digits will work).</p>
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-2xl font-semibold bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100"
                required
              />
            ))}
          </div>
          <Button type="submit" className="w-full">
            Verify & Continue
          </Button>
        </form>
      </Card>
    </div>
  );
};