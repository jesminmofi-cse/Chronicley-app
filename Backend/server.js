const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

/* =========================
   CORS CONFIG (FIXED)
   ========================= */
const allowedOrigins = [
  'https://chronicley-app.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server, Postman, curl
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// 🔥 CRITICAL: allow preflight OPTIONS requests
app.options('*', cors(corsOptions));

/* =========================
   MIDDLEWARE
   ========================= */
app.use(express.json());

/* =========================
   ROOT ROUTE
   ========================= */
app.get('/', (req, res) => {
  res.send('Welcome to Chroniclely API 🌿');
});

/* =========================
   DATABASE
   ========================= */
const connectDB = require('./config/db');
connectDB();

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
   SERVER START
   ========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
