const express = require('express');
const router = express.Router();
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController')
const AuthController = require('../controllers/AuthController');

// GET /status endpoint
router.get('/status', AppController.getStatus);

// GET /stats endpoint
router.get('/stats', AppController.getStats);

// POST /users endpoint
router.post('/users', UsersController.postNew);

// GET /connect endpoint
router.get('/connect', AuthController.getConnect);

// GET /disconnect endpoint
router.get('/disconnect', AuthController.getDisconnect);

// GET /users/me endpoint
router.get('/users/me', UsersController.getMe);

module.exports = router;
