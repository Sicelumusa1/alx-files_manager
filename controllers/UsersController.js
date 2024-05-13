const bcrypt = require('bcrypt');
const User = require('../utils/Users');

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
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' })
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        email,
        password: hashedPassword,
      });

      // save the user to the database
      await newUser.save();

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
};

module.exports = UsersController;