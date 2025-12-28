import { useState } from 'react';
import { X, Tag, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export type ApplyCouponResponse = {
  message: string;
  status: boolean;
  discountPercentage?: number;
};

type CouponCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  userId: string;
  originalPrice: number;
  onCouponApplied: (couponCode: string, discountedPrice: number, discountPercentage: number) => void;
  onCouponRemoved: () => void;
  appliedCoupon?: string | null;
  applyCouponApi: (userId: string, courseId: string, couponCode: string) => Promise<ApplyCouponResponse>;
};

export default function CouponCodeModal({
  isOpen,
  onClose,
  courseId,
  userId,
  originalPrice,
  onCouponApplied,
  onCouponRemoved,
  appliedCoupon = null,
  applyCouponApi,
}: CouponCodeModalProps) {
  const [couponCode, setCouponCode] = useState(appliedCoupon || '');
  const [isApplying, setIsApplying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setErrorMessage('Please enter a coupon code');
      return;
    }

    setErrorMessage(null);
    setIsApplying(true);
    try {
      const response = await applyCouponApi(userId, courseId, couponCode.trim().toUpperCase());
      
      if (response.status && response.discountPercentage) {
        const discountAmount = (originalPrice * response.discountPercentage) / 100;
        const discountedPrice = originalPrice - discountAmount;
        
        onCouponApplied(couponCode.trim().toUpperCase(), discountedPrice, response.discountPercentage);
        toast.success(response.message || 'Coupon applied successfully!');
        onClose();
      } else {
        setErrorMessage(response.message || 'Invalid coupon code');
      }
    } catch (error) {
      setErrorMessage((error as Error).message || 'Invalid coupon code');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    onCouponRemoved();
    toast.success('Coupon removed');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isApplying) {
      handleApplyCoupon();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value.toUpperCase());
    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-[#FF660F]" />
            <h2 className="text-xl font-semibold text-gray-900">Apply Coupon</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Applied Coupon Display */}
          {appliedCoupon && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">Coupon Applied</p>
                <p className="text-sm text-green-700 font-mono mt-1">{appliedCoupon}</p>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          )}

          {/* Coupon Input */}
          {!appliedCoupon && (
            <>
              <div>
                <label htmlFor="coupon-code" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Coupon Code
                </label>
                <input
                  id="coupon-code"
                  type="text"
                  value={couponCode}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., PROCOUNSEL10"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF660F] focus:border-transparent outline-none transition-all font-mono uppercase ${
                    errorMessage ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isApplying}
                  autoFocus
                />
                {errorMessage && (
                  <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                )}
              </div>

              {/* Info Message */}
              {!errorMessage && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    Enter your coupon code to get a discount on this course.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Original Price</span>
              <span className="font-medium text-gray-900">₹{originalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        {!appliedCoupon && (
          <div className="p-6 pt-0">
            <Button
              onClick={handleApplyCoupon}
              disabled={isApplying || !couponCode.trim()}
              className="w-full bg-[#FF660F] hover:bg-[#e55a0a] text-white cursor-pointer"
            >
              {isApplying ? 'Applying...' : 'Apply Coupon'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
