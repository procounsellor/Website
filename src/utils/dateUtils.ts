export interface TimestampObject {
  seconds: number;
  nanos: number;
}

export const getRelativeTime = (timestamp: TimestampObject | number | null | undefined): string => {
  if (!timestamp) return '';
  
  let date: Date;

  if (typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else if ('seconds' in timestamp) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    return '';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
  
  const days = Math.floor(diffInSeconds / 86400);
  
  if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  const years = Math.floor(days / 365);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
};