import { Search, X } from "lucide-react";

export default function SearchInput({ value, onChange }) {
  return (
    <div className="relative flex-1 min-w-[220px] max-w-md">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search actor, action, resource, IP..."
        className="h-9 w-full rounded-lg border border-border bg-surface-raised pl-9 pr-8 text-sm text-ink
          placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
