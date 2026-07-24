const FACETS = [
  { key: 'severity', label: 'Severity', options: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
  { key: 'status', label: 'Status', options: ['Unresolved', 'Investigating', 'Resolved'] },
  { key: 'role', label: 'Role', options: ['Admin', 'Engineer', 'Analyst', 'Auditor', 'ReadOnly', 'DevOps', 'Support'] },
  { key: 'region', label: 'Region', options: ['us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-southeast-1', 'ap-northeast-1', 'sa-east-1'] },
];

// Multi-select facet filters. Each facet stores an array of selected
// values in parent state; the API accepts them comma-joined, matching
// FILTERABLE_FIELDS in the Express controller.
export default function FilterSidebar({ filters, onToggle, onClear }) {
  const activeCount = Object.values(filters).reduce((n, arr) => n + arr.length, 0);

  return (
    <aside className="w-60 shrink-0 border-r border-base-border bg-base-surface px-4 py-5 overflow-y-auto scrollbar-thin">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Filters</h2>
        {activeCount > 0 && (
          <button onClick={onClear} className="text-xs text-signal-accent hover:underline">
            Clear ({activeCount})
          </button>
        )}
      </div>

      {FACETS.map((facet) => (
        <div key={facet.key} className="mb-5">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
            {facet.label}
          </p>
          <div className="space-y-1.5">
            {facet.options.map((opt) => {
              const checked = filters[facet.key]?.includes(opt);
              return (
                <label
                  key={opt}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-sm text-ink-primary hover:bg-base-surface2"
                >
                  <input
                    type="checkbox"
                    checked={checked || false}
                    onChange={() => onToggle(facet.key, opt)}
                    className="h-3.5 w-3.5 rounded border-base-border bg-base-bg accent-signal-accent"
                  />
                  <span className="font-mono text-xs">{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
