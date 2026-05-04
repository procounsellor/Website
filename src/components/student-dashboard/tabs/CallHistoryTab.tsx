import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/AuthStore';
import { probuddiesApi } from '@/api/pro-buddies';
import { Loader2 } from 'lucide-react';

type AnyMap = Record<string, unknown>;

const isAnyMap = (v: unknown): v is AnyMap =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const toHistoryArray = (payload: unknown): AnyMap[] => {
  if (Array.isArray(payload)) return payload.filter(isAnyMap);
  if (!isAnyMap(payload)) return [];
  const candidateKeys = ['data', 'result', 'items', 'callHistory', 'history', 'calls'];
  for (const key of candidateKeys) {
    const node = payload[key];
    if (Array.isArray(node)) return node.filter(isAnyMap);
  }
  if (isAnyMap(payload.data)) {
    for (const key of candidateKeys) {
      const node = (payload.data as AnyMap)[key];
      if (Array.isArray(node)) return node.filter(isAnyMap);
    }
  }
  return [];
};

const toLabel = (value: unknown, fallback = 'NA') => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const toDateAndTime = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return { dateLabel: 'NA', timeLabel: 'NA' };
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { dateLabel: value, timeLabel: 'NA' };
  return {
    dateLabel: parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    timeLabel: parsed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
};

const toDuration = (value: unknown) => {
  if (typeof value === 'string' && value.trim()) return value;
  const num = Number(value);
  if (Number.isFinite(num) && num >= 0) return `${num} min`;
  return 'NA';
};

export default function CallHistoryTab() {
  const { userId } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['userCallHistory', userId],
    queryFn: () => probuddiesApi.userCallHistory(userId!),
    enabled: !!userId,
  });

  const rows = toHistoryArray(data).map((item, index) => {
    const dateSource =
      item.callDateTime ?? item.callDate ?? item.createdAt ?? item.scheduledDateTime ?? item.timestamp;
    const { dateLabel, timeLabel } = toDateAndTime(dateSource);
    const status = toLabel(item.status ?? item.callStatus, 'Completed');
    return {
      id: toLabel(item.callId ?? item.id ?? `${index}`, `${index}`),
      proBuddyName: toLabel(item.proBuddyFullName ?? item.proBuddyName ?? item.fullName ?? item.name, 'ProBuddy'),
      dateLabel,
      timeLabel,
      durationLabel: toDuration(item.duration ?? item.callDuration ?? item.durationInMinutes),
      statusLabel: status.charAt(0).toUpperCase() + status.slice(1),
    };
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-blue-800" />
      </div>
    );
  }

  if (error instanceof Error) {
    return <p className="text-red-500 py-4">{error.message}</p>;
  }

  if (rows.length === 0) {
    return <p className="text-gray-500 py-4">No call history found.</p>;
  }

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      <div className="divide-y divide-gray-100">
        {rows.map((row) => (
          <div key={row.id} className="px-4 py-3.5 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-[#0E1629] truncate">{row.proBuddyName}</p>
              <p className="text-[13px] text-gray-500 mt-0.5">{row.dateLabel} at {row.timeLabel}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] text-gray-400">Duration</p>
              <p className="text-[13px] font-semibold text-[#0E1629]">{row.durationLabel}</p>
            </div>
            <span className="shrink-0 px-3 py-1 rounded-full text-[12px] font-semibold bg-green-50 text-green-600">
              {row.statusLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
