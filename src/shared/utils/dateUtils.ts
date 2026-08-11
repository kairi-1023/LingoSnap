/**
 * Utility function to format timestamp as relative time (e.g. "2 hours ago", "Just now", "Yesterday")
 */
export function formatTimeAgo(dateInput: string | Date | number, locale: string = 'ko'): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'object' ? dateInput : new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const isKo = locale === 'ko';

  if (diffSec < 60) {
    return isKo ? '방금 전' : 'Just now';
  }
  if (diffMin < 60) {
    return isKo ? `${diffMin}분 전` : `${diffMin}m ago`;
  }
  if (diffHour < 24) {
    return isKo ? `${diffHour}시간 전` : `${diffHour}h ago`;
  }
  if (diffDay === 1) {
    return isKo ? '어제' : 'Yesterday';
  }
  if (diffDay < 7) {
    return isKo ? `${diffDay}일 전` : `${diffDay}d ago`;
  }

  return date.toLocaleDateString(isKo ? 'ko-KR' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
}
