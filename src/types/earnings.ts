export interface Transaction {
  paymentId: string;
  counsellorId: string;
  userId: string | null;
  type: 'credit' | 'payout';
  amount: number;
  timestamp: number;
  description: string;
  method: string;
  status: string;
  subscriptionPlan: 'plus' | 'pro' | 'elite' | string | null;
}

export interface EarningsData {
  counsellorId: string;
  counsellorFullName: string;
  slabOfCounsellor: string;
  slabInformation: string;
  plusPlanCommission: string;
  proPlanCommission: string;
  elitePlanCommission: string;
  totalPlusEarnings: number;
  totalPlusPayout: number;
  totalProEarnings: number;
  totalProPayout: number;
  totalEliteEarnings: number;
  totalElitePayout: number;
  totalYearEarnings: number;
  totalYearPayout: number;
  totalMonthEarnings: number;
  totalMonthPayout: number;
  totalLifetimeEarnings: number;
  totalLifetimePayout: number;
  totalEarnings: number;
  totalPayout: number;
  transactionData: Transaction[];
  offlineTransactions: Transaction[];
  plusPercentage: number;
  proPercentage: number;
  elitePercentage: number;
}

export interface MonthlyEarnings {
  month: string;
  plus: number;
  pro: number;
  elite: number;
}





