import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import { getCounselorPageInfo } from '@/api/counselor';
import type { CounselorPageInfo } from '@/types/counselor';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InfoModal() {
  const { isCounselorSignupOpen, toggleCounselorSignup, closeCounsellorSignup, openCounselorSignupForm, isAuthenticated, toggleLogin, role, setIsCounselorSignupFlow, user } = useAuthStore();
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
    // Check if user is already a counselor
    if (isAuthenticated && role === 'counselor' && user?.verified) {
      toast.error("You are already registered as a counsellor.");
      toggleCounselorSignup();
      navigate('/counsellor-dashboard');
      return;
    }
    const hasSubmitted = localStorage.getItem('hasSubmittedCounselorApp') === 'true';
    if (isAuthenticated && hasSubmitted) {
      toast.error("Your application is already under review.");
      toggleCounselorSignup();
      return;
    }

    if (!isAuthenticated) {
      setIsCounselorSignupFlow(true);
      
      const redirectToCounselorSignup = () => {
        openCounselorSignupForm();
      };
      toggleCounselorSignup();
      toggleLogin(redirectToCounselorSignup);
      toast.error("Please log in to become a counsellor.");
    } else {
      openCounselorSignupForm();
    }
  };

  if (!isCounselorSignupOpen) {
    return null;
  }
  
  const renderSection = (title: string, points: string[]) => (
    <div key={title} className="mb-4 md:mb-6">
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">{title}</h3>
      <ul className="list-disc list-inside space-y-1.5 md:space-y-2">
        {points.map((point, index) => (
          <li key={index} className="text-sm md:text-base font-medium text-gray-600 md:text-gray-500 leading-relaxed">{point}</li>
        ))}
      </ul>
    </div>
  );
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] flex flex-col relative">
        <button 
            onClick={closeCounsellorSignup} 
            className="absolute top-3 right-3 md:top-4 md:right-4 z-10 w-9 h-9 md:w-10 md:h-10 hover:cursor-pointer flex items-center justify-center bg-black rounded-full text-white hover:bg-gray-800 transition-colors"
        >
            <X className="h-5 w-5 md:h-6 md:w-6" />
        </button>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FA660F]" />
                </div>
            ) : info ? (
                <div className="py-6 md:py-10 px-4 md:px-16">
                    <div className="text-center mb-6 md:mb-8">
                        <h2 className="text-xl md:text-3xl font-semibold md:font-medium text-[#13097D] leading-tight">
                            Become a Counsellor on ProCounsel
                        </h2>
                        {info["Become a Counsellor on ProCounsel"] && (
                            <p className="mt-3 md:mt-4 text-sm md:text-base font-medium text-gray-700 md:text-gray-800 max-w-3xl mx-auto">
                                {info["Become a Counsellor on ProCounsel"].join(' ')}
                            </p>
                        )}
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        {renderSection("Why Join?", info["Why Join?"])}
                        {renderSection("What Happens When You Switch", info["What Happens When You Switch"])}
                        {renderSection("Steps to Get Started", info["Steps to Get Started"])}
                    </div>
                </div>
            ) : (
                 <div className="text-center text-gray-500 py-10 text-sm md:text-base">No information available.</div>
            )}
        </div>

        <div className="px-4 md:px-6 py-3 md:py-4 border-t bg-white sticky bottom-0 shrink-0">
            {isAuthenticated && role === 'counselor' ? (
              <div className="text-center">
                <p className="mb-3 md:mb-4 text-xs md:text-sm text-gray-600">You are already registered as a counsellor!</p>
                <div className="flex flex-col md:flex-row gap-2 md:gap-3 justify-center">
                  <button
                    onClick={() => {
                      toggleCounselorSignup();
                      navigate('/counsellor-dashboard');
                    }}
                    className="px-4 md:px-6 py-2.5 md:py-3 hover:cursor-pointer bg-[#13097D] text-white rounded-xl font-semibold text-sm md:text-base hover:bg-[#13097D]/90 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      toggleCounselorSignup();
                      navigate('/counsellors');
                    }}
                    className="px-4 md:px-6 py-2.5 hover:cursor-pointer md:py-3 bg-[#FA660F] text-white rounded-xl font-semibold text-sm md:text-base hover:bg-orange-600 transition-colors"
                  >
                    Browse Counsellors
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start md:items-center justify-center mb-3 md:mb-4 px-2">
                    <input
                        id="agree-checkbox"
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="h-4 w-4 md:h-5 md:w-5 mt-0.5 md:mt-0 shrink-0 text-[#FA660F] focus:ring-[#FA660F] border-[#13097D] rounded cursor-pointer"
                    />
                    <label htmlFor="agree-checkbox" className="ml-2 md:ml-3 text-xs md:text-sm font-medium text-[#6C6969] cursor-pointer">
                        By continuing, you agree to Procounsel's <a href="/terms" target="_blank" className="underline text-[#2F2F2F] hover:text-[#FA660F]">Terms & Condition</a> and <a href="/privacy-policy" target="_blank" className="underline text-[#2F2F2F] hover:text-[#FA660F]">Privacy Policy</a>.
                    </label>
                </div>
                <div className="text-center">
                    <button
                        onClick={handleProceed}
                        disabled={!agreed || loading}
                        className={`w-full md:w-[444px] max-w-full h-11 md:h-12 rounded-xl font-semibold text-white text-sm md:text-base transition-colors ${
                            agreed ? 'bg-[#FA660F] hover:bg-orange-600 hover:cursor-pointer' : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        Proceed
                    </button>
                </div>
              </>
            )}
        </div>

      </div>
    </div>
  );
}