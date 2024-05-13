const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController')

// GET /status endpoint
router.get('/status', AppController.getStatus);

// GET /stats endpoint
router.get('/stats', AppController.getStats);

// POST /users endpoint
router.post('/users', UsersController.postNew);

module.exports = router;
