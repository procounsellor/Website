import { useState } from 'react';
import { X } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';

const QR_CODE_IMAGE_PATH = "/qr_procounsel.jpg";

export const BANNER_DISMISS_EVENT = 'appBannerDismissed';

export default function AppInstallBanner() {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
  setIsVisible(false);
  window.dispatchEvent(new CustomEvent(BANNER_DISMISS_EVENT));
};

  if (!isVisible) {
    return null;
  }

  return (
    <div className="hidden md:flex fixed bottom-6 left-6 z-40 bg-white shadow-xl rounded-lg p-2 max-w-sm border border-gray-100">
        <div className="relative flex gap-4">
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 p-1 rounded-full hover:cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-500"
            aria-label="Dismiss app download banner"
          >
            <X size={16} />
          </button>

          <div className="shrink-0">
            <SmartImage
              src={QR_CODE_IMAGE_PATH}
              alt="Download the app QR code"
              width={100}
              height={100}
              className="w-24 h-24 rounded-md bg-gray-100"
            />
          </div>

          <div className="flex items-center gap-3">
            <div>
              <h4 className="text-base font-semibold text-gray-800">
                Exclusive Offers On App!
              </h4>
              <p className="text-sm text-gray-600">
                Experience the features on the app from anywhere!.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}