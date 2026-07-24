import { SeverityRail, SeverityBadge, StatusPill } from './badges.jsx';

const COLUMNS = [
  { key: 'timestamp', label: 'Time', sortable: true },
  { key: 'severity', label: 'Severity', sortable: true },
  { key: 'actor', label: 'Actor', sortable: true },
  { key: 'action', label: 'Action', sortable: true },
  { key: 'resource', label: 'Resource', sortable: false },
  { key: 'region', label: 'Region', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
];

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export default function LogsTable({ logs, loading, sortBy, sortOrder, onSort, onRowClick }) {
  return (
    <div className="flex-1 overflow-auto scrollbar-thin">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-base-surface">
          <tr className="border-b border-base-border text-left text-[11px] uppercase tracking-wide text-ink-faint">
            <th className="w-[3px] px-0" />
            {COLUMNS.map((col) => (
              <th key={col.key} className="px-3 py-2.5 font-medium">
                {col.sortable ? (
                  <button
                    onClick={() => onSort(col.key)}
                    className="flex items-center gap-1 hover:text-ink-primary"
                  >
                    {col.label}
                    {sortBy === col.key && (
                      <span className="text-signal-accent">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={COLUMNS.length + 1} className="px-4 py-10 text-center text-ink-muted">
                Loading logs…
              </td>
            </tr>
          )}

          {!loading && logs.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length + 1} className="px-4 py-16 text-center">
                <p className="text-ink-primary">No logs match these filters</p>
                <p className="mt-1 text-xs text-ink-muted">Try clearing a filter or broadening the search</p>
              </td>
            </tr>
          )}

          {!loading &&
            logs.map((log) => (
              <tr
                key={log._id}
                onClick={() => onRowClick(log)}
                className="cursor-pointer border-b border-base-border/60 hover:bg-base-surface2"
              >
                <td className="p-0"><SeverityRail severity={log.severity} /></td>
                <td className="whitespace-nowrap px-3 py-2.5 font-mono text-xs text-ink-muted">
                  {formatTime(log.timestamp)}
                </td>
                <td className="px-3 py-2.5"><SeverityBadge severity={log.severity} /></td>
                <td className="px-3 py-2.5 font-mono text-xs text-ink-primary">{log.actor}</td>
                <td className="px-3 py-2.5 font-mono text-xs text-ink-muted">{log.action}</td>
                <td className="max-w-[220px] truncate px-3 py-2.5 font-mono text-xs text-ink-muted">{log.resource}</td>
                <td className="px-3 py-2.5 text-xs text-ink-muted">{log.region}</td>
                <td className="px-3 py-2.5"><StatusPill status={log.status} /></td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
