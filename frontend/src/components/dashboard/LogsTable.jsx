import { ArrowDown, ArrowUp, ArrowUpDown, FileSearch, AlertTriangle } from "lucide-react";
import { TABLE_COLUMNS } from "../../utils/constants.js";
import LogsTableRow from "./LogsTableRow.jsx";
import EmptyState from "../common/EmptyState.jsx";

function SortIcon({ active, order }) {
  if (!active) return <ArrowUpDown size={12} className="text-ink-faint" />;
  return order === "asc" ? (
    <ArrowUp size={12} className="text-accent" />
  ) : (
    <ArrowDown size={12} className="text-accent" />
  );
}

function SkeletonRows({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-border-subtle">
          {TABLE_COLUMNS.map((col) => (
            <td key={col.key} className="px-4 py-3.5">
              <div className="h-3 w-full max-w-[120px] animate-pulse rounded bg-surface-hover" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function LogsTable({ logs, loading, error, sort, toggleSort, onSelectLog, hasActiveQuery }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-surface/40">
            {TABLE_COLUMNS.map((col) => (
              <th
                key={col.key}
                className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-ink-faint first:pl-6"
              >
                {col.sortField ? (
                  <button
                    onClick={() => toggleSort(col.sortField)}
                    className="inline-flex items-center gap-1 hover:text-ink-muted"
                  >
                    {col.label}
                    <SortIcon active={sort.field === col.sortField} order={sort.order} />
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && <SkeletonRows />}
          {!loading && !error && logs.map((log) => (
            <LogsTableRow key={log._id} log={log} onSelect={onSelectLog} />
          ))}
        </tbody>
      </table>

      {!loading && error && (
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load audit logs"
          description={error}
        />
      )}

      {!loading && !error && logs.length === 0 && (
        <EmptyState
          icon={FileSearch}
          title={hasActiveQuery ? "No logs match these filters" : "No audit logs yet"}
          description={
            hasActiveQuery
              ? "Try widening the date range or clearing a filter."
              : "Upload a batch of audit log records to get started."
          }
        />
      )}
    </div>
  );
}
