const NotificationService = require('../services/notification.service');
const { Log, STACKS, LEVELS } = require('logging_middleware');

class NotificationController {
  async getNotifications(req, res) {
    try {
      const { page = 1, limit = 10, type } = req.query;
      
      const notifications = await NotificationService.fetchAndFilter(
        parseInt(page),
        parseInt(limit),
        type
      );
      
      res.json({ success: true, data: notifications });
    } catch (error) {
      Log(STACKS.BACKEND, LEVELS.ERROR, 'controller', `Failed to fetch notifications: ${error.message}`);
      res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
  }

  async getTopNotifications(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      const notifications = await NotificationService.getTopPriority(limit);
      
      res.json({ success: true, data: notifications });
    } catch (error) {
      Log(STACKS.BACKEND, LEVELS.ERROR, 'controller', `Failed to fetch top notifications: ${error.message}`);
      res.status(500).json({ success: false, message: 'Failed to fetch top notifications' });
    }
  }
}

module.exports = new NotificationController();
