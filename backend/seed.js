#!/usr/bin/env node
/**
 * seed.js — generates 10,000 audit log records and POSTs them via the bulk API.
 * Usage:  node seed.js
 * Make sure the backend is running on http://localhost:5000 first.
 */

const BASE_URL = process.env.API_URL || 'http://localhost:5001';
const TOTAL    = 10_000;
const BATCH    = 1_000;   // split into batches to stay under body-size limits

const actors       = ['alice@corp.com','bob@corp.com','carol@corp.com','dave@corp.com','eve@corp.com','frank@corp.com','grace@corp.com','heidi@corp.com'];
const roles        = ['Admin','Engineer','Analyst','Auditor','ReadOnly','DevOps','Support'];
const actions      = ['LOGIN','LOGOUT','CREATE','DELETE','UPDATE','READ','EXPORT','IMPORT','PERMISSION_CHANGE','CONFIG_UPDATE'];
const resources    = ['user-service','auth-service','billing-api','report-engine','data-warehouse','config-store','log-aggregator','vpc-network'];
const resourceTypes= ['Service','Database','Network','Storage','IAM','Application','Server'];
const regions      = ['us-east-1','us-west-2','eu-west-1','eu-central-1','ap-southeast-1','ap-northeast-1','sa-east-1'];
const severities   = ['LOW','MEDIUM','HIGH','CRITICAL'];
const statuses     = ['Unresolved','Investigating','Resolved'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomIp() { return `${rand(1,254)}.${rand(0,255)}.${rand(0,255)}.${rand(1,254)}`; }
function randomDate() {
  const now = Date.now();
  const yearAgo = now - 365 * 24 * 60 * 60 * 1000;
  return new Date(yearAgo + Math.random() * (now - yearAgo)).toISOString();
}

function generateRecord() {
  return {
    actor       : pick(actors),
    role        : pick(roles),
    action      : pick(actions),
    resource    : pick(resources),
    resourceType: pick(resourceTypes),
    ipAddress   : randomIp(),
    region      : pick(regions),
    severity    : pick(severities),
    status      : pick(statuses),
    timestamp   : randomDate(),
  };
}

async function postBatch(logs, batchNum) {
  const res = await fetch(`${BASE_URL}/api/logs/bulk`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ logs }),
  });

  const text = await res.text();
  let json;
  try { json = JSON.parse(text); }
  catch { throw new Error(`Batch ${batchNum} — non-JSON response (${res.status}): ${text.slice(0,200)}`); }

  if (!res.ok && res.status !== 207) {
    throw new Error(`Batch ${batchNum} failed (${res.status}): ${json?.message}`);
  }
  return json;
}

async function main() {
  // Health-check first
  try {
    const health = await fetch(`${BASE_URL}/api/health`);
    if (!health.ok) throw new Error(`Health check returned ${health.status}`);
    console.log(`✅ Backend reachable at ${BASE_URL}\n`);
  } catch (err) {
    console.error(`❌ Cannot reach backend at ${BASE_URL}`);
    console.error('   Make sure "npm run dev" is running in the backend folder.');
    process.exit(1);
  }

  console.log(`Seeding ${TOTAL} records in batches of ${BATCH}…\n`);
  let totalInserted = 0;

  for (let i = 0; i < TOTAL; i += BATCH) {
    const batch = Array.from({ length: BATCH }, generateRecord);
    const batchNum = i / BATCH + 1;
    const result = await postBatch(batch, batchNum);
    const inserted = result.insertedCount ?? BATCH;
    totalInserted += inserted;
    console.log(`  Batch ${batchNum}/${TOTAL / BATCH} → inserted: ${inserted}`);
  }

  console.log(`\n✅ Done — ${totalInserted} records seeded into MongoDB`);
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
