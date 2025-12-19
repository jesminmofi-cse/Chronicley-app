const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

//  CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

//  Middleware
app.use(express.json());

//  route
app.get('/', (req, res) => res.send("Welcome to the Chroniclely"));

//  Connect DB
const connectDB = require('./config/db');
connectDB();

//  Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const journalRoutes = require('./routes/journalRoutes');
app.use('/api/journal', journalRoutes);

const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

const moodRoutes = require('./routes/moodRoutes');
app.use('/api/moods', moodRoutes);

const waterRoutes = require('./routes/waterRoutes');
app.use('/api/water', waterRoutes);

const sleepRoutes = require('./routes/sleepRoutes');
app.use('/api/sleep', sleepRoutes);

const yogaRoutes = require('./routes/yogaRoutes');
app.use('/api/yoga', yogaRoutes);

const gratitudeRoutes = require('./routes/gratitudeRoutes');
app.use('/api/gratitude', gratitudeRoutes);

const periodRoutes = require('./routes/periodRoutes');
app.use('/api/period', periodRoutes);

const wishListRoutes = require('./routes/WishRoutes');
app.use('/api/wishlist', wishListRoutes);

const meditationRoutes = require('./routes/meditationRoutes');
app.use('/api/meditations', meditationRoutes);

const breathingRoutes = require('./routes/breathingRoutes');
app.use('/api/breathing', breathingRoutes);

const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);

const photoRoutes= require('./routes/photoRoutes');
app.use('/api/photos', photoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));