/* eslint-disable @typescript-eslint/no-explicit-any */
import { X } from "lucide-react";
import { Badge } from "../ui";
import "./PlansDrawer.css";
import { useState, useEffect } from "react";
import type { CounselorDetails } from "@/types";
import { useAuthStore } from "@/store/AuthStore";
import { useNavigate } from "react-router-dom";
import { transferAmount, subscribeCounselor, manualPaymentApproval } from "@/api/wallet";

type PlansResponse = {
  benefits?: Array<any>;
  elite?: string[];
  pro?: string[];
  plus?: string[];
  prices?: { elite?: string; pro?: string; plus?: string };
  seats?: { elite?: string; pro?: string; plus?: string };
  desc?: { elite?: string; pro?: string; plus?: string };
  counselor?: CounselorDetails;
};

export default function PlansDrawer({
  open,
  onClose,
  planKey,
  plan,
  planTitle,
  price,
  counselor,
}: {
  open: boolean;
  onClose: () => void;
  planKey?: string | null;
  plan?: PlansResponse;
  planTitle?: string | null;
  price?: string | undefined;
  counselor?: CounselorDetails;
}) {
  const [payingOffline, setPayingOffline] = useState(false);
  const [approved, setApproved] = useState(false)
  const [offlineAck, setOfflineAck] = useState(false);
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const navigate = useNavigate();

  async function subscribe() {
    const wallet = user?.walletAmount ?? 0;
    const priceNum = Number(price ?? 0);
    if (wallet < priceNum) {
      navigate("/wallet");
      return;
    }
    if (!counselor?.userName || !user?.userName) {
      console.error("Missing counselor or user identifier for payment");
      return;
    }
    try {
      // transfer pro coins from user to counsellor
      const transferRes = await transferAmount(counselor.userName, user.userName, priceNum);
      // expect API to return an object with success flag or status
      if (!transferRes || (transferRes as any).status === false) {
        console.error('Transfer failed', transferRes);
        return;
      }

      // after successful transfer, call subscribe endpoint
      const subscribeRes = await subscribeCounselor(counselor.userName, user.userName, priceNum, (planTitle ?? '').toLowerCase());
      console.log('subscribeRes', subscribeRes);

      // refresh cached user (wallet amount will be decreased)
      await refreshUser(true);

      // close drawer and optionally navigate or show success
      onClose();
    } catch (err) {
      console.error('Subscription flow failed', err);
    }
  }



  async function offlinePayment(){
    const priceNum = Number(price ?? 0);
    if(!counselor?.userName || !user?.userName){
      console.log('Counselor username of user id mising')
      return 
    }

    try{
      const offlinePayment = await manualPaymentApproval(counselor.userName, user.userName, priceNum, (planTitle ?? '').toLowerCase())
      console.log('offline payment: ', offlinePayment)
      setPayingOffline(false)
      setApproved(offlinePayment.status)

    }catch(e){
      console.error(e)
    }
  }

  useEffect(() => {
    if (!open) return;
    void refreshUser(true);
    // small mount animation trigger
    setMounted(true);
    return () => setMounted(false);
  }, [open, refreshUser]);

  if (!open) return null;

  const desc = plan?.desc ? (plan?.desc as any)?.[planKey ?? ""] : undefined;

  if (payingOffline) {
    return (
      <div className="fixed inset-0 z-50 pointer-events-auto">
        <div
          className={`absolute inset-0 cursor-pointer bg-black/30 backdrop-blur-sm transition-opacity duration-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}
          onClick={onClose}
        />

        <aside className={`absolute right-0 top-0 bottom-0 w-[460px] p-7 bg-white shadow-xl transform transition-all duration-300 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}>
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center">
              <h1 className="text-[20px] font-semibold text-[#343C6A]">
                Offline Payment
              </h1>
              <button
                className="flex items-center justify-center group hover:bg-[#232323] rounded-full w-6 h-6"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="group-hover:text-white text-gray-500" size={17} />
              </button>
            </div>

            {/* Scrollable content area (header/footer stay fixed) */}
            <div className="flex-1 overflow-auto plans-drawer-content">
              <div className="flex justify-between items-center mt-5">
                <div className="flex gap-2">
                  <img src="/payoffline.svg" alt="" />
                  <h1 className="flex flex-col  text-[#343C6A] text-lg font-semibold">
                    Payment Initiated
                  </h1>
                </div>
              </div>

              <p className="font-normal text-[14px] text-[#232323] py-3">
                Your offline payment request has been recorded. Please complete
                the payment as instructed below
              </p>

              <div className="flex items-center justify-center gap-2 mb-5 mt-2">
                <hr className="w-full bg-[#D0D0D0] h-px" />
              </div>

              <div className="flex items-center justify-start gap-2">
                <img src="/greenwallet.svg" alt="" />
                <h1 className="text-lg text-[#343C6A] font-semibold">
                  Payment Instruction
                </h1>
              </div>

              <div className="py-4 flex gap-2 items-start">
                <img src="/one.svg" alt="" />
                <h1 className="flex flex-col gap-2 font-medium text-[16px] text-[#232323]">
                  Transfer the subscription amount
                  <span className="text-[14px] text-[#718EBF] font-normal">
                    Use your preferred payment method{" "}
                    <span className="font-medium">
                      (bank transfer, UPI, cash){" "}
                    </span>
                    to pay the counselor directly.
                  </span>
                </h1>
              </div>

              <div className="py-4 flex gap-2 items-start">
                <img src="/two.svg" alt="" />
                <h1 className="flex flex-col gap-2 font-medium text-[16px] text-[#232323]">
                  Keep the payment proof
                  <span className="text-[14px] text-[#718EBF] font-normal">
                    Save your transaction receipt or take a photo as proof of
                    payment.
                  </span>
                </h1>
              </div>

              <div className="py-4 flex gap-2 items-start">
                <img src="/three.svg" alt="" />
                <h1 className="flex flex-col gap-2 font-medium text-[16px] text-[#232323]">
                  Confirm and Send request
                  <span className="text-[14px] text-[#718EBF] font-normal">
                    Acknowledge your payment below and send the subscription
                    request.
                  </span>
                </h1>
              </div>

              <div className="flex text-xs font-normal bg-[#F9FAFB] border border-[#F9FAFB] rounded-[12px] p-4 w-[404px]">
                <div className="flex items-center gap-3">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    checked={offlineAck}
                    onChange={(e) => setOfflineAck(e.target.checked)}
                    className="w-4 h-4 text-[#ff660a] bg-gray-100 border-gray-300 rounded-sm"
                  />

                  <p className=" text-[#232323]">
                    I hereby acknowledge that I have paid the agreed amount to
                    the counsellor in offline mode.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 my-5">
                <hr className="w-full bg-[#D0D0D0] h-px" />
              </div>

              <div className="flex flex-col  gap-4 max-w-[404px]">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 items-center">
                    <img
                      src={counselor?.photoUrlSmall}
                      alt=""
                      className="h-[72px] w-[72px] rounded-[8px]"
                    />
                    <h1 className="flex flex-col gap-2 text-[16px] font-semibold text-[#343C6A]">
                      {`${counselor?.firstName} ${counselor?.lastName}`}
                      <span className="text-[#718EBF] text-xs font-normal">{`${counselor?.fullOfficeAddress.city} ${counselor?.organisationName}`}</span>
                    </h1>
                  </div>
                  <img src="/fav.svg" alt="" className="cursor-pointer" />
                </div>

                <button
                  onClick={offlinePayment}
                  disabled={!offlineAck}
                  aria-disabled={!offlineAck}
                  className={`my-4 py-3 px-2 rounded-[12px] flex items-center justify-center text-[16px] font-semibold ${
                    offlineAck
                      ? 'bg-[#EA5C19] text-white cursor-pointer'
                      : 'bg-[#919191] text-white cursor-not-allowed'
                  }`}
                >
                  Send request
                </button>

                <div className="flex justify-center">
                  <div
                    onClick={() => setPayingOffline(!payingOffline)}
                    className="cursor-pointer mb-[190px] mt-3 text-xs font-normal text-[#707070]"
                  >
                    Click here to return to online payment
                  </div>
                </div>
              </div>

              <div></div>
            </div>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto">
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <aside className={`absolute right-0 top-0 bottom-0 w-[460px] p-7 bg-white shadow-xl transform transition-all duration-300 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}>
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center">
            <h1 className="text-[20px] font-semibold text-[#343C6A]">
              {planTitle} Membership Details
            </h1>
            <button
              className="flex items-center cursor-pointer justify-center group hover:bg-[#232323] rounded-full w-6 h-6"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="group-hover:text-white text-gray-500" size={17} />
            </button>
          </div>

          {/* Scrollable content area (header/footer stay fixed) */}
          <div className="flex-1 overflow-auto plans-drawer-content">
            <div className="flex justify-between items-center mt-5">
              <div className="flex gap-2">
                <img src="/plus.svg" alt="" />
                <h1 className="flex flex-col  text-[#343C6A] text-lg font-semibold">
                  {" "}
                  {planTitle} <span className="text-[14px]">{price}</span>
                </h1>
              </div>

              <Badge
                variant="outline"
                className="bg-[rgba(234,92,25,0.1)] text-xs text-[rgb(236,94,26)] rounded-[16px] px-4 py-1 h-6"
              >
                Limited Access
              </Badge>
            </div>

            <p className="font-normal text-[14px] text-[#232323] py-3">
              {desc}
            </p>

            <div className="flex items-center justify-center gap-2 mb-5 mt-2">
              <hr className="w-[108px] bg-[#D0D0D0] h-px" />
              <p className="text-[#232323] text-lg font-semibold">
                Exclusive Benefits
              </p>
              <hr className="w-[108px] bg-[#D0D0D0] h-px" />
            </div>

            <div className="flex flex-col gap-3">
              {(() => {
                if (!planKey || !plan) return null;
                const key = planKey as "plus" | "pro" | "elite";
                const features = (plan as any)[key] as string[] | undefined;

                if (!features || features.length === 0) {
                  return (
                    <p className="text-sm text-gray-500">
                      No benefits available.
                    </p>
                  );
                }

                return features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <img src="/tick.svg" alt="" />
                    <p className="text-sm text-[#232323]">{feat}</p>
                  </div>
                ));
              })()}
            </div>

            <hr className="w-full h-px bg-[#D0D0D0] my-5" />

            <div className="flex text-[14px] font-normal text-[#232323] justify-between bg-[#F9FAFB] border border-[#F9FAFB] rounded-[12px] p-4 w-[404px]">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                  <img src="/planImage.svg" alt="" />
                  {planTitle}
                </div>
                <div className="flex gap-2 items-center">
                  <img src="/wallet.svg" alt="" />
                  <p>Wallet Balance</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-[16px] font-medium text-[#232323]">
                <div className="">{price}</div>
                <div>{user?.walletAmount}</div>
              </div>
            </div>

            <button
              onClick={subscribe}
              disabled={approved}
              aria-disabled={approved}
              className={`${approved ? 'bg-[#919191]': 'bg-[#EA5C19]'} cursor-pointer w-[404px] my-5 py-3 px-2 rounded-[12px] flex items-center justify-center text-[16px] text-white font-semibold`}
            >
              Subscribe
            </button>

            <div className="w-full flex items-center justify-center">
             {approved ? (
               <div
                className="flex gap-2 p-2.5 bg-[#F0F2F5] border border-[#E5E7EB] rounded-[12px]"
              >
                <img src="/pending.svg" alt="" />
                <button className="text-[#232323] text-[14px] font-medium">
                  Request Pending
                </button>
              </div>
             ):(
               <div
                onClick={() => setPayingOffline(!payingOffline)}
                className="flex gap-2 p-2.5 bg-[#F0F2F5] cursor-pointer border border-[#E5E7EB] rounded-[12px] w-[130px]"
              >
                <img src="/pay.svg" alt="" />
                <button className="text-[#232323] cursor-pointer text-[14px] font-medium">
                  Pay offline
                </button>
              </div>
             )
            }
            </div>

            <div className="flex justify-center">
              <div className="mb-[190px] mt-3 text-xs font-normal text-[#707070]">
                Bank transfer or cash payment available
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
