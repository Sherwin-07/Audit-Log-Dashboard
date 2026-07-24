import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchAuditLogs } from "../api/auditLogApi.js";
import { useDebounce } from "./useDebounce.js";

const DEFAULT_SORT = { field: "timestamp", order: "desc" };
const DEFAULT_LIMIT = 25;

/**
 * Owns every piece of state that determines "what page of what query" is
 * currently on screen — filters, search text, sort, pagination — and keeps
 * the fetched result in sync with it. All filtering/sorting/pagination is
 * resolved server-side; this hook only ever holds one page of rows.
 */
export function useAuditLogs() {
  const [filters, setFilters] = useState({}); // { severity: ['HIGH','CRITICAL'], status: ['Unresolved'], ... }
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(searchInput, 350);

  // Any change to filters/search/sort/page-size should snap back to page 1 —
  // otherwise the user could land on a page number past the end of a newly
  // narrowed result set.
  useEffect(() => {
    setPage(1);
  }, [filters, dateRange, debouncedSearch, sort, limit]);

  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
      sortBy: sort.field,
      sortOrder: sort.order,
    };
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (dateRange.startDate) params.startDate = dateRange.startDate;
    if (dateRange.endDate) params.endDate = dateRange.endDate;

    Object.entries(filters).forEach(([field, values]) => {
      if (values && values.length > 0) params[field] = values.join(",");
    });

    return params;
  }, [page, limit, sort, debouncedSearch, dateRange, filters]);

  const [requestId, setRequestId] = useState(0);
  const refetch = useCallback(() => setRequestId((id) => id + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAuditLogs(queryParams)
      .then((result) => {
        if (cancelled) return;
        setLogs(result.data);
        setPagination(result.pagination);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.message || "Failed to load audit logs.");
        setLogs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [queryParams, requestId]);

  const toggleSort = useCallback((field) => {
    setSort((prev) => {
      if (prev.field !== field) {
        return { field, order: field === "timestamp" ? "desc" : "asc" };
      }
      return { field, order: prev.order === "asc" ? "desc" : "asc" };
    });
  }, []);

  const setFilterValues = useCallback((field, values) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (!values || values.length === 0) {
        delete next[field];
      } else {
        next[field] = values;
      }
      return next;
    });
  }, []);

  const clearFilter = useCallback((field) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setDateRange({ startDate: "", endDate: "" });
    setSearchInput("");
  }, []);

  const activeFilterCount =
    Object.keys(filters).length +
    (dateRange.startDate || dateRange.endDate ? 1 : 0);

  return {
    logs,
    pagination,
    loading,
    error,
    sort,
    toggleSort,
    filters,
    setFilterValues,
    clearFilter,
    clearAllFilters,
    activeFilterCount,
    dateRange,
    setDateRange,
    searchInput,
    setSearchInput,
    page,
    setPage,
    limit,
    setLimit,
    refetch,
  };
}
