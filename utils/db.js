const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';
    
    //  Create a MongoDB client
    this.client = new MongoClient(`mongodb://${host}:${port}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.connect();

    // Handle error
    this.client.on('error', (err) => {
      console.error('MongoDB error:', err);
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.log('Failed to connect to mongoDB:', error);
    }
  }

  async isAlive() {
    try {
      // Connect to MongoDB and check if the connection is successful
      await this.client.connect();
      return true;
    } catch (error) {
      return false;
    } finally {
      // await this.client.close();
    }
  }

  async nbUsers() {
    try {
      await this.connect();
      const db = this.client.db();
      const usersCollection = db.collection('users');
      const count = await usersCollection.countDocuments();
      return count;
    } catch (error) {
      return 0;
    } 
  }

  async nbFiles() {
    try {
      await this.connect();
      const db = this.client.db();
      const filesCollection = db.collection('files');
      const count = await filesCollection.countDocuments();
      return count;
    } catch (error) {
      return 0;
    } 
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
module.exports = dbClient;
