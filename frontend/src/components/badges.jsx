// Small presentational pieces shared across the table and the drawer.
// Kept in one file since neither has state or logic worth splitting out.

const SEVERITY_STYLES = {
  CRITICAL: 'text-signal-critical border-signal-critical/40 bg-signal-critical/10',
  HIGH: 'text-signal-high border-signal-high/40 bg-signal-high/10',
  MEDIUM: 'text-signal-medium border-signal-medium/40 bg-signal-medium/10',
  LOW: 'text-signal-low border-signal-low/40 bg-signal-low/10',
};

export function SeverityBadge({ severity }) {
  const cls = SEVERITY_STYLES[severity] || 'text-ink-muted border-base-border bg-base-surface2';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-mono uppercase tracking-wide ${cls}`}>
      {severity}
    </span>
  );
}

// The severity rail: a 3px vertical bar used as the table's left edge per
// row. This is the dashboard's one signature device — a colored trace
// that reads like an oscilloscope/heartbeat line down the left of the
// log stream, so scanning severity doesn't require reading text at all.
const RAIL_COLORS = {
  CRITICAL: 'bg-signal-critical',
  HIGH: 'bg-signal-high',
  MEDIUM: 'bg-signal-medium',
  LOW: 'bg-signal-low',
};

export function SeverityRail({ severity }) {
  return <span className={`block w-[3px] self-stretch rounded-full ${RAIL_COLORS[severity] || 'bg-base-border'}`} />;
}

const STATUS_STYLES = {
  Unresolved: 'text-signal-unresolved',
  Investigating: 'text-signal-investigating',
  Resolved: 'text-signal-resolved',
};

const STATUS_DOT = {
  Unresolved: 'bg-signal-unresolved',
  Investigating: 'bg-signal-investigating',
  Resolved: 'bg-signal-resolved',
};

export function StatusPill({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${STATUS_STYLES[status] || 'text-ink-muted'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status] || 'bg-ink-faint'}`} />
      {status}
    </span>
  );
}
