import type { EarningsData } from '@/types/earnings';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import PlanBreakdownCard from './PlanBreakdownCard';

interface EarningsSidebarProps {
  data: EarningsData;
}

const COLORS = {
  elite: '#EE89DF',
  pro: '#978FED',
  plus: '#F6CF7D', 
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, payload }: any) => {
    const radius = outerRadius * 1.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const textAnchor = x > cx ? 'start' : 'end';
    const textOffsetX = x > cx ? 12 : -12;

    return (
      <g>
        <circle cx={x} cy={y} r={8} fill={payload.color} />
        <text 
            x={x + textOffsetX} 
            y={y} 
            fill={payload.color}
            textAnchor={textAnchor} 
            dominantBaseline="central" 
            fontSize="14px" 
            fontWeight="500"
        >
            {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
};

const planStyles = {
  plus: {
    gradient: 'bg-gradient-to-r from-[rgba(222,237,255,0.4)] to-[rgba(126,136,211,0.4)]',
    textColor: 'text-[#1447E7]',
  },
  pro: {
    gradient: 'bg-gradient-to-r from-[rgba(244,232,255,0.4)] to-[rgba(250,244,255,0.4)]',
    textColor: 'text-[#8200DA]',
  },
  elite: {
    gradient: 'bg-gradient-to-r from-[rgba(255,245,206,0.4)] to-[rgba(255,250,230,0.4)]',
    textColor: 'text-[#B94C00]',
  }
};


export default function EarningsSidebar({ data }: EarningsSidebarProps) {
  const distributionData = [
    { name: 'Elite Plan', value: data.elitePercentage || 0, color: COLORS.elite },
    { name: 'Pro Plan', value: data.proPercentage || 0, color: COLORS.pro },
    { name: 'Plus Plan', value: data.plusPercentage || 0, color: COLORS.plus },
  ].filter(item => item.value > 0);


  return (
    <div className="space-y-6 flex-shrink-0">
      <div>
        <h2 className="text-xl font-semibold text-[#343C6A]">Earnings Distribution (This Cycle)</h2>
        <div className="mt-4 border border-[#EFEFEF] rounded-2xl bg-white h-[264px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="none"
                    >
                        {distributionData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

      <hr className="border-[#E4E4E4]" />

      <div>
        <h2 className="text-xl font-semibold text-[#343C6A]">Plan-wise Breakdown</h2>
        <div className="mt-4 border border-[#EFEFEF] rounded-2xl bg-white p-4 space-y-4">
           <PlanBreakdownCard 
             planName="Plus Plan"
             percentage={data.plusPercentage}
             earnings={data.totalPlusEarnings}
             payout={data.totalPlusPayout}
             styles={planStyles.plus}
           />
           <PlanBreakdownCard 
             planName="Pro Plan"
             percentage={data.proPercentage}
             earnings={data.totalProEarnings}
             payout={data.totalProPayout}
             styles={planStyles.pro}
           />
           <PlanBreakdownCard 
             planName="Elite Plan"
             percentage={data.elitePercentage}
             earnings={data.totalEliteEarnings}
             payout={data.totalElitePayout}
             styles={planStyles.elite}
           />
        </div>
      </div>
    </div>
  );
}