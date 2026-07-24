import { X } from "lucide-react";

const FIELD_LABELS = {
  severity: "Severity",
  status: "Status",
  region: "Region",
  role: "Role",
  action: "Action",
  resourceType: "Resource type",
};

export default function ActiveFilterChips({
  filters,
  setFilterValues,
  dateRange,
  setDateRange,
  onClearAll,
}) {
  const chips = [];

  Object.entries(filters).forEach(([field, values]) => {
    (values || []).forEach((value) => {
      chips.push({
        key: `${field}:${value}`,
        label: `${FIELD_LABELS[field] || field}: ${value}`,
        onRemove: () => setFilterValues(field, values.filter((v) => v !== value)),
      });
    });
  });

  if (dateRange.startDate || dateRange.endDate) {
    chips.push({
      key: "date-range",
      label: `Date: ${dateRange.startDate || "…"} → ${dateRange.endDate || "…"}`,
      onRemove: () => setDateRange({ startDate: "", endDate: "" }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle bg-surface/30 px-6 py-2.5">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2.5 py-1 text-xs text-ink-muted"
        >
          {chip.label}
          <button onClick={chip.onRemove} aria-label={`Remove filter ${chip.label}`}>
            <X size={12} className="text-ink-faint hover:text-ink" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs font-medium text-accent hover:text-accent-hover"
      >
        Clear all
      </button>
    </div>
  );
}
