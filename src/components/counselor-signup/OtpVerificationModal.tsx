import { useState, useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  otpLength: 4 | 6;
  contactInfo: string;
  onVerify: (otp: string) => Promise<boolean>;
  onResend: () => Promise<void>;
  title: string;
  description: string;
}

export default function OtpVerificationModal({
  isOpen,
  onClose,
  otpLength,
  contactInfo,
  onVerify,
  onResend,
  title,
  description,
}: OtpModalProps) {
  const [otp, setOtp] = useState<string[]>(new Array(otpLength).fill(''));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setResendTimer(30);
      setOtp(new Array(otpLength).fill(''));
      setError('');
      inputRefs.current[0]?.focus();
    }
  }, [isOpen, otpLength]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    setError('');

    if (element.value !== '' && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerification = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== otpLength) {
      setError(`Please enter a ${otpLength}-digit OTP.`);
      return;
    }
    setIsLoading(true);
    setError('');
    const success = await onVerify(enteredOtp);
    setIsLoading(false);
    if (!success) {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResendClick = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    await onResend();
    setIsLoading(false);
    setResendTimer(30);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto">
        <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4 md:p-6 text-center">
          <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
            {description} <br /> <span className="font-semibold text-gray-800">{contactInfo}</span>
          </p>
          
          <div className="flex justify-center gap-2 md:gap-3 mb-4 md:mb-6">
            {otp.map((data, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
                disabled={isLoading}
                className={`w-10 h-12 md:w-14 md:h-16 text-center text-xl md:text-2xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <div className="mb-6">
            <button
              onClick={handleResendClick}
              disabled={resendTimer > 0 || isLoading}
              className="text-sm md:text-base text-gray-600 hover:text-orange-600 disabled:text-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Resend OTP {resendTimer > 0 && `in 00:${String(resendTimer).padStart(2, '0')}`}
            </button>
          </div>
          
          <button
            onClick={handleVerification}
            disabled={isLoading}
            className="w-full h-11 md:h-12 bg-[#FA660F] text-white rounded-xl font-semibold text-sm md:text-base hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Verify OTP'}
          </button>
        </div>
      </div>
    </div>
  );
}