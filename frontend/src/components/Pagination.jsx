export default function Pagination({ page, totalPages, total, limit, onPageChange, onLimitChange }) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between border-t border-base-border bg-base-surface px-6 py-3 text-xs text-ink-muted">
      <div className="flex items-center gap-3">
        <span className="font-mono">{start}–{end} of {total.toLocaleString()}</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="rounded-md border border-base-border bg-base-bg px-2 py-1 font-mono text-ink-primary"
        >
          {[25, 50, 100].map((n) => (
            <option key={n} value={n}>{n} / page</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md px-2.5 py-1 hover:bg-base-surface2 disabled:opacity-30"
        >
          Prev
        </button>
        <span className="px-2 font-mono text-ink-primary">{page} / {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md px-2.5 py-1 hover:bg-base-surface2 disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  );
}
