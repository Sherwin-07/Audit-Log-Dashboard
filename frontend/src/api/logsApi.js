const BASE_URL = import.meta.env.VITE_API_BASE ?? '';

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.json();
}

/**
 * Fetch a page of logs. `params` mirrors the query string the Express
 * controller understands: search, severity, status, role, region,
 * resourceType, action, sortBy, sortOrder, page, limit, from, to.
 * Array values (multi-select filters) are joined with commas.
 */
export function fetchLogs(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    qs.set(key, Array.isArray(value) ? value.join(',') : value);
  });
  return fetch(`${BASE_URL}?${qs.toString()}`).then(handle);
}

export function fetchStats() {
  return fetch(`${BASE_URL}/stats`).then(handle);
}

export function fetchLogById(id) {
  return fetch(`${BASE_URL}/${id}`).then(handle);
}

export function bulkUploadLogs(logs) {
  return fetch(`${BASE_URL}/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ logs }),
  }).then(handle);
}
