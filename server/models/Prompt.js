const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isSeeded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // This will add createdAt and updatedAt fields automatically
});

const Prompt = mongoose.model('Prompt', promptSchema);

module.exports = Prompt;
