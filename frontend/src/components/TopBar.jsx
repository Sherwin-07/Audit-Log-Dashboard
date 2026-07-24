export default function TopBar({ search, onSearchChange, total, onUploadClick }) {
  return (
    <header className="flex items-center gap-4 border-b border-base-border bg-base-surface px-6 py-4">
      <div className="flex items-center gap-2.5">
        <div className="h-2 w-2 rounded-full bg-signal-accent shadow-[0_0_8px_theme(colors.signal.accent)]" />
        <h1 className="font-display text-[17px] font-semibold tracking-tight">
          Audit&nbsp;Log
        </h1>
        <span className="text-ink-faint">/</span>
        <span className="font-mono text-xs text-ink-muted">
          {total.toLocaleString()} records
        </span>
      </div>

      <div className="relative ml-4 flex-1 max-w-xl">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search actor, action, resource, IP…"
          className="w-full rounded-lg border border-base-border bg-base-bg py-2 pl-9 pr-3 font-mono text-sm text-ink-primary placeholder:text-ink-faint focus:border-signal-accent"
        />
      </div>

      <button
        onClick={onUploadClick}
        className="ml-auto flex items-center gap-2 rounded-lg bg-signal-accent px-3.5 py-2 text-sm font-medium text-white hover:bg-signal-accent/90"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 16V4m0 0-4 4m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Upload logs
      </button>
    </header>
  );
}
