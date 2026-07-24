import { CalendarRange } from "lucide-react";
import FilterDropdown from "./FilterDropdown.jsx";
import SearchInput from "./SearchInput.jsx";
import SeverityBadge from "./SeverityBadge.jsx";
import StatusBadge from "./StatusBadge.jsx";

export default function FilterBar({
  searchInput,
  onSearchChange,
  filters,
  setFilterValues,
  filterOptions,
  dateRange,
  setDateRange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 border-b border-border bg-surface/60 px-6 py-3.5">
      <SearchInput value={searchInput} onChange={onSearchChange} />

      <FilterDropdown
        label="Severity"
        options={filterOptions.severities}
        selected={filters.severity || []}
        onChange={(values) => setFilterValues("severity", values)}
        renderOption={(value) => <SeverityBadge severity={value} />}
      />
      <FilterDropdown
        label="Status"
        options={filterOptions.statuses}
        selected={filters.status || []}
        onChange={(values) => setFilterValues("status", values)}
        renderOption={(value) => <StatusBadge status={value} />}
      />
      <FilterDropdown
        label="Region"
        options={filterOptions.regions}
        selected={filters.region || []}
        onChange={(values) => setFilterValues("region", values)}
      />
      <FilterDropdown
        label="Role"
        options={filterOptions.roles}
        selected={filters.role || []}
        onChange={(values) => setFilterValues("role", values)}
      />
      <FilterDropdown
        label="Action"
        options={filterOptions.actions}
        selected={filters.action || []}
        onChange={(values) => setFilterValues("action", values)}
      />
      <FilterDropdown
        label="Resource type"
        options={filterOptions.resourceTypes}
        selected={filters.resourceType || []}
        onChange={(values) => setFilterValues("resourceType", values)}
      />

      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-raised px-2.5 h-9">
        <CalendarRange size={14} className="text-ink-faint" />
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
          className="h-full bg-transparent text-xs text-ink-muted focus:outline-none [color-scheme:dark]"
          aria-label="Start date"
        />
        <span className="text-ink-faint text-xs">–</span>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
          className="h-full bg-transparent text-xs text-ink-muted focus:outline-none [color-scheme:dark]"
          aria-label="End date"
        />
      </div>
    </div>
  );
}
