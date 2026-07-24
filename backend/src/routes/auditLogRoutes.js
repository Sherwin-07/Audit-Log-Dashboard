import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  bulkCreateAuditLogs,
  getAuditLogs,
  getAuditLogById,
  getFilterOptions,
} from "../controllers/auditLogController.js";

const router = Router();

// Bulk upload is heavier (up to 10k records / one large payload) and is
// rarely called by legitimate use, so it gets its own tighter limit on top
// of the general API rate limiter in server.js.
const bulkUploadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/meta/filter-options", getFilterOptions);
router.post("/bulk", bulkUploadLimiter, bulkCreateAuditLogs);
router.get("/:id", getAuditLogById);
router.get("/", getAuditLogs);

export default router;
