import { useEffect, useMemo, useState, useCallback } from 'react';
import TopBar from './components/TopBar.jsx';
import FilterSidebar from './components/FilterSidebar.jsx';
import StatsBar from './components/StatsBar.jsx';
import LogsTable from './components/LogsTable.jsx';
import Pagination from './components/Pagination.jsx';
import LogDetailDrawer from './components/LogDetailDrawer.jsx';
import UploadModal from './components/UploadModal.jsx';
import { fetchLogs, fetchStats } from './api/logsApi.js';

const EMPTY_FILTERS = { severity: [], status: [], role: [], region: [] };

export default function App() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Debounce the free-text search box so every keystroke doesn't fire a request.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Any filter/sort/search change resets back to page 1.
  useEffect(() => { setPage(1); }, [debouncedSearch, filters, sortBy, sortOrder, limit]);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      severity: filters.severity,
      status: filters.status,
      role: filters.role,
      region: filters.region,
      sortBy,
      sortOrder,
      page,
      limit,
    }),
    [debouncedSearch, filters, sortBy, sortOrder, page, limit]
  );

  const loadLogs = useCallback(() => {
    setLoading(true);
    setErrorMsg('');
    fetchLogs(queryParams)
      .then((res) => {
        setLogs(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, [queryParams]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  const loadStats = useCallback(() => {
    fetchStats().then(setStats).catch(() => {});
  }, []);
  useEffect(() => { loadStats(); }, [loadStats]);

  function toggleFilter(facet, value) {
    setFilters((prev) => {
      const current = prev[facet];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [facet]: next };
    });
  }

  function handleSort(field) {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  }

  function handleUploaded() {
    setUploadOpen(false);
    loadLogs();
    loadStats();
  }

  return (
    <div className="flex h-screen flex-col">
      <TopBar
        search={search}
        onSearchChange={setSearch}
        total={pagination.total}
        onUploadClick={() => setUploadOpen(true)}
      />
      <StatsBar stats={stats} />

      <div className="flex flex-1 overflow-hidden">
        <FilterSidebar
          filters={filters}
          onToggle={toggleFilter}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          {errorMsg && (
            <div className="border-b border-signal-critical/30 bg-signal-critical/10 px-6 py-2 text-xs text-signal-critical">
              {errorMsg}
            </div>
          )}
          <LogsTable
            logs={logs}
            loading={loading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onRowClick={setSelectedLog}
          />
          <Pagination
            page={pagination.page || page}
            totalPages={pagination.totalPages || 1}
            total={pagination.total || 0}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </div>
      </div>

      <LogDetailDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onUploaded={handleUploaded} />
    </div>
  );
}
