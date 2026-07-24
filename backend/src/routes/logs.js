const express = require('express');
const { bulkUpload, getLogs, getStats, getLogById } = require('../controllers/logsController');

const router = express.Router();

router.post('/bulk', bulkUpload);
router.get('/stats', getStats);
router.get('/:id', getLogById);
router.get('/', getLogs);

module.exports = router;
