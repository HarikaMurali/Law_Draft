const express = require('express');
const router = express.Router();
const Draft = require('../models/Draft');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// Helper to log activity silently (never blocks the main response)
const logActivity = async (userId, action, title, type, details, draftId) => {
  try {
    await Activity.create({ userId, action, title, type: type || 'General', details, draftId });
  } catch (err) {
    console.error('Activity log error:', err.message);
  }
}; // Import the middleware

// @route   GET /api/drafts/debug
// @desc    Debug endpoint to check all drafts (for testing purposes)
// @access  Public (temporary for debugging)
router.get('/debug', async (req, res) => {
    try {
        const totalDrafts = await Draft.countDocuments();
        const allDrafts = await Draft.find().sort({ createdAt: -1 }).limit(10);
        
        res.json({
            debug: true,
            totalDrafts,
            recentDrafts: allDrafts.map(draft => ({
                id: draft._id,
                title: draft.title,
                caseType: draft.caseType,
                userId: draft.userId,
                createdAt: draft.createdAt,
                hasText: !!draft.draftText,
                textLength: draft.draftText ? draft.draftText.length : 0
            }))
        });
    } catch (error) {
        res.json({ 
            debug: true,
            error: 'Database connection error',
            details: error.message,
            totalDrafts: 0,
            recentDrafts: []
        });
    }
});

// @route   POST /api/drafts
// @desc    Save a new draft
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, caseType, details, draftText } = req.body;
        const newDraft = new Draft({
            userId: req.user.userId,
            title,
            caseType,
            details,
            draftText
        });
        const draft = await newDraft.save();
        logActivity(req.user.userId, 'Generated Draft', title, caseType, 'Created new draft', draft._id);
        res.status(201).json(draft);
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

// @route   GET /api/drafts
// @desc    Get all drafts for a specific user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const drafts = await Draft.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json(drafts);
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

// @route   GET /api/drafts/:id
// @desc    Get a single draft by its ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const draft = await Draft.findById(req.params.id);
        if (!draft || draft.userId.toString() !== req.user.userId) {
            return res.status(404).json({ msg: 'Draft not found' });
        }
        res.json(draft);
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/drafts/:id
// @desc    Delete a draft by its ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const draft = await Draft.findById(req.params.id);
        if (!draft) {
            return res.status(404).json({ msg: 'Draft not found' });
        }
        
        // Verify the draft belongs to the authenticated user
        if (draft.userId.toString() !== req.user.userId) {
            return res.status(403).json({ msg: 'Not authorized to delete this draft' });
        }
        
        const draftTitle = draft.title;
        const draftType = draft.caseType;
        await Draft.findByIdAndDelete(req.params.id);
        logActivity(req.user.userId, 'Deleted Draft', draftTitle, draftType, 'Deleted draft', req.params.id);
        res.json({ msg: 'Draft deleted successfully', id: req.params.id });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

// @route   PUT /api/drafts/:id
// @desc    Update a draft by its ID
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const draft = await Draft.findById(req.params.id);
        if (!draft) {
            return res.status(404).json({ msg: 'Draft not found' });
        }
        
        // Verify the draft belongs to the authenticated user
        if (draft.userId.toString() !== req.user.userId) {
            return res.status(403).json({ msg: 'Not authorized to update this draft' });
        }
        
        const { title, caseType, details, draftText } = req.body;
        const updatedDraft = await Draft.findByIdAndUpdate(
            req.params.id,
            { title, caseType, details, draftText },
            { new: true }
        );
        logActivity(req.user.userId, 'Edited Draft', title || draft.title, caseType || draft.caseType, 'Updated draft', req.params.id);
        res.json(updatedDraft);
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

module.exports = router;