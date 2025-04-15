const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
    trim: true
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'neutral', 'excited', 'anxious', 'angry', 'other'],
    default: 'neutral'
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    required: [true, 'User ID is required']
  }
});

// Update the updatedAt field before saving
JournalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Journal', JournalSchema);
