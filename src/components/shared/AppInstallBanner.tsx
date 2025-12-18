import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui';
import SmartImage from '@/components/ui/SmartImage';

const APP_STORE_LINK = "https://apps.apple.com/app/procounsel/id6752525886";
const PLAY_STORE_LINK = "https://play.google.com/store/apps/details?id=com.catalystai.ProCounsel"
const QR_CODE_IMAGE_PATH = "/qr_procounsel.jpg";

export const BANNER_DISMISS_EVENT = 'appBannerDismissed';

export default function AppInstallBanner() {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
  setIsVisible(false);
  window.dispatchEvent(new CustomEvent(BANNER_DISMISS_EVENT));
};

  const handleDownloadClick = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/android/i.test(userAgent)) {
      window.location.href = PLAY_STORE_LINK;
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      window.location.href = APP_STORE_LINK;
    } else {
      window.location.href = PLAY_STORE_LINK; 
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>

      <div className="font-montserrat md:hidden relative z-40 bg-white shadow-md p-3">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
            aria-label="Dismiss app download banner"
          >
            <X size={20} />
          </button>
          
          {/* <SmartImage
            src="/logo.svg"
            alt="App Icon"
            width={32}
            height={32}
            className="h-8 w-8 flex-shrink-0"
          /> */}

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-gray-800 truncate">
              EXCLUSIVE OFFERS ON APP!
            </h4>
            <p className="text-[11px] text-gray-500 truncate">
              Experience the features on the app from anywhere!.
            </p>
          </div>

          <Button
            onClick={handleDownloadClick}
            className="h-9 px-3 text-sm font-bold bg-[#FF660F] text-white hover:bg-[#FF660F]/90 whitespace-nowrap"
          >
            Get App
          </Button>
        </div>
      </div>

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
    </>
  );
}