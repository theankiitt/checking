export const formatDate = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(dateString);
};

export const formatShortDate = (dateString: string): string => {
  return formatDate(dateString, { month: "short", day: "numeric" });
};

export const formatFullDate = (dateString: string): string => {
  return formatDate(dateString, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
