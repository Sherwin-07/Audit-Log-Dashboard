import SeverityBadge from "./SeverityBadge.jsx";
import StatusBadge from "./StatusBadge.jsx";
import { formatTimestamp } from "../../utils/formatters.js";
import { truncateMiddle } from "../../utils/formatters.js";

const SEVERITY_EDGE = {
  LOW: "before:bg-severity-low/50",
  MEDIUM: "before:bg-severity-medium/70",
  HIGH: "before:bg-severity-high/80",
  CRITICAL: "before:bg-severity-critical",
};

export default function LogsTableRow({ log, onSelect }) {
  const isCriticalOpen = log.severity === "CRITICAL" && log.status === "Unresolved";

  return (
    <tr
      onClick={() => onSelect(log)}
      className={`relative cursor-pointer border-b border-border-subtle transition-colors
        before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] ${SEVERITY_EDGE[log.severity] || ""}
        hover:bg-surface-hover ${isCriticalOpen ? "bg-severity-critical/[0.04]" : ""}`}
    >
      <td className="whitespace-nowrap py-3 pl-6 pr-4 font-mono text-xs text-ink-muted">
        {formatTimestamp(log.timestamp)}
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <SeverityBadge severity={log.severity} />
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-ink">{log.actor}</td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-ink-muted">{log.action}</td>
      <td className="px-4 py-3 font-mono text-xs text-ink-muted" title={log.resource}>
        {truncateMiddle(log.resource, 34)}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-xs text-ink-muted">{log.region}</td>
      <td className="whitespace-nowrap px-4 py-3">
        <StatusBadge status={log.status} />
      </td>
    </tr>
  );
}
