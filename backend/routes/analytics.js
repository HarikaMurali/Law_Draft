const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Activity = require('../models/Activity');
const Draft = require('../models/Draft');
const auth = require('../middleware/auth');

// Get comprehensive analytics
router.get('/', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    
    // Get draft counts by case type
    const draftsByType = await Draft.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$caseType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get total drafts
    const totalDrafts = await Draft.countDocuments({ userId });
    
    // Get activity counts by action
    const activityByAction = await Activity.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get activity trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyActivity = await Activity.aggregate([
      { 
        $match: { 
          userId: userId,
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get most active day
    const mostActiveDay = await Activity.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    // Get research activity count
    const researchCount = await Activity.countDocuments({
      userId,
      action: { $in: ['Case Law Search', 'Statute Search', 'Dictionary Lookup'] }
    });
    
    // Get total activities
    const totalActivities = await Activity.countDocuments({ userId });
    
    // Calculate average daily activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivities = await Activity.countDocuments({
      userId,
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    const avgDailyActivity = Math.round(recentActivities / 30);
    
    // Get monthly drafts (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyDrafts = await Draft.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%b", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Map month names properly
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = monthlyDrafts.map(m => ({
      month: m._id,
      count: m.count
    }));
    
    res.json({
      success: true,
      data: {
        totalDrafts,
        draftsByType: draftsByType.map(d => ({
          type: d._id || 'Other',
          count: d.count
        })),
        activityByAction: activityByAction.map(a => ({
          action: a._id,
          count: a.count
        })),
        dailyActivity: dailyActivity.map(d => ({
          date: d._id,
          count: d.count
        })),
        monthlyDrafts: monthlyData.length > 0 ? monthlyData : [
          { month: 'Jan', count: 0 },
          { month: 'Feb', count: 0 },
          { month: 'Mar', count: 0 }
        ],
        researchCount,
        totalActivities,
        avgDailyActivity,
        mostActiveDay: mostActiveDay.length > 0 ? {
          date: mostActiveDay[0]._id,
          count: mostActiveDay[0].count
        } : null
      }
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
