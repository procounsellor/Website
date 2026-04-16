import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProBuddyOverviewTab from '@/components/Revamp/ProbuddiesDashboard/ProBuddyOverviewTab';
import ProBuddyCallsTab from '@/components/Revamp/ProbuddiesDashboard/ProBuddyCallsTab';
import ProBuddyEarningsTab from '@/components/Revamp/ProbuddiesDashboard/ProBuddyEarningsTab';
import ProBuddyReviewsTab from '@/components/Revamp/ProbuddiesDashboard/ProBuddyReviewsTab';
import { probuddiesApi } from '@/api/pro-buddies';

const tabs = ['Overview', 'Calls', 'My Earnings', 'Reviews'];

type AnyRecord = Record<string, unknown>;

type CallTabItem = {
  id: string;
  initials: string;
  name: string;
  designation: string;
  date: string;
  time: string;
  duration?: string;
};

type ReviewTabItem = {
  id: string;
  name: string;
  time: string;
  rating: number;
  avatar: string;
  text: string;
};

const isRecord = (value: unknown): value is AnyRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const getByPath = (source: unknown, path: string): unknown => {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (!isRecord(acc)) {
      return undefined;
    }
    return acc[key];
  }, source);
};

const toText = (value: unknown, fallback = 'NA'): string => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const toNumeric = (value: unknown, fallback = 0): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const getInitials = (fullName: string): string => {
  const normalized = fullName.trim();
  if (!normalized || normalized === 'NA') return 'PB';
  const parts = normalized.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || 'PB';
};

const toDateLabel = (value: unknown): string => {
  if (typeof value === 'string' && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
    return value;
  }

  if (isRecord(value)) {
    const seconds = Number(value.seconds);
    if (Number.isFinite(seconds)) {
      const parsed = new Date(seconds * 1000);
      return parsed.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  }

  return 'NA';
};

const toTimeLabel = (value: unknown): string => {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  if (isRecord(value)) {
    const seconds = Number(value.seconds);
    if (Number.isFinite(seconds)) {
      const parsed = new Date(seconds * 1000);
      return parsed.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  return 'NA';
};

const toRecordDataNode = (payload: unknown): AnyRecord | null => {
  if (!isRecord(payload)) {
    return null;
  }

  const dataNode = payload.data;
  if (isRecord(dataNode)) {
    return dataNode;
  }

  return payload;
};

const toArrayDataNode = (payload: unknown): AnyRecord[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) {
    return [];
  }

  const dataNode = payload.data;
  if (Array.isArray(dataNode)) {
    return dataNode.filter(isRecord);
  }

  const candidateKeys = ['requests', 'callRequests', 'reviews', 'result', 'items'];
  for (const key of candidateKeys) {
    const node = payload[key];
    if (Array.isArray(node)) {
      return node.filter(isRecord);
    }
  }

  if (isRecord(dataNode)) {
    for (const key of candidateKeys) {
      const node = dataNode[key];
      if (Array.isArray(node)) {
        return node.filter(isRecord);
      }
    }
  }

  return [];
};

const ProBuddyMainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const proBuddyId = useMemo(() => localStorage.getItem('phone') || '', []);

  const profileQuery = useQuery({
    queryKey: ['probuddy-dashboard-profile-mapped', proBuddyId],
    queryFn: () => probuddiesApi.profileForProBuddy(proBuddyId),
    enabled: Boolean(proBuddyId),
  });

  const requestsQuery = useQuery({
    queryKey: ['probuddy-dashboard-requests', proBuddyId],
    queryFn: () => probuddiesApi.requestsReceivedByProBuddy(proBuddyId),
    enabled: Boolean(proBuddyId),
  });

  const reviewsQuery = useQuery({
    queryKey: ['probuddy-dashboard-reviews', proBuddyId],
    queryFn: () => probuddiesApi.reviewsForProBuddy(proBuddyId),
    enabled: Boolean(proBuddyId),
  });

  const profileDataNode = useMemo(() => toRecordDataNode(profileQuery.data), [profileQuery.data]);
  const requestsDataList = useMemo(() => toArrayDataNode(requestsQuery.data), [requestsQuery.data]);
  const reviewsDataList = useMemo(() => toArrayDataNode(reviewsQuery.data), [reviewsQuery.data]);

  const mappedOverview = useMemo(() => {
    return {
      heading: toText(getByPath(profileDataNode, 'aboutMe.heading'), 'NA'),
      aboutText: toText(
        getByPath(profileDataNode, 'aboutMe.aboutMe') ?? getByPath(profileDataNode, 'aboutMe.description'),
        'NA'
      ),
      whoShouldConnect: toText(getByPath(profileDataNode, 'whoShouldConnect'), 'NA'),
    };
  }, [profileDataNode]);

  const mappedCallItems = useMemo<CallTabItem[]>(() => {
    return requestsDataList.map((item, index) => {
      const name = toText(getByPath(item, 'userFullName'), 'NA');
      const userId = toText(getByPath(item, 'userId'), `req-${index}`);

      return {
        id: `${userId}-${index}`,
        initials: getInitials(name),
        name,
        designation: 'NA',
        date: toDateLabel(getByPath(item, 'scheduledDate')),
        time: toTimeLabel(getByPath(item, 'scheduledTime')),
        duration: 'NA',
      };
    });
  }, [requestsDataList]);

  const requestsItems = useMemo(
    () =>
      mappedCallItems.filter((_, index) => {
        const raw = requestsDataList[index];
        const status = String(getByPath(raw, 'status') ?? '').toLowerCase();
        return !['completed', 'done', 'closed'].includes(status);
      }),
    [mappedCallItems, requestsDataList]
  );

  const completedItems = useMemo(
    () =>
      mappedCallItems.filter((_, index) => {
        const raw = requestsDataList[index];
        const status = String(getByPath(raw, 'status') ?? '').toLowerCase();
        return ['completed', 'done', 'closed'].includes(status);
      }),
    [mappedCallItems, requestsDataList]
  );

  const mappedReviews = useMemo<ReviewTabItem[]>(() => {
    return reviewsDataList.map((item, index) => {
      const name = toText(getByPath(item, 'userFullName'), 'NA');

      return {
        id: toText(getByPath(item, 'reviewId'), `review-${index}`),
        name,
        time: toDateLabel(getByPath(item, 'timestamp')),
        rating: toNumeric(getByPath(item, 'rating'), 0),
        avatar: toText(getByPath(item, 'imageUrl'), `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=CBD5E1&color=0F172A&size=128`),
        text: toText(getByPath(item, 'reviewText'), 'NA'),
      };
    });
  }, [reviewsDataList]);

  const aggregateRating = useMemo(() => {
    const fromProfile = toNumeric(getByPath(profileDataNode, 'rating'), 0);
    if (fromProfile > 0) return fromProfile;
    if (mappedReviews.length === 0) return 0;
    const total = mappedReviews.reduce((sum, item) => sum + item.rating, 0);
    return total / mappedReviews.length;
  }, [mappedReviews, profileDataNode]);

  const aggregateCount = useMemo(() => {
    const fromProfile = toNumeric(
      getByPath(profileDataNode, 'noOfRatingsReceived') ?? getByPath(profileDataNode, 'reviewsCount'),
      0
    );
    if (fromProfile > 0) return fromProfile;
    return mappedReviews.length;
  }, [mappedReviews.length, profileDataNode]);

  return (
    <div className="w-full max-w-full xl:w-232 min-h-0 sm:min-h-148.5 bg-white rounded-2xl shadow-sm flex flex-col relative z-20 font-poppins overflow-visible pb-4 sm:pb-0">
      <div className="flex flex-nowrap sm:items-center w-full h-auto sm:h-14.75 bg-[#C6DDF040] px-2 sm:px-6 xl:px-8 gap-1.5 sm:gap-6 overflow-x-auto overflow-y-hidden">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative h-10 sm:h-full flex items-center justify-center cursor-pointer transition-colors shrink-0 px-1 sm:px-0 min-w-0 flex-1 sm:flex-initial"
            >
              <span
                className={`text-[11px] sm:text-[16px] leading-none whitespace-nowrap ${
                  isActive ? 'font-semibold text-[#0E1629]' : 'font-medium text-[#6B7280] hover:text-[#0E1629]'
                }`}
              >
                {tab}
              </span>

              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%+12px)] h-0.75 sm:h-0.75 bg-[#0E1629] rounded-t-[2px]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="grow">
        {activeTab === 'Overview' && (
          <ProBuddyOverviewTab
            heading={mappedOverview.heading}
            aboutText={mappedOverview.aboutText}
            whoShouldConnect={mappedOverview.whoShouldConnect}
          />
        )}
        {activeTab === 'Calls' && <ProBuddyCallsTab requests={requestsItems} completed={completedItems} />}
        {activeTab === 'My Earnings' && <ProBuddyEarningsTab />}
        {activeTab === 'Reviews' && (
          <ProBuddyReviewsTab
            aggregateRating={aggregateRating}
            aggregateCount={aggregateCount}
            reviews={mappedReviews}
          />
        )}
      </div>
    </div>
  );
};

export default ProBuddyMainContent;
