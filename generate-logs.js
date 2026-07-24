#!/usr/bin/env node
/**
 * generate-logs.js
 * Generates a logs.json file with 10,000 audit log records
 * ready to upload via the dashboard's "Upload logs" button.
 *
 * Usage: node generate-logs.js
 * Output: logs.json (in the same directory)
 */

const fs   = require('fs');
const path = require('path');

const TOTAL  = 10_000;
const OUTPUT = path.join(__dirname, 'logs.json');

const actors       = ['alice@corp.com','bob@corp.com','carol@corp.com','dave@corp.com','eve@corp.com','frank@corp.com','grace@corp.com','heidi@corp.com','ivan@corp.com','judy@corp.com'];
const roles        = ['Admin','Engineer','Analyst','Auditor','ReadOnly','DevOps','Support'];
const actions      = ['LOGIN','LOGOUT','CREATE','DELETE','UPDATE','READ','EXPORT','IMPORT','PERMISSION_CHANGE','CONFIG_UPDATE'];
const resources    = ['user-service','auth-service','billing-api','report-engine','data-warehouse','config-store','log-aggregator','vpc-network','k8s-cluster','s3-bucket'];
const resourceTypes= ['Service','Database','Network','Storage','IAM','Application','Server'];
const regions      = ['us-east-1','us-west-2','eu-west-1','eu-central-1','ap-southeast-1','ap-northeast-1','sa-east-1'];
const severities   = ['LOW','MEDIUM','HIGH','CRITICAL'];
const statuses     = ['Unresolved','Investigating','Resolved'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomIp() { return `${rand(1,254)}.${rand(0,255)}.${rand(0,255)}.${rand(1,254)}`; }

function randomDate() {
  const now     = Date.now();
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

console.log(`Generating ${TOTAL} log records…`);
const logs = Array.from({ length: TOTAL }, generateRecord);

fs.writeFileSync(OUTPUT, JSON.stringify(logs, null, 2));

const sizeKB = (fs.statSync(OUTPUT).size / 1024).toFixed(1);
console.log(`✅ Done → ${OUTPUT}`);
console.log(`   Records : ${TOTAL}`);
console.log(`   File size: ${sizeKB} KB`);
