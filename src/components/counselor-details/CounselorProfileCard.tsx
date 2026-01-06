import type { CounselorDetails } from '@/types/academic';
import { Bookmark, Briefcase, Languages, Lock, CheckCircle, MessageSquare, Phone, Zap, Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isManualSubscriptionRequest } from '@/api/counsellor';
import type { SubscribedCounsellor, User } from '@/types/user';
import { useAuthStore } from '@/store/AuthStore';
import toast from 'react-hot-toast';
import { PlanBenefitsModal } from './PlanBenefitsModal';
import getAllPlans from '@/api/subscriptionPlans';

type Props = {
  counselor: CounselorDetails;
  subscription: SubscribedCounsellor | null;
  isFavourite: boolean;
  onToggleFavourite: () => void;
  isTogglingFavourite: boolean;
  user: User | null;
  onProfileIncomplete: (action: () => void) => void;
};

export function CounselorProfileCard({ counselor, subscription, isFavourite, onToggleFavourite, isTogglingFavourite, user, onProfileIncomplete }: Props) {
  const userId = localStorage.getItem('phone');
  const navigate = useNavigate();
  const [pendingApproval, setPendingApproval] = useState(false);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const toggleLogin = useAuthStore(state => state.toggleLogin);
  const loggedInUserRole = useAuthStore(state => state.role);
  const [showImageModal, setShowImageModal] = useState(false);
  const [planData, setPlanData] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<'plus' | 'pro' | 'elite' | null>(null);

  const isCurrentUserCounselor = loggedInUserRole === 'counselor';

  useEffect(() => {
    const fetchPlans = async () => {
      const storedUserId = localStorage.getItem('phone');
      const res = await getAllPlans(counselor.userName, storedUserId || '');
      if (res && res.benefits) {
        setPlanData(res);
      }
    };
    fetchPlans();
  }, [counselor.userName]);

  const openBenefits = (plan: string) => {
    const normalizedPlan = plan.toLowerCase();
    if (normalizedPlan === 'plus' || normalizedPlan === 'pro' || normalizedPlan === 'elite') {
        setSelectedPlan(normalizedPlan);
    }
  };

  useEffect(() => {
    if (isCurrentUserCounselor) {
      setPendingApproval(false);
      return;
    }
    if (!subscription && userId && counselor?.userName) {
      isManualSubscriptionRequest(userId, counselor.userName)
        .then(res => setPendingApproval(Boolean(res?.pendingApproval)))
        .catch(err => console.error('Manual subscription check failed', err));
    }
  }, [isCurrentUserCounselor]);

  const handleSubscribeClick = (isUpgrade = false) => {
    if (isCurrentUserCounselor) {
      toast.error("Counselors cannot subscribe to other counselors.");
      return;
    }
    
    const subscribeAction = () => {
      const freshUserId = localStorage.getItem('phone');
      if (!freshUserId) {
        toast.error("Could not get user ID after login. Please try again.");
        return;
      }
      const autoOpenPlan = isUpgrade ? getUpgradePlan() : null;
      navigate('/subscribe', { 
        state: { 
          counselorId: counselor.userName, 
          userId: freshUserId, 
          counselor: counselor,
          isUpgrade: isUpgrade,
          ...(isUpgrade && { currentPlan: subscription }),
          autoOpenPlan: autoOpenPlan,
        } 
      });
    };
    if (!isAuthenticated) {
      toggleLogin(subscribeAction);
      return;
    }
    if (!user?.firstName || !user?.email) {
      onProfileIncomplete(subscribeAction);
      return;
    }
    subscribeAction();
  };

  const fullName = `${counselor.firstName} ${counselor.lastName}`;
  const imageUrl = counselor.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=E0E7FF&color=4F46E5&size=128`;

  const formatAmount = (amount: number | null | undefined) => {
    if (amount == null || amount === 0) return 'N/A';
    return amount.toLocaleString('en-IN');
  };

  const getUpgradePlan = () => {
    const planHierarchy = ['plus', 'pro', 'elite'];
    const currentPlanIndex = planHierarchy.indexOf(subscription?.plan?.toLowerCase() ?? '');
    
    if (currentPlanIndex === -1 || currentPlanIndex === planHierarchy.length - 1) {
      return null;
    }
    return planHierarchy[currentPlanIndex + 1];
  };

  const upgradePlan = getUpgradePlan();

  const BookmarkButton = ({ className = "" }) => (
    <button 
      onClick={onToggleFavourite} 
      disabled={isTogglingFavourite}
      className={`p-1 text-blue-600 disabled:opacity-50 ${className}`}
      aria-label="Toggle favourite"
    >
      <Bookmark className={`w-5 h-5 transition-colors ${isFavourite ? 'fill-current text-blue-600' : 'text-gray-400'}`} />
    </button>
  );

  return (
    <>
      {/*Mobile view*/}
      <div className="md:hidden bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-4">
        <div className="flex gap-4">
          <img src={imageUrl} alt={fullName} draggable={false} onClick={() => setShowImageModal(true)} className="w-20 h-20 rounded-lg object-cover" />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-sm font-semibold text-[#343C6A]">{`Mr. ${fullName}`}</h1>
                <p className="text-xs text-[#718EBF] mt-1">{`${counselor.organisationName}, ${counselor.fullOfficeAddress?.city}`}</p>
              </div>
              <BookmarkButton />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-dashed pt-4">
            <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <div>
                    <p className="text-xs font-semibold text-[#232323]">Experience</p>
                    <p className="font-medium text-[10px] text-[#232323]">{counselor.experience || 'N/A'}+ Years</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-blue-500" />
                <div>
                    <p className="text-xs font-semibold text-[#232323]">Languages</p>
                    <p className="font-medium text-[10px] text-[#232323]">{counselor.languagesKnow?.join(', ') || 'English'}</p>
                </div>
            </div>
        </div>

        {subscription ? (
          <div className="border-t border-gray-200 pt-4 space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-gray-800">Active Subscription</h3>
                </div>
                <button 
                    onClick={() => openBenefits(subscription.plan)}
                    className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full capitalize hover:bg-blue-200 transition-colors cursor-pointer border-none outline-none"
                >
                    {subscription.plan}
                </button>
            </div>
            <div className="flex gap-3">
                <a href={!isCurrentUserCounselor ? `sms:${counselor.phoneNumber}`: undefined}
                   className={`w-full flex items-center justify-center border gap-2 py-3 rounded-lg text-sm font-medium ${isCurrentUserCounselor ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'text-gray-700 bg-gray-50'}`}
                   aria-disabled={isCurrentUserCounselor}
                   onClick={(e) => isCurrentUserCounselor && e.preventDefault()}
                >
                    <MessageSquare className="w-4 h-4"/> Chat
                </a>
                <a href={!isCurrentUserCounselor ? `tel:${counselor.phoneNumber}` : undefined}
                   className={`w-full flex items-center justify-center border gap-2 py-3 rounded-lg text-sm font-medium ${isCurrentUserCounselor ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'text-gray-700 bg-gray-50'}`}
                   aria-disabled={isCurrentUserCounselor}
                   onClick={(e) => isCurrentUserCounselor && e.preventDefault()}
                 >
                    <Phone className="w-4 h-4" /> Call
                </a>
            </div>
            {upgradePlan && (
                <button
                  onClick={() => handleSubscribeClick(true)}
                  disabled={isCurrentUserCounselor}
                  className={`w-full font-semibold py-3 px-6 rounded-lg border-2 flex items-center justify-center gap-2 ${isCurrentUserCounselor ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed' : 'text-[#3537B4] border-[#3537B4] hover:bg-blue-50'}`}
                >
                  <Zap className="w-5 h-5 text-orange-500" /> Upgrade to <span className="capitalize">{upgradePlan}</span> Plan
                </button>
            )}
             {isCurrentUserCounselor && (
                 <div className="p-2 bg-yellow-50 text-yellow-800 text-xs rounded-md flex items-center gap-1.5">
                     <Info size={14} /> Counselors cannot interact via subscribed features.
                 </div>
             )}
          </div>
        ) : (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-700 mb-3">Subscription Plans</h3>
            <div className="flex gap-3">
              <button disabled={isCurrentUserCounselor} className={`flex h-12 flex-1 flex-col items-center justify-center rounded-lg border ${isCurrentUserCounselor ? 'bg-gray-100 opacity-60 cursor-not-allowed' : 'bg-linear-to-r from-[rgba(222,237,255,0.4)] to-[rgba(126,136,211,0.4)]'}`}>
                <span className="font-semibold text-xs text-[#1447E7]">Plus</span>
                <span className="text-[#1447E7] text-xs font-bold flex items-center gap-1"><img src="/coin.svg" alt="coin" className="w-3 h-3" />{formatAmount(counselor.plusAmount)}</span>
              </button>
              
              <button disabled={isCurrentUserCounselor} className={`flex h-12 flex-1 flex-col items-center justify-center rounded-lg border ${isCurrentUserCounselor ? 'bg-gray-100 opacity-60 cursor-not-allowed' : 'bg-linear-to-r from-[rgba(244,232,255,0.4)] to-[rgba(250,244,255,0.4)]'}`}>
                <span className="font-semibold text-[#8200DA] text-xs">Pro</span>
                <span className="text-[#8200DA] text-xs font-bold flex items-center gap-1"><img src="/coin.svg" alt="coin" className="w-3 h-3" />{formatAmount(counselor.proAmount)}</span>
              </button>
              
              <button disabled={isCurrentUserCounselor} className={`flex h-12 flex-1 flex-col items-center justify-center rounded-lg border ${isCurrentUserCounselor ? 'bg-gray-100 opacity-60 cursor-not-allowed' : 'bg-linear-to-r from-[rgba(255,245,206,0.4)] to-[rgba(255,250,230,0.4)]'}`}>
                <span className="font-semibold text-[#B94C00] text-xs">Elite</span>
                <span className="text-[#B94C00] text-xs font-bold flex items-center gap-1"><img src="/coin.svg" alt="coin" className="w-3 h-3" />{formatAmount(counselor.eliteAmount)}</span>
              </button>
            </div>
            <button
              onClick={() => handleSubscribeClick(false)}
              disabled={pendingApproval || isCurrentUserCounselor}
              aria-disabled={pendingApproval || isCurrentUserCounselor}
              className={`w-full mt-4 font-semibold text-xs py-3 px-6 rounded-lg transition-colors ${pendingApproval ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : isCurrentUserCounselor ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-[#3537B4] text-white hover:bg-blue-700'}`}
            >
              {pendingApproval ? 'Request Pending' : isCurrentUserCounselor ? 'Cannot Subscribe' : 'Subscribe Now'}
            </button>
            <div className="mt-4 flex gap-3">
                <button disabled className="w-full flex items-center justify-center text-xs font-medium border gap-2 py-3 text-[#B2B9C5] bg-[#F9FAFC] rounded-lg"><Lock className="w-4 h-4"/> Chat</button>
                <button disabled className="w-full flex items-center justify-center text-xs font-medium border gap-2 py-3 text-[#B2B9C5] bg-[#F9FAFC] rounded-lg"><Lock className="w-4 h-4" /> Call</button>
            </div>
            <p className="mt-3 text-[10px] text-center text-[#232323] flex items-center justify-center gap-1"><Lock className="w-3 h-3" /> Subscribe to unlock chat and call features</p>
          </div>
        )}
      </div>

      {/*desktop view*/}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <img src={imageUrl} alt={fullName} draggable={false} onClick={() => setShowImageModal(true)} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md mx-auto sm:mx-0" />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-[#343C6A]">{fullName}</h1>
                <p className="text-md text-[#718EBF] mt-1">{counselor.fullOfficeAddress?.city || 'Location not specified'}</p>
              </div>
              <BookmarkButton className="p-2 hover:cursor-pointer" />
            </div>
            <div className="mt-4 flex items-center justify-center sm:justify-start gap-x-8 gap-y-4 text-gray-700">
              <div className="flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-blue-500" />
                <div><span className="font-semibold block">{counselor.experience || 'N/A'} Years</span><span className="text-sm text-gray-500">of experience</span></div>
              </div>
              <div className="flex items-center gap-3">
                <Languages className="w-8 h-8 text-blue-500" />
                <div><span className="font-semibold block">Languages Known</span><span className="text-sm text-gray-500">{counselor.languagesKnow?.join(', ') || 'English'}</span></div>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200" />
        {subscription ? (
          <div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h3 className="font-semibold text-gray-800 text-lg">Active Subscription</h3>
              </div>
              <button 
                  onClick={() => openBenefits(subscription.plan)}
                  className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full capitalize hover:bg-blue-200 transition-colors cursor-pointer border-none outline-none"
              >
                {subscription.plan}
              </button>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Plan Benefits</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-600">
                <p>✓ Direct Chat Access</p>
                <p>✓ Phone Call Priority</p>
                <p>✓ 2 Sessions Included</p>
                <p>✓ Monthly Newsletter</p>
              </div>
            </div>
            <hr className="my-6 border-gray-200" />
            <div className="flex flex-col sm:flex-row gap-3 items-center">
                <a href={!isCurrentUserCounselor ? `sms:${counselor.phoneNumber}` : undefined}
                   className={`flex items-center justify-center gap-2 font-semibold py-3 px-4 ${isCurrentUserCounselor ? 'text-gray-400 cursor-not-allowed' : 'text-green-600'}`}
                   aria-disabled={isCurrentUserCounselor}
                   onClick={(e) => isCurrentUserCounselor && e.preventDefault()}
                >
                  <MessageSquare className="w-5 h-5" /> Message
                </a>
                <a href={!isCurrentUserCounselor ? `tel:${counselor.phoneNumber}` : undefined}
                   className={`flex items-center justify-center gap-2 font-semibold py-3 px-4 ${isCurrentUserCounselor ? 'text-gray-400 cursor-not-allowed' : 'text-green-600'}`}
                   aria-disabled={isCurrentUserCounselor}
                   onClick={(e) => isCurrentUserCounselor && e.preventDefault()}
                >
                  <Phone className="w-5 h-5" /> Call
                </a>
              {upgradePlan ? (
                <button
                  onClick={() => handleSubscribeClick(true)}
                  disabled={isCurrentUserCounselor}
                  className={`w-full sm:flex-1 font-semibold py-3 px-6 rounded-lg border-2 flex items-center justify-center gap-2 ${isCurrentUserCounselor ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed' : 'text-[#3537B4] border-[#3537B4] hover:bg-blue-50 hover:cursor-pointer'}`}
                >
                  <Zap className="w-5 h-5 text-orange-500" /> Upgrade to <span className="capitalize">{upgradePlan}</span> Plan
                </button>
              ) : (
                <button disabled className="w-full sm:flex-1 font-semibold py-3 px-6 rounded-lg bg-gray-200 text-gray-600 cursor-not-allowed">
                  You are an Elite subscriber
                </button>
              )}
            </div>
            {isCurrentUserCounselor && (
                 <div className="mt-4 p-2 bg-yellow-50 text-yellow-800 text-sm rounded-md flex items-center gap-2">
                     <Info size={16} /> Counselors cannot interact using subscribed features (Chat/Call/Upgrade).
                 </div>
             )}
          </div>
        ) : (
          <div>
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700">Subscription Plans</h3>
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <button disabled={isCurrentUserCounselor} className={`flex h-[50px] flex-1 flex-col items-center justify-center rounded-xl border ${isCurrentUserCounselor ? 'bg-gray-100 opacity-60 cursor-not-allowed' : 'bg-linear-to-r from-[rgba(222,237,255,0.4)] to-[rgba(126,136,211,0.4)]'}`}>
                  <span className="font-semibold text-sm text-[#1447E7]">Plus</span>
                  <span className="text-[#1447E7] text-sm font-bold flex items-center gap-1"><img src="/coin.svg" alt="coin" className="w-3.5 h-3.5" />{formatAmount(counselor.plusAmount)}</span>
                </button>
                
                <button disabled={isCurrentUserCounselor} className={`flex h-[50px] flex-1 flex-col items-center justify-center rounded-xl border ${isCurrentUserCounselor ? 'bg-gray-100 opacity-60 cursor-not-allowed' : 'bg-linear-to-r from-[rgba(244,232,255,0.4)] to-[rgba(250,244,255,0.4)]'}`}>
                  <span className="font-semibold text-[#8200DA] text-sm">Pro</span>
                  <span className="text-[#8200DA] text-sm font-bold flex items-center gap-1"><img src="/coin.svg" alt="coin" className="w-3.5 h-3.5" />{formatAmount(counselor.proAmount)}</span>
                </button>
                
                <button disabled={isCurrentUserCounselor} className={`flex h-[50px] flex-1 flex-col items-center justify-center rounded-xl border ${isCurrentUserCounselor ? 'bg-gray-100 opacity-60 cursor-not-allowed' : 'bg-linear-to-r from-[rgba(255,245,206,0.4)] to-[rgba(255,250,230,0.4)]'}`}>
                  <span className="font-semibold text-[#B94C00] text-sm">Elite</span>
                  <span className="text-[#B94C00] text-sm font-bold flex items-center gap-1"><img src="/coin.svg" alt="coin" className="w-3.5 h-3.5" />{formatAmount(counselor.eliteAmount)}</span>
                </button>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center">
              <button disabled className="w-full sm:w-auto flex items-center justify-center border gap-2 px-14 py-3 text-[#B2B9C5] bg-[#F9FAFC] rounded-lg cursor-not-allowed"><Lock className="w-4 h-4 text-[#B2B9C5]"/> Chat</button>
              <button disabled className="w-full sm:w-auto flex items-center justify-center border gap-2 px-14 py-3 text-[#B2B9C5] bg-[#F9FAFC] rounded-lg cursor-not-allowed"><Lock className="w-4 h-4 text-[#B2B9C5]" /> Call</button>
              <button
                onClick={() => handleSubscribeClick(false)}
                disabled={pendingApproval || isCurrentUserCounselor}
                aria-disabled={pendingApproval || isCurrentUserCounselor}
                className={`w-full sm:flex-1 font-semibold py-3 px-6 rounded-lg transition-colors ${pendingApproval ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : isCurrentUserCounselor ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-[#3537B4] text-white hover:bg-blue-700 hover:cursor-pointer'}`}
              >
                 {pendingApproval ? 'Request Pending' : isCurrentUserCounselor ? 'Cannot Subscribe' : 'Subscribe Now'}
              </button>
            </div>
            <p className="mt-3 text-xs text-center text-[#232323] flex items-center justify-center gap-1"><Lock className="w-3 h-3" /> Subscribe to unlock chat and call features</p>
          </div>
        )}
      </div>
      {showImageModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all"
          onClick={() => setShowImageModal(false)}
        >
          <button 
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 hover:bg-white/10 p-2 rounded-full transition-colors z-50"
          >
            <X size={32} />
          </button>

          <img 
            src={imageUrl} 
            alt={fullName} 
            draggable={false}
            className="max-w-full max-h-[90vh] rounded-lg object-contain select-none shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <PlanBenefitsModal 
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        planName={selectedPlan || 'plus'}
        data={planData}
      />
    </>
  );
}