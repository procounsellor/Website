import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function NoInternet() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      if (navigator.onLine) {
        window.location.reload();
      }
    }, 1000);
  };

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-linear-to-br from-orange-50 to-blue-50 mb-6">
          <WifiOff className="w-10 h-10 md:w-12 md:h-12 text-gray-400" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          No Internet Connection
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-sm md:text-base mb-8 leading-relaxed">
          Please check your internet connection and try again. Make sure you're connected to a network.
        </p>

        {/* Retry Button */}
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#FF660F] to-orange-600 hover:from-[#FF660F]/90 hover:to-orange-600/90 text-white font-semibold px-6 py-3 md:px-8 md:py-3.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </button>

        {/* Tips */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs md:text-sm text-gray-500 mb-3 font-medium">
            Things you can try:
          </p>
          <ul className="text-xs md:text-sm text-gray-600 space-y-2">
            <li className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Check your WiFi or mobile data
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
              Turn airplane mode off
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Restart your router
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
