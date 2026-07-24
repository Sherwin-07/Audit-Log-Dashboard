require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const logsRouter = require('./src/routes/logs');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
// 10,000-record bulk uploads need a generous body limit.
app.use(express.json({ limit: '25mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/logs', logsRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`[server] listening on :${PORT}`)))
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
