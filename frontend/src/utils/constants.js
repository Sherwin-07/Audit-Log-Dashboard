export const SEVERITY_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
export const STATUS_VALUES = ["Unresolved", "In Progress", "Resolved"];

export const SEVERITY_STYLES = {
  LOW: { dot: "bg-severity-low", text: "text-severity-low", ring: "ring-severity-low/30" },
  MEDIUM: { dot: "bg-severity-medium", text: "text-severity-medium", ring: "ring-severity-medium/30" },
  HIGH: { dot: "bg-severity-high", text: "text-severity-high", ring: "ring-severity-high/30" },
  CRITICAL: { dot: "bg-severity-critical", text: "text-severity-critical", ring: "ring-severity-critical/30" },
};

export const STATUS_STYLES = {
  Unresolved: { dot: "bg-status-unresolved", text: "text-status-unresolved" },
  "In Progress": { dot: "bg-status-progress", text: "text-status-progress" },
  Resolved: { dot: "bg-status-resolved", text: "text-status-resolved" },
};

// Columns rendered in the logs table, in order. `sortField` maps to the
// backend's sort allow-list; omit it for columns that can't be sorted.
export const TABLE_COLUMNS = [
  { key: "timestamp", label: "Time", sortField: "timestamp" },
  { key: "severity", label: "Severity", sortField: "severity" },
  { key: "actor", label: "Actor", sortField: "actor" },
  { key: "action", label: "Action", sortField: "action" },
  { key: "resource", label: "Resource" },
  { key: "region", label: "Region", sortField: "region" },
  { key: "status", label: "Status", sortField: "status" },
];

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
