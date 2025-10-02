import type { CounselorDetails } from '@/types/academic';
import { Bookmark, Briefcase, Languages, Lock, CheckCircle, MessageSquare, Phone, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isManualSubscriptionRequest } from '@/api/counsellor';
import type { SubscribedCounsellor } from '@/types/user';

type Props = {
  counselor: CounselorDetails;
  subscription: SubscribedCounsellor | null;
};

export function CounselorProfileCard({ counselor, subscription }: Props) {
  const userId = localStorage.getItem('phone');
  const navigate = useNavigate();
  const [pendingApproval, setPendingApproval] = useState(false);

  useEffect(() => {
    if (!subscription && userId && counselor?.userName) {
      isManualSubscriptionRequest(userId, counselor.userName)
        .then(res => setPendingApproval(Boolean(res?.pendingApproval)))
        .catch(err => console.error('Manual subscription check failed', err));
    }
  }, [subscription, userId, counselor?.userName]);

  const fullName = `${counselor.firstName} ${counselor.lastName}`;
  const imageUrl = counselor.photoUrlSmall || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=E0E7FF&color=4F46E5&size=128`;

  const formatAmount = (amount: number | null | undefined) => {
    if (amount == null) return 'N/A';
    return `₹${amount.toLocaleString('en-IN')}`;
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <img src={imageUrl} alt={fullName} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md mx-auto sm:mx-0" />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-[#343C6A]">{fullName}</h1>
              <p className="text-md text-[#718EBF] mt-1">{counselor.fullOfficeAddress?.city || 'Location not specified'}</p>
            </div>
            <button className="p-2 text-blue-600 hover:text-blue-800"><Bookmark className="w-6 h-6" /></button>
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
            <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full capitalize">
              {subscription.plan}
            </span>
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
            {/* <a href={`sms:${counselor.phoneNumber}`} className="flex items-center justify-center gap-2 text-green-600 font-semibold py-3 px-4 w-full sm:w-auto"> */}
              <MessageSquare className="w-5 h-5" /> Message
            {/* </a> */}
            {/* <a href={`tel:${counselor.phoneNumber}`} className="flex items-center justify-center gap-2 text-green-600 font-semibold py-3 px-4 w-full sm:w-auto"> */}
              <Phone className="w-5 h-5" /> Call-{counselor.phoneNumber}
            {/* </a> */}
            {upgradePlan ? (
              <button
                onClick={() => navigate('/subscribe', { state: { counselorId: counselor.userName, userId: userId, counselor: counselor } })}
                className="w-full sm:flex-1 font-semibold py-3 px-6 rounded-lg text-[#3537B4] border-2 border-[#3537B4] hover:bg-blue-50 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 text-orange-500" /> Upgrade to <span className="capitalize">{upgradePlan}</span> Plan
              </button>
            ) : (
              <button disabled className="w-full sm:flex-1 font-semibold py-3 px-6 rounded-lg bg-gray-200 text-gray-600 cursor-not-allowed">
                You are an Elite subscriber
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700">Subscription Plans</h3>
            <div className="mt-3 flex flex-col sm:flex-row gap-3">
              <button className="flex h-[50px] flex-1 flex-col items-center justify-center rounded-xl border bg-gradient-to-r from-[rgba(222,237,255,0.4)] to-[rgba(126,136,211,0.4)]"><span className="font-semibold text-sm text-[#1447E7]">Plus</span><span className="text-[#1447E7] text-sm font-bold">{formatAmount(counselor.plusAmount)}</span></button>
              <button className="flex h-[50px] flex-1 flex-col items-center justify-center rounded-xl border bg-gradient-to-r from-[rgba(244,232,255,0.4)] to-[rgba(250,244,255,0.4)]"><span className="font-semibold text-[#8200DA] text-sm">Pro</span><span className="text-[#8200DA] text-sm font-bold">{formatAmount(counselor.proAmount)}</span></button>
              <button className="flex h-[50px] flex-1 flex-col items-center justify-center rounded-xl border bg-gradient-to-r from-[rgba(255,245,206,0.4)] to-[rgba(255,250,230,0.4)]"><span className="font-semibold text-[#B94C00] text-sm">Elite</span><span className="text-[#B94C00] text-sm font-bold">{formatAmount(counselor.eliteAmount)}</span></button>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center">
            <button disabled className="w-full sm:w-auto flex items-center justify-center border gap-2 px-14 py-3 text-[#B2B9C5] bg-[#F9FAFC] rounded-lg cursor-not-allowed"><Lock className="w-4 h-4 text-[#B2B9C5]"/> Chat</button>
            <button disabled className="w-full sm:w-auto flex items-center justify-center border gap-2 px-14 py-3 text-[#B2B9C5] bg-[#F9FAFC] rounded-lg cursor-not-allowed"><Lock className="w-4 h-4 text-[#B2B9C5]" /> Call</button>
            <button
              onClick={() => navigate('/subscribe', { state: { counselorId: counselor.userName, userId: userId, counselor: counselor } })}
              disabled={pendingApproval}
              aria-disabled={pendingApproval}
              className={`w-full sm:flex-1 font-semibold py-3 px-6 rounded-lg transition-colors ${pendingApproval ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-[#3537B4] text-white hover:bg-blue-700'}`}
            >
              {pendingApproval ? 'Request Pending' : 'Subscribe Now'}
            </button>
          </div>
          <p className="mt-3 text-xs text-center text-[#232323] flex items-center justify-center gap-1"><Lock className="w-3 h-3" /> Subscribe to unlock chat and call features</p>
        </div>
      )}
    </div>
  );
}