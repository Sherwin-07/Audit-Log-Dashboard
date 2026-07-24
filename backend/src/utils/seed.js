// Generates sample audit log records and inserts them directly via
// Mongoose (bypassing the API) so you can populate the database for local
// testing without needing a 10,000-row file on hand.
//
// Usage: npm run seed  -- (reads MONGODB_URI from .env, inserts 5,000 rows)

import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import AuditLog, { AUDIT_LOG_SEVERITIES, AUDIT_LOG_STATUSES } from "../models/AuditLog.js";

const ACTIONS = [
  "DELETE_USER",
  "CREATE_USER",
  "UPDATE_ROLE",
  "LOGIN_FAILED",
  "LOGIN_SUCCESS",
  "EXPORT_DATA",
  "GRANT_PERMISSION",
  "REVOKE_PERMISSION",
  "UPDATE_CONFIG",
  "DELETE_RESOURCE",
];
const ROLES = ["admin", "editor", "viewer", "auditor", "support"];
const RESOURCE_TYPES = ["USER", "DOCUMENT", "CONFIG", "API_KEY", "BILLING", "ROLE"];
const REGIONS = ["ap-south-1", "us-east-1", "eu-west-1", "ap-southeast-2", "sa-east-1"];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomIp = () =>
  `${1 + Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 255)}.${Math.floor(
    Math.random() * 255
  )}.${Math.floor(Math.random() * 255)}`;

function buildRecord(i) {
  const daysAgo = Math.floor(Math.random() * 90);
  const timestamp = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  const resourceType = randomFrom(RESOURCE_TYPES);

  return {
    actor: `user${i % 250}@company.com`,
    role: randomFrom(ROLES),
    action: randomFrom(ACTIONS),
    resource: `/api/${resourceType.toLowerCase()}s/${1000 + (i % 900)}`,
    resourceType,
    ipAddress: randomIp(),
    region: randomFrom(REGIONS),
    severity: randomFrom(AUDIT_LOG_SEVERITIES),
    status: randomFrom(AUDIT_LOG_STATUSES),
    timestamp,
  };
}

async function seed() {
  await connectDB();

  const count = Number(process.argv[2]) || 5000;
  const batchSize = 1000;
  let inserted = 0;

  console.log(`Seeding ${count} audit log records...`);

  for (let start = 0; start < count; start += batchSize) {
    const batch = Array.from({ length: Math.min(batchSize, count - start) }, (_, j) =>
      buildRecord(start + j)
    );
    await AuditLog.insertMany(batch);
    inserted += batch.length;
    console.log(`  inserted ${inserted}/${count}`);
  }

  console.log("Done.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
