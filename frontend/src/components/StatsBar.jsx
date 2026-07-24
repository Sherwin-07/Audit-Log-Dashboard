const SEVERITY_ORDER = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const SEVERITY_DOT = {
  CRITICAL: 'bg-signal-critical', HIGH: 'bg-signal-high',
  MEDIUM: 'bg-signal-medium', LOW: 'bg-signal-low',
};

export default function StatsBar({ stats }) {
  if (!stats) return null;

  return (
    <div className="flex flex-wrap items-center gap-6 border-b border-base-border bg-base-surface/60 px-6 py-3">
      {SEVERITY_ORDER.map((sev) => (
        <div key={sev} className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${SEVERITY_DOT[sev]}`} />
          <span className="font-mono text-sm text-ink-primary">{(stats.bySeverity?.[sev] || 0).toLocaleString()}</span>
          <span className="text-xs text-ink-muted">{sev.toLowerCase()}</span>
        </div>
      ))}
      <div className="ml-auto flex items-center gap-2 text-xs text-ink-muted">
        <span className="text-signal-unresolved font-mono">{(stats.byStatus?.Unresolved || 0).toLocaleString()}</span>
        unresolved right now
      </div>
    </div>
  );
}
