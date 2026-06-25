require('dotenv').config();
console.log('Starting Lead Management backend...');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const leadsRoutes = require('./routes/leads');
const trackRoutes = require('./routes/track');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(bodyParser.json({ limit: '1mb' }));

app.use('/api/leads', leadsRoutes);
app.use('/api/track', trackRoutes);
app.get('/', (req, res) => res.send('Lead Management Backend'));

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leads';

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB at', MONGODB_URI);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Mongo connect error', err && err.message ? err.message : err);
    // fallback to in-memory MongoDB for local dev/testing
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to in-memory MongoDB');
      app.locals._mongod = mongod; // keep reference to stop later if needed
      app.listen(PORT, () => console.log(`Server running on port ${PORT} (in-memory DB)`));
    } catch (memErr) {
      console.error('Failed to start in-memory MongoDB', memErr);
      process.exit(1);
    }
  }
}

start();
