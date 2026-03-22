import { CheckCircle, Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-center relative animate-in zoom-in-95 duration-300 p-8">
        
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h2 className="text-2xl font-bold text-[#0E1629] mb-2">Registration Successful!</h2>
        <p className="text-gray-600 mb-6 text-sm">
          You are successfully registered for the Grand Mock Test. Get ready to conquer MHT-CET!
        </p>

        <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-left mb-8 border border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-[#2F43F2]" />
            <span className="font-medium">29th March (Sunday)</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Clock className="w-4 h-4 text-[#FA7415]" />
            <span className="font-medium">2:00 PM - 5:00 PM</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <MapPin className="w-4 h-4 text-[#22C55D]" />
            <span className="font-medium">ProCounsel Online Platform</span>
          </div>
        </div>

        <Button 
          onClick={onClose}
          className="w-full bg-[#2F43F2] hover:bg-blue-700 text-white py-6 rounded-xl font-medium text-lg cursor-pointer"
        >
          Got it, Thanks!
        </Button>
      </div>
    </div>
  );
}