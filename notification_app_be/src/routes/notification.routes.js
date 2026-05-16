const express = require('express');
const NotificationController = require('../controllers/notification.controller');

const router = express.Router();

router.get('/', NotificationController.getNotifications);
router.get('/top', NotificationController.getTopNotifications);

module.exports = router;
