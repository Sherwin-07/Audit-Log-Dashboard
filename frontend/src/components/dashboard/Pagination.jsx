import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGE_SIZE_OPTIONS } from "../../utils/constants.js";

export default function Pagination({ pagination, onPageChange, limit, onLimitChange }) {
  const { page, totalPages, total } = pagination;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-3.5">
      <div className="flex items-center gap-3 text-xs text-ink-muted">
        <span>
          {total === 0 ? "0 results" : `${start.toLocaleString()}–${end.toLocaleString()} of ${total.toLocaleString()}`}
        </span>
        <div className="flex items-center gap-1.5">
          <span>Rows per page</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-md border border-border bg-surface-raised px-1.5 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface-raised text-ink-muted hover:text-ink hover:bg-surface-hover disabled:opacity-40 disabled:hover:bg-surface-raised"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="px-3 text-xs text-ink-muted">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface-raised text-ink-muted hover:text-ink hover:bg-surface-hover disabled:opacity-40 disabled:hover:bg-surface-raised"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
