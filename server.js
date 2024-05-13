const express = require('express');
// const dotenv = require('dotenv');
// const path = require('path');


const app = express();
// env vailables middleware
// dotenv.config({path : './config.env'});

// Middleware to parse JSON requests
app.use(express.json());

const port = process.env.PORT || 5000;

// Load routes
const routes = require('./routes/index');

// Use the routes
app.use('/', routes);

// Start the server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
})
