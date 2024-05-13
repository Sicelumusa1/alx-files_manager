const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

const AppController = {
  getStatus: async (req, res) => {
    try {
      // Check redis and db if they are alive
      const redisAlive = await redisClient.isAlive();
      const dbAlive = await dbClient.isAlive();

      // Return the status
      res.status(200).json({ redis: redisAlive, db: dbAlive });
    } catch (error) {
      console.error('Error checking status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getStats: async (req, res) => {
    try {
      // Check number of files and users from the database
      const numUsers = await dbClient.nbUsers();
      const numFiles = await dbClient.nbFiles();

      // Return the status
      res.status(200).json({ users: numUsers, files: numFiles });
    } catch (error) {
      console.error('Error getting stats:', error);
      res.stats(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = AppController;
