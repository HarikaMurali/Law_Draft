const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// Get activity history for authenticated user
router.get('/history', auth, async (req, res) => {
  try {
    const { action, type, search, page = 1, limit = 50 } = req.query;
    
    const query = { userId: req.user.userId };
    
    // Apply filters
    if (action && action !== 'all') {
      query.action = action;
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } }
      ];
    }
    
    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();
    
    const total = await Activity.countDocuments(query);
    
    res.json({
      success: true,
      activities,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch activity history' });
  }
});

// Fetch resume payload for a specific activity
router.get('/resume/:activityId', auth, async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.activityId,
      userId: req.user.userId
    }).lean();

    if (!activity) {
      return res.status(404).json({ success: false, error: 'Activity not found' });
    }

    const resumeType = activity.metadata?.resumeType;
    const resumePayload = activity.metadata?.resumePayload;

    if (!resumeType || !resumePayload) {
      return res.status(400).json({
        success: false,
        error: 'No resumable data stored for this activity'
      });
    }

    res.json({
      success: true,
      activityId: activity._id,
      action: activity.action,
      title: activity.title,
      details: activity.details,
      draftId: activity.draftId || null,
      resumeType,
      resumePayload
    });
  } catch (error) {
    console.error('Resume fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to load resume data' });
  }
});

// Get activity statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get today's activities
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCount = await Activity.countDocuments({
      userId,
      createdAt: { $gte: today }
    });
    
    // Get this week's activities
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weekCount = await Activity.countDocuments({
      userId,
      createdAt: { $gte: weekAgo }
    });
    
    // Get this month's activities
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    
    const monthCount = await Activity.countDocuments({
      userId,
      createdAt: { $gte: monthAgo }
    });
    
    res.json({
      success: true,
      stats: {
        today: todayCount,
        thisWeek: weekCount,
        thisMonth: monthCount
      }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Log a new activity (internal use by other routes)
router.post('/log', auth, async (req, res) => {
  try {
    const { action, title, type, details, draftId, metadata } = req.body;
    
    const activity = new Activity({
      userId: req.user.userId,
      action,
      title,
      type,
      details,
      draftId,
      metadata
    });
    
    await activity.save();
    
    res.json({ success: true, activity });
  } catch (error) {
    console.error('Activity log error:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

module.exports = router;
