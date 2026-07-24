import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * A button that opens a checkbox popover for selecting zero or more values
 * of a single field (e.g. severity, region). Selection is controlled by the
 * parent so it can be lifted into the shared `filters` query state.
 */
export default function FilterDropdown({ label, options, selected = [], onChange, renderOption }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const toggleValue = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const hasSelection = selected.length > 0;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors
          ${hasSelection
            ? "border-accent/40 bg-accent-muted text-accent"
            : "border-border bg-surface-raised text-ink-muted hover:text-ink hover:bg-surface-hover"}`}
      >
        {label}
        {hasSelection && (
          <span className="rounded-full bg-accent px-1.5 text-[11px] text-white">
            {selected.length}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-20 max-h-72 w-56 overflow-y-auto rounded-lg border border-border bg-surface-raised p-1.5 shadow-panel">
          {options.length === 0 && (
            <p className="px-2 py-1.5 text-xs text-ink-faint">No values yet</p>
          )}
          {options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-ink hover:bg-surface-hover"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleValue(option)}
                className="h-3.5 w-3.5 rounded border-border-subtle accent-accent"
              />
              {renderOption ? renderOption(option) : <span>{option}</span>}
            </label>
          ))}
          {hasSelection && (
            <button
              onClick={() => onChange([])}
              className="mt-1 w-full rounded-md px-2 py-1.5 text-left text-xs text-ink-muted hover:bg-surface-hover hover:text-ink"
            >
              Clear {label.toLowerCase()}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
