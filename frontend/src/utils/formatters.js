const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export function formatTimestamp(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return dateFormatter.format(date);
}

export function formatRelative(value) {
  if (!value) return "";
  const diffMs = Date.now() - new Date(value).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  return `${diffDay}d ago`;
}

export function truncateMiddle(str, maxLength = 40) {
  if (!str || str.length <= maxLength) return str;
  const half = Math.floor((maxLength - 3) / 2);
  return `${str.slice(0, half)}...${str.slice(str.length - half)}`;
}
