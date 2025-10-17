import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import { getCounselorPageInfo } from '@/api/counselor';
import type { CounselorPageInfo } from '@/types/counselor';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InfoModal() {
  const { isCounselorSignupOpen, toggleCounselorSignup } = useAuthStore();
  const navigate = useNavigate();

  const [info, setInfo] = useState<CounselorPageInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (isCounselorSignupOpen) {
      const fetchInfo = async () => {
        setLoading(true);
        try {
          const data = await getCounselorPageInfo();
          setInfo(data);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
          toast.error(errorMessage);
          toggleCounselorSignup(); 
        } finally {
          setLoading(false);
        }
      };
      fetchInfo();
    }
  }, [isCounselorSignupOpen, toggleCounselorSignup]);

  const handleProceed = () => {
    toggleCounselorSignup();
    navigate('/counselor-signup');
  };

  if (!isCounselorSignupOpen) {
    return null;
  }

  const renderSection = (title: string, points: string[]) => (
    <div key={title} className="mb-4">
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <ul className="list-disc list-inside space-y-1 text-gray-600">
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  );
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#13097D]">Become a Counsellor on ProCounsel</h2>
            <button onClick={toggleCounselorSignup} className="p-1.5 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-600" />
            </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FA660F]" />
                </div>
            ) : info ? (
                <>
                    {renderSection("Become a Counsellor on ProCounsel", info["Become a Counsellor on ProCounsel"])}
                    {renderSection("Why Join?", info["Why Join?"])}
                    {renderSection("What Happens When You Switch", info["What Happens When You Switch"])}
                    {renderSection("Steps to Get Started", info["Steps to Get Started"])}
                </>
            ) : (
                 <div className="text-center text-gray-500">No information available.</div>
            )}
        </div>

        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
            <div className="flex items-start mb-4">
                <input
                    id="agree-checkbox"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-4 w-4 text-[#FA660F] focus:ring-[#FA660F] border-gray-300 rounded mt-1"
                />
                <label htmlFor="agree-checkbox" className="ml-3 text-sm text-gray-600">
                    By continuing, you agree to Procounsel's <a href="/terms" target="_blank" className="underline font-medium text-black hover:text-[#FA660F]">Terms & Condition</a> and <a href="/privacy-policy" target="_blank" className="underline font-medium text-black hover:text-[#FA660F]">Privacy Policy</a>.
                </label>
            </div>
            <button
                onClick={handleProceed}
                disabled={!agreed || loading}
                className="w-full h-[44px] bg-[#FA660F] text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Proceed
            </button>
        </div>
      </div>
    </div>
  );
}