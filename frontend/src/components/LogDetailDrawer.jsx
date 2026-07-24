import { SeverityBadge, StatusPill } from './badges.jsx';

const FIELD_ROWS = [
  ['actor', 'Actor'], ['role', 'Role'], ['action', 'Action'],
  ['resource', 'Resource'], ['resourceType', 'Resource type'],
  ['ipAddress', 'IP address'], ['region', 'Region'],
];

// Slide-in inspector for investigating a single log. Rendered as a raw
// key/value monospace block deliberately — this is a tool for security
// engineers, and looking like the source record (not a prettified card)
// is what makes it feel trustworthy for investigation.
export default function LogDetailDrawer({ log, onClose }) {
  if (!log) return null;

  return (
    <div className="fixed inset-0 z-30 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative flex w-full max-w-md flex-col border-l border-base-border bg-base-surface">
        <div className="flex items-center justify-between border-b border-base-border px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-faint">Log detail</p>
            <p className="font-mono text-xs text-ink-muted mt-0.5">{log._id}</p>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink-primary">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
          <div className="mb-5 flex items-center gap-3">
            <SeverityBadge severity={log.severity} />
            <StatusPill status={log.status} />
          </div>

          <dl className="space-y-3">
            {FIELD_ROWS.map(([key, label]) => (
              <div key={key} className="flex items-start justify-between gap-4 border-b border-base-border/50 pb-3">
                <dt className="text-xs text-ink-muted">{label}</dt>
                <dd className="font-mono text-xs text-ink-primary text-right break-all">{log[key]}</dd>
              </div>
            ))}
            <div className="flex items-start justify-between gap-4 pb-3">
              <dt className="text-xs text-ink-muted">Timestamp</dt>
              <dd className="font-mono text-xs text-ink-primary text-right">
                {new Date(log.timestamp).toISOString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
