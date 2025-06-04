const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    date_time: { type: Date, default: Date.now },
    comment: { type: String, required: true },
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    photo_id: {
        type: String,
        ref: 'Photo',
        required: true
    }
})

const Comment = mongoose.model.Comments || mongoose.model('Comment', commentSchema);

module.exports = Comment;