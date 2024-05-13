const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

const AuthController = {
  getConnect: async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Decode the credentials from the header
      const encodedCredentials = authHeader.split(' ')[1];
      const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
      const [email, password] = decodedCredentials.split(':');

      // Retrieve user from database
      const user = await dbClient.client.db().collection('users').findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({  error: 'Unauthorized'});
      }

      const token = uuidv4();
      const key = `auth_${token}`;
      console.log('User ID:', user._id.toString());
      await redisClient.set(key, user._id.toString(), 'EX', 86400); // Store uses ID for 24 hours
      
      return res.status(200).json({ token });

    } catch (error) {
      console.error('Error signing in user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getDisconnect: async (req, res) => {
    try {
      const token = req.headers['x-token'];
      if (!token) {
        return res.status(401).json({  error: 'Unauthorized'});
      }

      const key = `auth_${token}`;
      const userId = await redisClient.get(key);
      if (!userId) {
        return res.status(401).json({  error: 'Unauthorized'});
      }

      await redisClient.del(key);
      return res.status(204).end();

    } catch (error) {
      console.error('Error signing out user:', error);
      res.stats(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = AuthController;
