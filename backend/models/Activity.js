const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'Generated Draft',
      'Edited Draft',
      'Deleted Draft',
      'Downloaded Draft',
      'Proofreading',
      'Clause Suggestion',
      'Case Law Search',
      'Statute Search',
      'Dictionary Lookup',
      'Template Used',
      'Login',
      'Registered'
    ]
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'General'
  },
  details: {
    type: String
  },
  draftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Draft'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ action: 1 });
activitySchema.index({ type: 1 });

module.exports = mongoose.model('Activity', activitySchema);
