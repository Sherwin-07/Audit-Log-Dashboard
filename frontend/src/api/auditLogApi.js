import { apiClient } from "./client.js";

/**
 * Fetches one page of audit logs. `params` maps directly onto the query
 * string the backend expects (page, limit, search, sortBy, sortOrder, and
 * one entry per filterable field) — see
 * backend/src/controllers/auditLogController.js.
 */
export async function fetchAuditLogs(params) {
  const { data } = await apiClient.get("/audit-logs", { params });
  return data; // { data: [...], pagination: {...} }
}

export async function fetchAuditLogById(id) {
  const { data } = await apiClient.get(`/audit-logs/${id}`);
  return data;
}

export async function fetchFilterOptions() {
  const { data } = await apiClient.get("/audit-logs/meta/filter-options");
  return data;
}

/**
 * Uploads a batch of parsed log records. The backend enforces a hard
 * ceiling (10,000 by default) on records per request; larger files should
 * be chunked by the caller before calling this.
 */
export async function bulkUploadAuditLogs(logs) {
  const { data } = await apiClient.post("/audit-logs/bulk", { logs });
  return data; // { insertedCount, rejectedCount, rejected: [...] }
}
