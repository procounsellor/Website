import { useAuthStore } from "@/store/AuthStore"
import { useState } from "react"
import startRecharge from "@/api/wallet"

declare global {
  interface Window {
    Razorpay: unknown;
  }
}

type RazorpayConstructor = new (opts: unknown) => { open: () => void };


export default function RechargeWallet(){

  const user = useAuthStore(state => state.user)
  const refreshUser = useAuthStore(state => state.refreshUser)
    const [amount, setAmount] = useState<number | null>(null)
    const [displayBalance, setDisplayBalance] = useState<number | undefined>(user?.walletAmount ?? undefined)

    async function addBalance(){
        if(!amount){
            console.error('enter amount first')
            return 
        }
        const order = await startRecharge(user?.userName ?? '',amount ?? 0)

     const options = {
      key: order.keyId,
      amount: order.amount,          
      currency: order.currency,
      order_id: order.orderId,
      name: "MyApp Wallet",
      description: "Wallet Recharge",
      notes: { userId: user?.userName }, 
      handler: async function () {
        alert("Payment added.");
        try {
          const updated = await refreshUser(true);
          if (updated && typeof updated.walletAmount === 'number') {
            setDisplayBalance(updated.walletAmount);
          } else {
            setDisplayBalance(useAuthStore.getState().user?.walletAmount ?? displayBalance);
          }
        } catch (err) {
          console.error('refreshUser after payment failed', err);
        }
      },
      theme: { color: "#3399cc" },
    };

  const Rz = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;
  const rzp = new Rz(options);
    rzp.open();
  };


    return <div className="flex items-start justify-center mt-20 bg-gray-50 h-screen  py-20">

        <div className="flex justify-center items-center flex-col gap-3">
        <h1 className="text-2xl flex gap-2 text-[#343C6A] font-semibold">
            Wallet balance
        <span className="text-[20px] font-normal">
        <span className="font-bold">{displayBalance ?? user?.walletAmount ?? 0} </span>
               Pro Coins
        </span>
        </h1>

        <input
          type="number"
          name="amount"
          value={amount ?? ''}
          className="h-14 border border-[##EFEFEF] rounded-[12px] "
          onChange={(e) => setAmount(e.target.value === '' ? null : Number(e.target.value))}
        />
        <button onClick={addBalance} className="flex items-center justify-center rounded-[8px] h-10 bg-[#ff660a] py-3 px-4 text-white text-lg font-medium">Add ProCoins</button>
        </div>


    </div>
}