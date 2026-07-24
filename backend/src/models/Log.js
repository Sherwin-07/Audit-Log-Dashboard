const mongoose = require('mongoose');

// Indexed on every field a security engineer is likely to filter, sort or
// search by. Compound indexes are added for the filter combinations the
// dashboard actually issues (see logsController) rather than indexing every
// permutation, to keep write cost sane for 10k-record bulk inserts.
const LogSchema = new mongoose.Schema(
  {
    actor: { type: String, required: true, index: true },
    role: { type: String, required: true, index: true },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true },
    resourceType: { type: String, required: true, index: true },
    ipAddress: { type: String, required: true },
    region: { type: String, required: true, index: true },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['Unresolved', 'Investigating', 'Resolved'],
      required: true,
      index: true,
    },
    timestamp: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

// Text index powers the free-text search box (actor, action, resource, ip).
LogSchema.index({ actor: 'text', action: 'text', resource: 'text', ipAddress: 'text' });
// Common compound query shape: filter by severity/status, sort by time.
LogSchema.index({ severity: 1, status: 1, timestamp: -1 });

module.exports = mongoose.model('Log', LogSchema);
