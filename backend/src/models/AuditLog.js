import mongoose from "mongoose";

const SEVERITY_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const STATUS_VALUES = ["Unresolved", "In Progress", "Resolved"];

const AuditLogSchema = new mongoose.Schema(
  {
    actor: { type: String, required: true, trim: true, index: true },
    role: { type: String, required: true, trim: true, index: true },
    action: { type: String, required: true, trim: true, index: true },
    resource: { type: String, required: true, trim: true },
    resourceType: { type: String, required: true, trim: true, index: true },
    ipAddress: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true, index: true },
    severity: {
      type: String,
      required: true,
      enum: SEVERITY_LEVELS,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: STATUS_VALUES,
      default: "Unresolved",
      index: true,
    },
    timestamp: { type: Date, required: true, index: true },
  },
  {
    timestamps: true, // createdAt / updatedAt for record-of-ingestion purposes
    versionKey: false,
  }
);

// Supports the free-text search box (actor, resource, action, ipAddress).
// A weighted text index keeps an actor/action match more relevant than an
// incidental substring hit inside a resource path.
AuditLogSchema.index(
  { actor: "text", action: "text", resource: "text", ipAddress: "text" },
  { weights: { actor: 5, action: 3, resource: 2, ipAddress: 1 } }
);

// Compound index matching the default table sort (newest first) so the
// common unfiltered query doesn't fall back to a collection scan.
AuditLogSchema.index({ timestamp: -1 });

export const AUDIT_LOG_SEVERITIES = SEVERITY_LEVELS;
export const AUDIT_LOG_STATUSES = STATUS_VALUES;

export default mongoose.model("AuditLog", AuditLogSchema);
