import { useState } from 'react';
import { bulkUploadLogs } from '../api/logsApi.js';

// Accepts a JSON file containing an array of log records (matching the
// PDF's schema) and posts it in one request to POST /api/logs/bulk.
export default function UploadModal({ open, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | error | success
  const [message, setMessage] = useState('');

  if (!open) return null;

  async function handleUpload() {
    if (!file) return;
    setStatus('uploading');
    setMessage('');
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const logs = Array.isArray(parsed) ? parsed : parsed.logs;
      if (!Array.isArray(logs)) throw new Error('File must contain a JSON array of log records');

      const result = await bulkUploadLogs(logs);
      setStatus('success');
      setMessage(`Inserted ${result.insertedCount.toLocaleString()} of ${logs.length.toLocaleString()} records`);
      onUploaded?.();
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-base-border bg-base-surface p-6">
        <h3 className="font-display text-lg font-semibold">Upload audit logs</h3>
        <p className="mt-1 text-sm text-ink-muted">
          Select a JSON file with up to 10,000 log records. Filtering, sorting and search all happen server-side after ingest.
        </p>

        <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-base-border py-8 hover:border-signal-accent">
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => { setFile(e.target.files?.[0] || null); setStatus('idle'); }}
          />
          <span className="font-mono text-xs text-ink-muted">
            {file ? file.name : 'Click to choose a .json file'}
          </span>
        </label>

        {message && (
          <p className={`mt-3 text-xs ${status === 'error' ? 'text-signal-critical' : 'text-signal-resolved'}`}>
            {message}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-3.5 py-2 text-sm text-ink-muted hover:bg-base-surface2">
            Close
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || status === 'uploading'}
            className="rounded-lg bg-signal-accent px-3.5 py-2 text-sm font-medium text-white hover:bg-signal-accent/90 disabled:opacity-40"
          >
            {status === 'uploading' ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
