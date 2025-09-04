import React, { useState, useRef, useEffect } from 'react';

interface CustomOTPProps {
  length?: number;
  onComplete: (otp: string) => void;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
}

const CustomOTP: React.FC<CustomOTPProps> = ({ 
  length = 4, 
  onComplete, 
  hasError = false, 
  disabled = false,
  className = "" 
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Clear OTP when hasError changes to true
    if (hasError) {
      setOtp(new Array(length).fill(''));
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  }, [hasError, length]);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;

    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    
    // Handle paste
    if (value.length > 1) {
      const pastedValue = value.slice(0, length);
      for (let i = 0; i < length; i++) {
        newOtp[i] = pastedValue[i] || '';
      }
      setOtp(newOtp);
      
      // Focus last filled input or last input
      const lastFilledIndex = Math.min(pastedValue.length - 1, length - 1);
      if (inputRefs.current[lastFilledIndex]) {
        inputRefs.current[lastFilledIndex].focus();
      }
      
      // Check if complete
      if (pastedValue.length === length) {
        onComplete(pastedValue);
      }
    } else {
      // Handle single character input
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value entered
      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Check if complete
      if (newOtp.every(digit => digit !== '') && newOtp.join('').length === length) {
        onComplete(newOtp.join(''));
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    // Select all text when focusing
    if (inputRefs.current[index]) {
      inputRefs.current[index].select();
    }
  };

  return (
    <div className={`flex gap-4 ${className}`}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            if (el) inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={`
            h-11 w-11 text-center text-lg font-semibold
            rounded-2xl bg-white
            border ${hasError ? 'border-[#EE1C1F]' : 'border-[#2626264D]'}
            outline-none focus:outline-none
            ring-0 focus:ring-0 
            shadow-none focus:shadow-none
            transition-colors duration-200
            ${hasError 
              ? 'focus:border-[#EE1C1F] hover:border-[#EE1C1F]' 
              : 'focus:border-[#343C6A] hover:border-[#343C6A]'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
          `}
        />
      ))}
    </div>
  );
};

export default CustomOTP;
