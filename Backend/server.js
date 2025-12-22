const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

/* =========================
   CORS CONFIG (SAFE)
   ========================= */
const allowedOrigins = [
  'https://chronicley-app.vercel.app'
];

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

/* =========================
   MIDDLEWARE
   ========================= */
app.use(express.json());

/* =========================
   ROOT
   ========================= */
app.get('/', (req, res) => {
  res.send('Chroniclely API 🌿');
});

/* =========================
   ROUTES
   ========================= */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/journal', require('./routes/journalRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/moods', require('./routes/moodRoutes'));
app.use('/api/water', require('./routes/waterRoutes'));
app.use('/api/sleep', require('./routes/sleepRoutes'));
app.use('/api/yoga', require('./routes/yogaRoutes'));
app.use('/api/gratitude', require('./routes/gratitudeRoutes'));
app.use('/api/period', require('./routes/periodRoutes'));
app.use('/api/wishlist', require('./routes/WishRoutes'));
app.use('/api/meditations', require('./routes/meditationRoutes'));
app.use('/api/breathing', require('./routes/breathingRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/photos', require('./routes/photoRoutes'));

/* =========================
   START SERVER (FIXED)
   ========================= */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();               // 🔑 WAIT for Mongo
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
