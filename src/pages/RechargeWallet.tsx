import { useAuthStore } from "@/store/AuthStore"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import startRecharge from "@/api/wallet"
import AddFundsPanel from "@/components/student-dashboard/AddFundsPanel"

declare global {
  interface Window {
    Razorpay: unknown;
  }
}
type RazorpayConstructor = new (opts: unknown) => { open: () => void };

export default function RechargeWallet() {
  const user = useAuthStore(state => state.user)
  const refreshUser = useAuthStore(state => state.refreshUser)
  const navigate = useNavigate();
  
  const [displayBalance, setDisplayBalance] = useState<number | undefined>(user?.walletAmount ?? undefined);
  const [isPanelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    setPanelOpen(true);
  }, []);

  const handlePanelClose = () => {
    setPanelOpen(false);
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };

  const handleRecharge = async (amount: number) => {
    if (!amount || amount <= 0) {
      console.error('A valid amount is required.');
      return;
    }
    try {
      const order = await startRecharge(user?.userName ?? '', amount);
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "ProCounsel Wallet",
        description: "Wallet Recharge",
        notes: { userId: user?.userName },
        handler: async function () {
          alert("Payment successful. Your balance will be updated shortly.");
          try {
            const updatedUser = await refreshUser(true);
            if (updatedUser && typeof updatedUser.walletAmount === 'number') {
              setDisplayBalance(updatedUser.walletAmount);
            }
          } catch (err) {
            console.error('Failed to refresh user balance after payment.', err);
          } finally {
            handlePanelClose();
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Razorpay modal dismissed.');
          }
        },
        theme: { color: "#3399cc" },
      };

      const Rz = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;
      const rzp = new Rz(options);
      rzp.open();

    } catch (error) {
      console.error("Failed to initiate Razorpay order.", error);
      alert("Could not start the payment process. Please try again later.");
    }
  };

  const currentBalance = displayBalance ?? user?.walletAmount ?? 0;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99] transition-opacity duration-300">
      <AddFundsPanel
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        balance={currentBalance}
        onAddMoney={handleRecharge}
      />
    </div>
  );
}