const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');

// GET /status endpoint
router.get('/status', AppController.getStatus);

// GET /stats endpoint
router.get('/stats', AppController.getStats);

module.exports = router;