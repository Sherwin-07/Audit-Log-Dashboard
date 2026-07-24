import { useEffect, useState } from "react";
import { fetchFilterOptions } from "../api/auditLogApi.js";

const EMPTY_OPTIONS = {
  roles: [],
  actions: [],
  resourceTypes: [],
  regions: [],
  severities: [],
  statuses: [],
};

/**
 * Loads the set of distinct values currently in the collection for each
 * filterable field, so dropdowns reflect real data instead of a hardcoded
 * guess. Refetch after a bulk upload if new distinct values may appear.
 */
export function useFilterOptions(refreshKey = 0) {
  const [options, setOptions] = useState(EMPTY_OPTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchFilterOptions()
      .then((data) => {
        if (!cancelled) setOptions(data);
      })
      .catch(() => {
        if (!cancelled) setOptions(EMPTY_OPTIONS);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return { options, loading };
}
