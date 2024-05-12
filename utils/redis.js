const redis = require('redis');

class RedisClient {
  constructor() {
    // Create a client to Redis
    this.client = redis.createClient();

    // Handle errors
    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  async isAlive() {
    try {
      // Ping Redis to check if the connection is successful
      await this.client.ping();
      return true;
    } catch (error) {
      return false;
    }
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    })
  }

  async set(key, value, durationInSeconds) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, durationInSeconds, value, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, deleteCount) => {
        if (err) {
          reject(err);
        } else {
          resolve(deleteCount);
        }
      });
    });
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
