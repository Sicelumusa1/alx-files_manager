const bcrypt = require('bcrypt');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

const UsersController = {
  postNew: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate email and password
      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      // Check if email already exists
      const existingUser = await dbClient.client.db().collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' })
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = {
        email,
        password: hashedPassword,
      };

      // save the user to the database
      await dbClient.client.db().collection('users').insertOne (newUser);

      // Return the new user, only email and id
      res.status(201).json({
        email: newUser.email,
        id: newUser._id,
      });

    } catch (error) {
      console.error('Error creating user', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  getMe: async (req, res) => {
    try {
      const token = req.headers['x-token'];

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const key = `auth_${token}`;
      const userId = await redisClient.get(key);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized'});
      }

      const user = await dbClient.client.db().collection('users').findOne({ _id: userId });
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized'});
      }

      return res.status(200).json({
        email: user.email,
        id: user._id,
      });
    } catch (error) {
      console.error('Error retrieving user', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = UsersController;
