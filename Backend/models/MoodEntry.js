const mongoose = require('mongoose');
const moodEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    mood: {
        type: String,
        required: true,
        enum: ['happy', 'sad', 'angry', 'neutral', 'excited', 'anxious'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    note:{
        type: String,
        trim: true,
    },
}, {timestamps: true});
module.exports = mongoose.model('MoodEntry', moodEntrySchema);