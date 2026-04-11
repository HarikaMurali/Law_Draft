const mongoose = require('mongoose');
const DraftSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    caseType: String, // For backward compatibility, stores formatted full path
    mainCategory: String, // Civil Law, Criminal Law, etc.
    subcategory: String, // Suits, Complaints, etc.
    specificType: String, // Money Recovery Suit, FIR Draft, etc.
    details: String,
    draftText: String,
    clauses: [{
        key: String,
        title: String,
        text: String
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model('Draft', DraftSchema);