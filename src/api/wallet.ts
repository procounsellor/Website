import { API_CONFIG } from "./config";

const {baseUrl} = API_CONFIG



export default async function startRecharge(userId:string, amount:number){
    try{
        const token = localStorage.getItem('jwt')
        if(!token){
            return "auth token not found."
        }

        const response = await fetch(`${baseUrl}/api/proCoins/addProCoins?userId=${userId}&amount=${amount}`,
            {
                method:"POST",
                headers:{
                        Accept:'application/json',
                        Authorization:`Bearer ${token}`
                }
            }
        )

        if(!response.ok){
            console.error(response.statusText)
        }

        const result = await response.json()

        return result
    }catch(err){
        console.error(err)
    }
}




export  async function transferAmount(counselorId:string, userId:string, amount:number){
    try{
        const token = localStorage.getItem('jwt')
        if(!token){
            return "auth token not found."
        }

        const response = await fetch(`${baseUrl}/api/proCoins/transferProCoins?userId=${userId}&counsellorId=${counselorId}&amount=${amount}`,
            {
                method:"POST",
                headers:{
                        Accept:'application/json',
                        Authorization:`Bearer ${token}`
                }
            }
        )

        if(!response.ok){
            console.error(response.statusText)
        }

        const result = await response.json()

        return result
    }catch(err){
        console.error(err)
    }
}


export  async function subscribeCounselor(counselorId:string, userId:string, amount:number, plan:string){
    try{
        const token = localStorage.getItem('jwt')
        if(!token){
            return "auth token not found."
        }
        const payload = {userId:userId,counsellorId:counselorId,receiverFcmToken: null,amount:amount,plan:plan.toLowerCase()}

        const response = await fetch(`${baseUrl}/api/user/subscribe`,
            {
                method:"POST",
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json',
                    Authorization:`Bearer ${token}`
                },
                body:JSON.stringify(payload)
            }
        )
        if(!response.ok){
            const text = await response.text();
            throw new Error(`Subscribe API failed: ${response.status} ${response.statusText} - ${text}`)
        }

        const result = await response.json()

        return result
    }catch(err){
        console.error(err)
    }
}



export async function manualPaymentApproval(counselorId: string, userId: string, amount: number, plan: string, subscriptionType: string) {
  try {
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error("Authentication token not found.");
    }
    const payload = {
      userId: userId,
      counsellorId: counselorId,
      receiverFcmToken: null,
      amount: amount,
      plan: plan.toLowerCase(),
      subscriptionType: subscriptionType
    };

    const response = await fetch(`${baseUrl}/api/user/manualSubscriptionRequest`, {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Manual request API failed: ${response.status}`);
    }

    return await response.json();

  } catch (err) {
    console.error("Manual Payment Approval Error:", err);
    throw err;
  }
}

export interface UpgradePlanPayload {
  userId: string;
  counsellorId: string;
  receiverFcmToken: string | null;
  amount: number;
  plan: 'plus' | 'pro' | 'elite';
  subscriptionMode: 'online' | 'offline';
  subscriptionType: 'upgrade';
}

export async function upgradeSubscriptionPlan(payload: UpgradePlanPayload) {
    const token = localStorage.getItem('jwt');
    if (!token) throw new Error("Authentication token not found.");
  try {
    const response = await fetch(`${baseUrl}/api/user/upgradePlan`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upgrade subscription plan');
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Upgrade Subscription Plan Error:", error);
    throw error;
  }
}

