const Log = require('../models/Log');

const FILTERABLE_FIELDS = ['severity', 'status', 'role', 'region', 'resourceType', 'action'];
const SORTABLE_FIELDS = ['timestamp', 'severity', 'status', 'actor', 'action', 'region'];
const MAX_BULK_SIZE = 10000;
const MAX_PAGE_LIMIT = 100;

/**
 * POST /api/logs/bulk
 * Accepts { logs: [...] } and inserts up to 10,000 records in one call.
 * Uses insertMany with ordered:false so one malformed record doesn't
 * abort the whole batch; failures are reported back to the client.
 */
async function bulkUpload(req, res, next) {
  try {
    const { logs } = req.body;

    if (!Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({ message: '"logs" must be a non-empty array' });
    }
    if (logs.length > MAX_BULK_SIZE) {
      return res.status(413).json({ message: `Max ${MAX_BULK_SIZE} records per request` });
    }

    const result = await Log.insertMany(logs, { ordered: false, rawResult: true });

    return res.status(201).json({
      insertedCount: result.insertedCount,
      requested: logs.length,
    });
  } catch (err) {
    // insertMany with ordered:false throws a BulkWriteError that still
    // contains how many documents succeeded before the first failure.
    if (err.name === 'MongoBulkWriteError') {
      return res.status(207).json({
        message: 'Bulk insert completed with some failures',
        insertedCount: err.result?.insertedCount ?? 0,
        writeErrors: err.writeErrors?.map((e) => ({ index: e.index, message: e.errmsg })),
      });
    }
    next(err);
  }
}

/**
 * GET /api/logs
 * All filtering, searching, sorting and pagination happens server-side
 * via the query string, e.g.:
 * /api/logs?severity=HIGH&status=Unresolved&search=priya&sortBy=timestamp&sortOrder=desc&page=2&limit=25
 */
async function getLogs(req, res, next) {
  try {
    const {
      search,
      sortBy = 'timestamp',
      sortOrder = 'desc',
      page = 1,
      limit = 25,
      from,
      to,
    } = req.query;

    const query = {};

    // Exact-match facet filters (?severity=HIGH&status=Resolved ...)
    // Supports comma-separated values for multi-select facets, e.g. severity=HIGH,CRITICAL
    for (const field of FILTERABLE_FIELDS) {
      if (req.query[field]) {
        const values = String(req.query[field]).split(',').filter(Boolean);
        query[field] = values.length > 1 ? { $in: values } : values[0];
      }
    }

    // Date range filter on timestamp
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    // Free-text search across actor / action / resource / ipAddress
    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    const safeSortField = SORTABLE_FIELDS.includes(sortBy) ? sortBy : 'timestamp';
    const sort = { [safeSortField]: sortOrder === 'asc' ? 1 : -1 };

    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 25, 1), MAX_PAGE_LIMIT);
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
      Log.find(query).sort(sort).skip(skip).limit(safeLimit).lean(),
      Log.countDocuments(query),
    ]);

    res.json({
      data,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.max(Math.ceil(total / safeLimit), 1),
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/logs/stats
 * Powers the StatsBar - counts grouped by severity and status so the
 * dashboard doesn't have to pull all matching rows just to summarize them.
 */
async function getStats(req, res, next) {
  try {
    const [bySeverity, byStatus, total] = await Promise.all([
      Log.aggregate([{ $group: { _id: '$severity', count: { $sum: 1 } } }]),
      Log.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Log.countDocuments(),
    ]);

    const toMap = (rows) => rows.reduce((acc, r) => ({ ...acc, [r._id]: r.count }), {});

    res.json({ total, bySeverity: toMap(bySeverity), byStatus: toMap(byStatus) });
  } catch (err) {
    next(err);
  }
}

/** GET /api/logs/:id */
async function getLogById(req, res, next) {
  try {
    const log = await Log.findById(req.params.id).lean();
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  } catch (err) {
    next(err);
  }
}

module.exports = { bulkUpload, getLogs, getStats, getLogById };
