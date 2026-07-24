import AuditLog, {
  AUDIT_LOG_SEVERITIES,
  AUDIT_LOG_STATUSES,
} from "../models/AuditLog.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const REQUIRED_FIELDS = [
  "actor",
  "role",
  "action",
  "resource",
  "resourceType",
  "ipAddress",
  "region",
  "severity",
  "status",
  "timestamp",
];

const BULK_INSERT_LIMIT = Number(process.env.BULK_INSERT_LIMIT) || 10000;

// Fields the client is allowed to sort or filter on. Kept as an allow-list
// so a query string can never be used to sort/project on an arbitrary,
// unindexed, or internal field.
const SORTABLE_FIELDS = new Set([
  "timestamp",
  "actor",
  "role",
  "action",
  "resourceType",
  "severity",
  "status",
  "region",
]);

const FILTERABLE_FIELDS = [
  "actor",
  "role",
  "action",
  "resourceType",
  "severity",
  "status",
  "region",
];

/**
 * POST /api/audit-logs/bulk
 * Body: { logs: [ {...}, {...}, ... ] }  (max BULK_INSERT_LIMIT records)
 *
 * Validates each record's shape before insert and reports per-record
 * validation failures without letting one bad row abort the whole batch.
 */
export const bulkCreateAuditLogs = asyncHandler(async (req, res) => {
  const { logs } = req.body;

  if (!Array.isArray(logs) || logs.length === 0) {
    return res.status(400).json({ message: "'logs' must be a non-empty array" });
  }

  if (logs.length > BULK_INSERT_LIMIT) {
    return res.status(400).json({
      message: `A single request may contain at most ${BULK_INSERT_LIMIT} records (received ${logs.length})`,
    });
  }

  const validDocs = [];
  const rejected = [];

  logs.forEach((log, index) => {
    const missing = REQUIRED_FIELDS.filter((field) => log[field] === undefined || log[field] === null || log[field] === "");
    if (missing.length > 0) {
      rejected.push({ index, reason: `Missing field(s): ${missing.join(", ")}` });
      return;
    }
    if (!AUDIT_LOG_SEVERITIES.includes(log.severity)) {
      rejected.push({ index, reason: `Invalid severity '${log.severity}'` });
      return;
    }
    if (!AUDIT_LOG_STATUSES.includes(log.status)) {
      rejected.push({ index, reason: `Invalid status '${log.status}'` });
      return;
    }
    const parsedTimestamp = new Date(log.timestamp);
    if (Number.isNaN(parsedTimestamp.getTime())) {
      rejected.push({ index, reason: `Invalid timestamp '${log.timestamp}'` });
      return;
    }

    validDocs.push({ ...log, timestamp: parsedTimestamp });
  });

  let inserted = [];
  if (validDocs.length > 0) {
    // ordered: false lets MongoDB continue past any individual write error
    // (e.g. a duplicate _id) instead of aborting the whole batch.
    inserted = await AuditLog.insertMany(validDocs, { ordered: false });
  }

  res.status(201).json({
    insertedCount: inserted.length,
    rejectedCount: rejected.length,
    rejected: rejected.slice(0, 50), // cap the echoed error list
  });
});

/**
 * GET /api/audit-logs
 *
 * Query params:
 *  - page (default 1), limit (default 25, max 100)
 *  - search: free-text match across actor / action / resource / ipAddress
 *  - sortBy (default 'timestamp'), sortOrder ('asc' | 'desc', default 'desc')
 *  - actor, role, action, resourceType, severity, status, region: exact filters
 *    (comma-separated for multi-select, e.g. severity=HIGH,CRITICAL)
 *  - startDate, endDate: ISO date bounds on `timestamp`
 *
 * All filtering, sorting, and pagination happens in the query itself so the
 * dashboard never has to pull more than one page of documents into memory.
 */
export const getAuditLogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 25));

  const filter = {};

  FILTERABLE_FIELDS.forEach((field) => {
    const raw = req.query[field];
    if (!raw) return;
    const values = String(raw).split(",").map((v) => v.trim()).filter(Boolean);
    if (values.length === 1) {
      filter[field] = values[0];
    } else if (values.length > 1) {
      filter[field] = { $in: values };
    }
  });

  if (req.query.startDate || req.query.endDate) {
    filter.timestamp = {};
    if (req.query.startDate) filter.timestamp.$gte = new Date(req.query.startDate);
    if (req.query.endDate) filter.timestamp.$lte = new Date(req.query.endDate);
  }

  let textScoreProjection = null;
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
    textScoreProjection = { score: { $meta: "textScore" } };
  }

  const sortBy = SORTABLE_FIELDS.has(req.query.sortBy) ? req.query.sortBy : "timestamp";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
  const sort = req.query.search && !req.query.sortBy
    ? { score: { $meta: "textScore" } }
    : { [sortBy]: sortOrder, _id: sortOrder }; // _id tiebreaker keeps pagination stable

  const [data, total] = await Promise.all([
    AuditLog.find(filter, textScoreProjection)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  res.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
});

/**
 * GET /api/audit-logs/:id
 */
export const getAuditLogById = asyncHandler(async (req, res) => {
  const log = await AuditLog.findById(req.params.id).lean();
  if (!log) return res.status(404).json({ message: "Audit log not found" });
  res.json(log);
});

/**
 * GET /api/audit-logs/meta/filter-options
 *
 * Returns the distinct values currently present for each filterable field,
 * so the dashboard's filter dropdowns always reflect real data rather than
 * a hardcoded list.
 */
export const getFilterOptions = asyncHandler(async (req, res) => {
  const [roles, actions, resourceTypes, regions] = await Promise.all([
    AuditLog.distinct("role"),
    AuditLog.distinct("action"),
    AuditLog.distinct("resourceType"),
    AuditLog.distinct("region"),
  ]);

  res.json({
    roles: roles.sort(),
    actions: actions.sort(),
    resourceTypes: resourceTypes.sort(),
    regions: regions.sort(),
    severities: AUDIT_LOG_SEVERITIES,
    statuses: AUDIT_LOG_STATUSES,
  });
});
