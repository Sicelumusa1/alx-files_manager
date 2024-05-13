const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

const FilesController = {
  postUpload: async (req, res) => {
    try {
      const token = req.headers['x-token'];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userId = await redisClient.get(`auth_$[token]`);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { name, type, parentId = 0, isPublic = false, data } = req.body;
      // Validate required fields
      if (!name) {
        return res.status(400).json({ error: 'Missing name' });
      }
      if (!type || !['folder', 'file', 'image'].includes(type)) {
        return res.status(400).json({ error: 'Missing type' });
      }
      if (type !== 'folder' && !data) {
        return res.status(400).json({ error: 'Missing data' });
      }

      // Check parentId
      if (parentId !== 0) {
        const parentFile = await dbClient.client.db().collection('files').findOne({ _id: parentId });

        if (!parentFile) {
          return res.status(400).json({ error: 'Parent not found' });
        }
        if (parentFile.type !== 'folder') {
          return res.status(400).json({ error: 'Parent is not a folder' });
        }
      }

      // Handle file storage
      let localPath;
      if (type !== 'folder') {
        const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }
        const fileId = uuidv4();
        localPath = path.join(folderPath, fileId);
        const fileContent = Buffer.from(data, 'base64');
        fs.writeFileSync(localPath, fileContent);
      }
      
      //  add file document in DB
      const newFile = {
        userId,
        name,
        type,
        isPublic,
        parentId,
        localPath: type !== 'folder' ? localPath : undefined,
      };
      const { insertedId } = await dbClient.client.db().collection('files').insertOne(newFile);

      // Return the new file
      res.status(201).json({
        _id: insertedId,
        userId,
        name,
        type,
        isPublic,
        parentId,
        localPath,
      });

    } catch (error) {
      console.error('Error uploading file', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = FilesController;