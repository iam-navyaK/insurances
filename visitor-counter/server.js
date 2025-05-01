const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/visitorsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Mongoose schema and model
const visitSchema = new mongoose.Schema({
  name: String,
  count: Number,
});
const Visit = mongoose.model('Visit', visitSchema);

// Redis connection
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.error('Redis error:', err));

(async () => {
  await redisClient.connect();
  console.log('Connected to Redis');
})();

// Increment visitor count
app.post('/api/visit', async (req, res) => {
  let count = await redisClient.get('visitor_count');

  if (count) {
    count = parseInt(count) + 1;
    await redisClient.set('visitor_count', count);
  } else {
    const mongoVisit = await Visit.findOneAndUpdate(
      { name: 'main' },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    count = mongoVisit.count;
    await redisClient.set('visitor_count', count);
  }

  res.json({ count });
});

// Get current visitor count
app.get('/api/visit', async (req, res) => {
  let count = await redisClient.get('visitor_count');

  if (!count) {
    const mongoVisit = await Visit.findOne({ name: 'main' });
    count = mongoVisit?.count || 0;
    await redisClient.set('visitor_count', count);
  }

  res.json({ count: parseInt(count) });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
